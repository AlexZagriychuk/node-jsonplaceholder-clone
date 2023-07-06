import express, { Request, Response, NextFunction } from "express"
import mongoose from "mongoose";
import { userModel as User } from "../models/user";
import { generateUsers } from "../utils/mongoDbDataGenerator";

const router = express.Router()

// Removing existing data from MongoDB and uploading initial test data 
// ToDo: update in the future to allow this API call to Admin user only
router.put("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const db = mongoose.connection
        await db.collection('users').deleteMany({})
        await User.insertMany(generateUsers())

        res.status(201).send("Data for: [users] has been reset in the MongoDB")
    } catch (error) {
        next(error)
    }
})

export default router