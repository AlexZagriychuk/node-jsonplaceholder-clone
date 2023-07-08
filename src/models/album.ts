import mongoose from "mongoose";
import { getNextIdCounterValue, registerIdUpdater, removePrivateMongoFields } from "../utils/mongoUtils";

export const albumIdCounterName = "AlbumID"

export interface IAlbum {
    "_id": number,
    "userId": number,
    "title": string,
}

const albumSchema = new mongoose.Schema<IAlbum>({
    "_id": {type: Number, default: -1}, // default must not be positive if we use registerIdUpdater
    "userId": {type: Number, ref: "User"},
    "title": String,
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

registerIdUpdater(albumSchema, albumIdCounterName)

export const albumModel = mongoose.model<IAlbum>("Album", albumSchema)