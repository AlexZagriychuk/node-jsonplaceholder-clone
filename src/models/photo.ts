import mongoose from "mongoose";
import { registerIdUpdater, removePrivateMongoFields } from "../utils/mongoUtils";


export const photoIdCounterName = "PhotoID"

export interface IPhoto {
    "_id": number,
    "albumId": number,
    "title": string,
    "url": string,
    "thumbnailUrl": string,
}

const photoSchema = new mongoose.Schema<IPhoto>({
    "_id": {type: Number, default: -1}, // default must not be positive if we use registerIdUpdater
    "albumId": {type: Number, ref: "Album"},
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

registerIdUpdater(photoSchema, photoIdCounterName)

export const photoModel = mongoose.model<IPhoto>("Photo", photoSchema)