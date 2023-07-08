import mongoose from "mongoose";
import { removePrivateMongoFields } from "../utils/mongoUtils";
import { ObjectId } from "mongodb";


export interface IComment {
    "_id": ObjectId,
    "postId": ObjectId,
    "name": string,
    "email": string,
    "body": string,
    "createdAt": Date
}

const commentSchema = new mongoose.Schema<IComment>({
    "_id": {type: ObjectId, default: () => new ObjectId()},
    "postId": {type: ObjectId, ref: "Post"},
    "name": String,
    "email": String,
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

export const commentModel = mongoose.model<IComment>("Comment", commentSchema)