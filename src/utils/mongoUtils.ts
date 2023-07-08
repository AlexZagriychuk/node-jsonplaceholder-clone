import mongoose from "mongoose";
import { AppError } from "../middleware/errorHandlers";
import { Request } from "express";
import { idCounterModel as IdCounter } from "../models/id_counter";

export function removePrivateMongoFields(_doc: mongoose.Document<any>, ret: Record<string, any>, _game: mongoose.ToObjectOptions<any>) {
    delete ret.__v;
}

// Find counter by name and increment by 1
export async function getNextIdCounterValue(idCounterName: string) {
    const idCounterDocument = await IdCounter.findByIdAndUpdate(idCounterName, {$inc: {last_id: 1} }, {new: true, upsert: true})
    return idCounterDocument.last_id
}

// This function activates pre validation listener, which updates _id based on the value from IdCounter (for the current idCounterName)
// If _id is already specified, then it will not be changed (which means we need to strictly control that user is not passing _id in post requests)
export function registerIdUpdater(schema: mongoose.Schema, idCounterName: string) {
    schema.pre('validate', async function(next) {
        const doc = this
        // Only update _id if the doc is new
        if(!doc.isNew) {
            next()
            return
        }

        let currDocId = doc._id

        if(typeof currDocId !== "number") {
            throw new AppError(500, `[Implementation error] doc._id ${doc._id} must be a number for registerPreValidationIdUpdater to work`)
        }

        if(currDocId > 0) {
            // if doc._id is already specified we do not change it and keep idCounterModel next_id as is (we should update it from the code if we pass fixed _id values)
            next()
            return
        }

        const nextId = await getNextIdCounterValue(idCounterName)
        doc._id = nextId;
        next();
    }
)}


type ParamsMapping = Array<{reqQueryParam: string, dbParam: string}>

// Generates FilterQuery for MongoDB based on request params and mapping between request params and Mongo DB param (can throw error)
export function getDbFilterQuery(req: Request, paramsMapping: ParamsMapping) : mongoose.FilterQuery<any> {
    const missingQueryParams = [] as Array<string>

    const dbFilterQuery = paramsMapping.reduce((acc, paramMapping) => {
        if(req.params.hasOwnProperty(paramMapping.reqQueryParam)) {
            acc[paramMapping.dbParam] = req.params[paramMapping.reqQueryParam]
        } else {
            missingQueryParams.push(paramMapping.reqQueryParam)
        }
        return acc
    }, {} as any)

    if(missingQueryParams.length > 0) {
        throw new AppError(500, `[Server Implementation Error] request query params ${req.params} do not include specified queryParams ${missingQueryParams}`)
    }

    return dbFilterQuery
}

// If throwErrorIfNoDocsFound = true: returns array with 1+ found docs or throws error
// If throwErrorIfNoDocsFound = false: returns empty array or array with 1+ found docs
export async function findAllDocsByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, throwErrorIfNoDocsFound = true) {
    const modelName = model.modelName
    const docs = await model.find(dbFilterQuery)

    if(docs.length === 0 && throwErrorIfNoDocsFound) {
        throw new AppError(404, `Cannot find ${modelName} by filter query ${JSON.stringify(dbFilterQuery)}`)
    } else {
        return docs
    }
}

// Returns single found doc or throws error (0 or multiple found docs, or unexpected error) 
export async function findOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, throwErrorIfMultipleDocsFound = true) {
    const foundDocs = await findAllDocsByFilterQuery(model, dbFilterQuery, true)

    if(foundDocs.length > 1 && throwErrorIfMultipleDocsFound) {
        throw new AppError(500, `Found more than one (${foundDocs.length}) ${model.modelName} by filter query ${JSON.stringify(dbFilterQuery)}`)
    } else {
        return foundDocs[0]
    }
}

// Returns response object { doc: UpdatedOrCreatedDoc, updatedExisting: boolean} or throws error
async function updateOrReplaceOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, updateDoc: mongoose.UpdateQuery<any>, replace = false, createIfNotPresent = false) {
    const modelName = model.modelName

    // new: true - return updated document instead of original
    const options = {upsert: createIfNotPresent, new: true, rawResult: true}
    const updateRawResult = replace 
        ? await model.findOneAndReplace(dbFilterQuery, updateDoc, options)
        : await model.findOneAndUpdate(dbFilterQuery, updateDoc, options)

    if(updateRawResult.ok === 1) {
        return { doc: updateRawResult.value, updatedExisting: updateRawResult.lastErrorObject?.updatedExisting }
    } else {
        throw new AppError(404, `Cannot find ${modelName} by filter query ${JSON.stringify(dbFilterQuery)}`)
    }
}

// Only updates fields of existing document. Returns UpdatedDoc or throws error
export async function updateOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, updateDoc: mongoose.UpdateQuery<any>) {
    const { doc: updatedDoc } = await updateOrReplaceOneDocByFilterQuery(model, dbFilterQuery, updateDoc, false, false)
    return updatedDoc
}

// Returns response object { doc: UpdatedOrCreatedDoc, updatedExisting: boolean} or throws error
export async function replaceOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, updateDoc: mongoose.UpdateQuery<any>, createIfNotPresent = true) {
    return await updateOrReplaceOneDocByFilterQuery(model, dbFilterQuery, updateDoc, true, createIfNotPresent)
}

// Returns deleted doc or null if doc has not been found (no error if no need to delete anything)
export async function deleteOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>) {        
    return await model.findOneAndDelete(dbFilterQuery)
}