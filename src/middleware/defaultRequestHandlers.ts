import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose";
import { AppError } from "./errorHandlers";

export function processRequestGetAll(model: mongoose.Model<any>) {
    // ToDo: figure out fow to avoid creating a new function on each call (add some kind of caching/memoizing)
    return async function (_req: Request, res: Response, next: NextFunction) {
        try {
            const allItems = await model.find()
            res.type("json").send(JSON.stringify(allItems, null, 2))
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestGetById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const modelName = model.modelName
        const id = req.params.id
    
        try {
            const doc = await model.findById(id)
    
            if(doc) {
                res.status(200).type("json").send(JSON.stringify(doc, null, 2))
            } else {
                // ToDo [question]: is it OK to create a new Error and use next (expect the error to be logged and response to be sent by one of the following middlewares) instead of sending response res.json?
                // res.status(404).send(`Cannot find ${modelName} with _ID ${id}`)
                next(new AppError(404, `Cannot find ${modelName} with _ID ${id}`))
            }
        } catch (error: any) {
            // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 404, because the object with this illegal _ID does not exist
            if(error.kind === "ObjectId") {
                // res.status(404).send(`Cannot find ${modelName} with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`)
                next(new AppError(404, `Cannot find ${modelName} with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`))
            } else {
                next(error)
            }
        }
    }
}

export function processRequestPost(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const doc = req.body
            const createdDoc = await model.create(doc)
            res.status(201).type("json").send(JSON.stringify(createdDoc, null, 2))
        } catch (error) {
            next(error)
        }
    }
}

export function processRequestPatchById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const modelName = model.modelName
        const id = req.params.id

        try {
            const docUpdates = req.body
            const docUpdateResponse = await model.findByIdAndUpdate(id, docUpdates, { new: true })
    
            if(docUpdateResponse) {
                res.status(201).type("json").send(JSON.stringify(docUpdateResponse, null, 2))
            } else {
                // res.status(404).send(`Cannot find ${modelName} with _ID ${id}`)
                next(new AppError(404, `Cannot find ${modelName} with _ID ${id}`))
            }
        } catch (error: any) {
            // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 404, because the object with this illegal _ID does not exist
            if(error.kind === "ObjectId") {
                // res.status(404).send(`Cannot find ${modelName} with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`)
                next(new AppError(404, `Cannot find ${modelName} with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`))
            } else {
                next(error)
            }
        }
    }
}

export function processRequestDeleteById(model: mongoose.Model<any>) {
    return async function (req: Request, res: Response, next: NextFunction) {        
        try {
            const id = req.params.id
            const deletedDoc = await model.findByIdAndDelete(id)
    
            const status = deletedDoc ? 200 : 204
            res.status(status).json("{}")
        } catch (error: any) {
            // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 204, because the doc with this ID
            // cannot exist. Therefore, if the user requests to delete it, we respond that it does not exist (204 No Content)
            if(error.kind === "ObjectId") {
                res.status(204).json("{}")
            } else {
                next(error)
            }
        }
    }
}
