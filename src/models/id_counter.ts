import mongoose from "mongoose";
import { removePrivateMongoFields } from "../utils/mongoUtils";


export interface IIdCounter {
    "_id": string,
    "last_id": number,
}

const idCounterSchema = new mongoose.Schema<IIdCounter>({
    "_id": String,
    "last_id": Number,
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

export const idCounterModel = mongoose.model<IIdCounter>("Id_Counter", idCounterSchema)