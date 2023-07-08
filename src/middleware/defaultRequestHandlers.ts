import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose";
import { deleteOneDocByFilterQuery, findAllDocsByFilterQuery, findOneDocByFilterQuery, getDbFilterQuery, replaceOneDocByFilterQuery, updateOneDocByFilterQuery } from "../utils/mongoUtils";


function getAllByQueryParamsCommonImpl(model: mongoose.Model<any>, customQueryParams: mongoose.FilterQuery<any> | null) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const queryParams = customQueryParams || req.query

            // false - to return empty arr if no docs found (does not throw error)
            const foundDocs = await findAllDocsByFilterQuery(model, queryParams, false)
            res.status(200).type("json").send(JSON.stringify(foundDocs, null, 2))
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
            res.status(200).type("json").send(JSON.stringify(foundDoc, null, 2))
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestPost(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const createdDoc = await model.create(req.body)
            res.status(201).type("json").send(JSON.stringify(createdDoc, null, 2))
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestPutById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const dbFilterQuery = getDbFilterQuery(req, [{reqQueryParam: "id", dbParam: "_id"}])
            const {doc, updatedExisting} = await replaceOneDocByFilterQuery(model, dbFilterQuery, req.body, true)

            const status = updatedExisting ? 200 : 201
            res.status(status).type("json").send(JSON.stringify(doc, null, 2))
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestPatchById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const dbFilterQuery = getDbFilterQuery(req, [{reqQueryParam: "id", dbParam: "_id"}])
            const updatedDoc = await updateOneDocByFilterQuery(model, dbFilterQuery, req.body)
            res.status(201).type("json").send(JSON.stringify(updatedDoc, null, 2))
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
