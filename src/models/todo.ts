import mongoose from "mongoose";
import { registerIdUpdater, removePrivateMongoFields } from "../utils/mongoUtils";


export const todoIdCounterName = "TodoID"

export interface ITodo {
    "_id": number,
    "userId": number,
    "title": string,
    "completed": boolean,
}

const todoSchema = new mongoose.Schema<ITodo>({
    "_id": {type: Number, default: -1}, // default must not be positive if we use registerIdUpdater
    "userId": {type: Number, ref: "User"},
    "title": String,
    "completed": Boolean,
}, {
    // Throw error if values passed to our model constructor are not specified in our schema (unknown keys)
    strict: "throw",
    strictQuery: "throw",

    toObject: {
        transform: removePrivateMongoFields
    },
    toJSON: {
        transform: removePrivateMongoFields
    }
})

registerIdUpdater(todoSchema, todoIdCounterName)

export const todoModel = mongoose.model<ITodo>("Todo", todoSchema)
