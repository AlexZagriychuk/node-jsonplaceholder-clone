import mongoose from "mongoose";
import { removePrivateMongoFields } from "../utils/mongoUtils";
import { ObjectId } from "mongodb";


export interface IPost {
    "_id": ObjectId,
    "userId": ObjectId,
    "title": string,
    "body": string,
    "createdAt": Date
}

const postSchema = new mongoose.Schema<IPost>({
    "_id": {type: ObjectId, default: () => new ObjectId()},
    "userId": {type: ObjectId, ref: "User"},
    "title": String,
    "body": String,
    "createdAt": { type: Date, default: () => Date.now() }
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

export const postModel = mongoose.model<IPost>("Post", postSchema)