import mongoose from "mongoose";
import { removePrivateMongoFields } from "../utils/mongoUtils";
import { ObjectId } from "mongodb";


export interface IPhoto {
    "_id": ObjectId,
    "albumId": ObjectId,
    "title": string,
    "url": string,
    "thumbnailUrl": string,
}

const photoSchema = new mongoose.Schema<IPhoto>({
    "_id": {type: ObjectId, default: () => new ObjectId()},
    "albumId": {type: ObjectId, ref: "Album"},
    "title": String,
    "url": String,
    "thumbnailUrl": String,
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

export const photoModel = mongoose.model<IPhoto>("Photo", photoSchema)