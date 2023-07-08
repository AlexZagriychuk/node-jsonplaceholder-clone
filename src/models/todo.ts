import mongoose from "mongoose";
import { removePrivateMongoFields } from "../utils/mongoUtils";
import { ObjectId } from "mongodb";


export interface ITodo {
    "_id": ObjectId,
    "userId": ObjectId,
    "title": string,
    "completed": boolean,
}

const todoSchema = new mongoose.Schema<ITodo>({
    "_id": {type: ObjectId, default: () => new ObjectId()},
    "userId": {type: ObjectId, ref: "User"},
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

export const todoModel = mongoose.model<ITodo>("Todo", todoSchema)
