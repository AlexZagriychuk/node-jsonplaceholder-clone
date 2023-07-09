import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose";
import { deleteOneDocByFilterQuery, findAllDocsByFilterQuery, findOneDocByFilterQuery, getDbFilterQuery, replaceOneDocByFilterQuery, updateOneDocByFilterQuery } from "../utils/mongoUtils";


function getAllByQueryParamsCommonImpl(model: mongoose.Model<any>, customQueryParams: mongoose.FilterQuery<any> | null) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            // queryParams is either a mix of customQueryParams + req.query or req.query only (if customQueryParams is null)
            const queryParams = Object.assign(req.query, customQueryParams) 

            // false - to return empty arr if no docs found (does not throw error)
            const foundDocs = await findAllDocsByFilterQuery(model, queryParams, false)
            res.status(200).json(foundDocs)
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestGetAllByCustomQueryParams(model: mongoose.Model<any>, customQueryParams: mongoose.FilterQuery<any>) {
    return getAllByQueryParamsCommonImpl(model, customQueryParams)
}

export function processRequestGetAllByRequestQueryParams(model: mongoose.Model<any>) {
    return getAllByQueryParamsCommonImpl(model, null)
}

export function processRequestGetById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const dbFilterQuery = getDbFilterQuery(req, [{reqQueryParam: "id", dbParam: "_id"}])
            const foundDoc = await findOneDocByFilterQuery(model, dbFilterQuery, true)
            res.status(200).json(foundDoc)
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestPost(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const createdDoc = await model.create(req.body)
            res.status(201).json(createdDoc)
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestPutById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const dbFilterQuery = getDbFilterQuery(req, [{reqQueryParam: "id", dbParam: "_id"}])
            // true - will update doc, or create if doc with this _id is not present
            const {doc, updatedExisting} = await replaceOneDocByFilterQuery(model, dbFilterQuery, req.body, true)

            const status = updatedExisting ? 200 : 201
            res.status(status).json(doc)
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestPatchById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const dbFilterQuery = getDbFilterQuery(req, [{reqQueryParam: "id", dbParam: "_id"}])
            // Will update doc, or throw error if doc with this _id is not present
            const updatedDoc = await updateOneDocByFilterQuery(model, dbFilterQuery, req.body)
            res.status(201).json(updatedDoc)
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestDeleteById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {        
        try {
            const dbFilterQuery = getDbFilterQuery(req, [{reqQueryParam: "id", dbParam: "_id"}])
            await deleteOneDocByFilterQuery(model, dbFilterQuery)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
