import mongoose from "mongoose";
import { removePrivateMongoFields } from "../utils/mongoUtils";
import { ObjectId } from "mongodb";


export interface IAlbum {
    "_id": ObjectId,
    "userId": ObjectId,
    "title": string,
}

const albumSchema = new mongoose.Schema<IAlbum>({
    "_id": {type: ObjectId, default: () => new ObjectId()},
    "userId": {type: ObjectId, ref: "User"},
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

export const albumModel = mongoose.model<IAlbum>("Album", albumSchema)