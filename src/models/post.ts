import mongoose from "mongoose";
import { removePrivateMongoFields, registerIdUpdater } from "../utils/mongoUtils";


export const postIdCounterName = "PostID"

export interface IPost {
    "_id": number,
    "userId": number,
    "title": string,
    "body": string,
    "createdAt": Date
}

const postSchema = new mongoose.Schema<IPost>({
    "_id": {type: Number, default: -1}, // default must not be positive if we use registerIdUpdater
    "userId": {type: Number, ref: "User"},
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

registerIdUpdater(postSchema, postIdCounterName)

export const postModel = mongoose.model<IPost>("Post", postSchema)