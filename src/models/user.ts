import mongoose from "mongoose";
import { registerIdUpdater, removePrivateMongoFields } from "../utils/mongoUtils";


export const userIdCounterName = "UserID"

export enum UserType {
    ADMIN = "ADMIN",
    WRITER = "WRITER",
    READER = "READER"
}

export interface IUser {
    "_id": number,
    "name": string,
    "username": string,
    "type": UserType,
    "avatarSmall": string,
    "avatarBig": string,
    "email": string,
    "address": {
        "street": string,
        "suite": string,
        "city": string,
        "zipcode": string,
        "geo": {
            "lat": string,
            "lng": string
        }
    },
    "phone": string,
    "website": string,
    "company": {
        "name": string,
        "catchPhrase": string,
        "bs": string
    },
    "registered": Date
}

const userSchema = new mongoose.Schema<IUser>({
    "_id": {type: Number, default: -1}, // default must not be positive if we use registerIdUpdater
    "name": String,
    "username": String,
    "type": {type: String, enum: UserType},
    "avatarSmall": String,
    "avatarBig": String,
    "email": String,
    "address": {
        "street": String,
        "suite": String,
        "city": String,
        "zipcode": String,
        "geo": {
            "lat": String,
            "lng": String
        }
    },
    "phone": String,
    "website": String,
    "company": {
        "name": String,
        "catchPhrase": String,
        "bs": String
    },
    "registered": { type: Date, default: () => Date.now() }
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

registerIdUpdater(userSchema, userIdCounterName)

export const userModel = mongoose.model<IUser>("User", userSchema)