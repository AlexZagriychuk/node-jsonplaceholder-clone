import mongoose from "mongoose";
import { registerIdUpdater, removePrivateMongoFields } from "../utils/mongoUtils";


export const commentIdCounterName = "CommentID"

export interface IComment {
    "_id": number,
    "postId": number,
    "name": string,
    "email": string,
    "body": string,
    "createdAt": Date
}

const commentSchema = new mongoose.Schema<IComment>({
    "_id": {type: Number, default: -1}, // default must not be positive if we use registerIdUpdater
    "postId": {type: Number, ref: "Post"},
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

registerIdUpdater(commentSchema, commentIdCounterName)

export const commentModel = mongoose.model<IComment>("Comment", commentSchema)