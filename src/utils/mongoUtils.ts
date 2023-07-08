import mongoose from "mongoose";
import { AppError } from "../middleware/errorHandlers";
import { Request } from "express";

export function removePrivateMongoFields(_doc: mongoose.Document<any>, ret: Record<string, any>, _game: mongoose.ToObjectOptions<any>) {
    delete ret.__v;
}


type ParamsMapping = Array<{reqQueryParam: string, dbParam: string}>

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

export async function findAllDocsByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, throwErrorIfNoDocsFound = true) {
    const modelName = model.modelName

    try {
        const docs = await model.find(dbFilterQuery)

        if(docs.length === 0 && throwErrorIfNoDocsFound) {
            throw new AppError(404, `Cannot find ${modelName} by filter query ${JSON.stringify(dbFilterQuery)}`)
        } else {
            return docs
        }
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we throw 404, because the object with this illegal _ID does not exist
        if(error.kind === "ObjectId") {
            throw new AppError(404, `Cannot find ${modelName} by filter query ${JSON.stringify(dbFilterQuery)} (illegal ObjectId value, must be 24 character hexadecimal)`)
        } else {
            throw error
        }
    }
}

export async function findOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, throwErrorIfMultipleDocsFound = true) {
    const foundDocs = await findAllDocsByFilterQuery(model, dbFilterQuery, true)

    if(foundDocs.length > 1 && throwErrorIfMultipleDocsFound) {
        throw new AppError(500, `Found more than one (${foundDocs.length}) ${model.modelName} by filter query ${JSON.stringify(dbFilterQuery)}`)
    } else {
        return foundDocs[0]
    }
}

// Returns response object { doc: UpdatedOrCreatedDoc, updatedExisting: boolean} or throws error
async function updateOrReplaceOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, updateDoc: mongoose.UpdateQuery<any>, replaceExisting = false, createIfNotPresent = false) {
    const modelName = model.modelName

    try {
        // new: true - return updated document instead of original
        const options = {upsert: createIfNotPresent, new: true, rawResult: true}
        const updateRawResult = replaceExisting 
            ? await model.findOneAndReplace(dbFilterQuery, updateDoc, options)
            : await model.findOneAndUpdate(dbFilterQuery, updateDoc, options)

        if(updateRawResult.ok === 1) {
            return { doc: updateRawResult.value, updatedExisting: updateRawResult.lastErrorObject?.updatedExisting }
        } else {
            throw new AppError(404, `Cannot find ${modelName} by filter query ${JSON.stringify(dbFilterQuery)}`)
        }
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we throw 404, because the object with this illegal _ID does not exist
        if(error.kind === "ObjectId") {
            throw new AppError(404, `Cannot find ${modelName} by filter query ${JSON.stringify(dbFilterQuery)} (illegal ObjectId value, must be 24 character hexadecimal)`)
        } else {
            throw error
        }
    }
}

// Only updates fields of existing document. Returns UpdatedDoc or throws error
export async function updateOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, updateDoc: mongoose.UpdateQuery<any>) {
    const { doc, updatedExisting} = await updateOrReplaceOneDocByFilterQuery(model, dbFilterQuery, updateDoc, false, false)
    return doc
}

// Returns response object { doc: UpdatedOrCreatedDoc, updatedExisting: boolean} or throws error
export async function replaceOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>, updateDoc: mongoose.UpdateQuery<any>, createIfNotPresent = true) {
    return await updateOrReplaceOneDocByFilterQuery(model, dbFilterQuery, updateDoc, true, createIfNotPresent)
}

// Returns deleted doc or null if doc has not been found (no error if no need to delete anything)
export async function deleteOneDocByFilterQuery(model: mongoose.Model<any>, dbFilterQuery: mongoose.FilterQuery<any>) {        
    try {
        return await model.findOneAndDelete(dbFilterQuery)
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we return null,
        // because the doc with this ID cannot exist. Therefore, if the user requests to delete it, 
        // we respond  the same way as model.findOneAndDelete if doc does not exist (returns null)        
        if(error.kind === "ObjectId") {
            return null
        } else {
            throw error
        }
    }
}