import mongoose from "mongoose";

export interface IUser {
    "id": number,
    "name": string,
    "username": string,
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
    "createdAt": Date
}

const userSchema = new mongoose.Schema<IUser>({
    "id": Number,
    "name": String,
    "username": String,
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
    createdAt: { type: Date, default: () => Date.now() }
})

export const userModel = mongoose.model<IUser>("User", userSchema)