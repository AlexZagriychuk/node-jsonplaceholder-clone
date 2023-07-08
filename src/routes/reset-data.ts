import express, { Request, Response, NextFunction } from "express"
import { userModel as User } from "../models/user";
import { postModel as Post } from "../models/post";
import { todoModel as Todo } from "../models/todo";
import { albumModel as Album } from "../models/album";
import { generateAlbums, generatePosts, generateTodos, generateUsers } from "../utils/mongoDbDataGenerator";

const router = express.Router()

// Removing existing data from MongoDB and uploading initial test data 
// ToDo: update in the future to allow this API call to Admin user only
router.put("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        await User.deleteMany({}) // delete all
        await User.insertMany(generateUsers())

        await Post.deleteMany({}) // delete all
        await Post.insertMany(generatePosts())

        await Todo.deleteMany({}) // delete all
        await Todo.insertMany(generateTodos())

        await Album.deleteMany({}) // delete all
        await Album.insertMany(generateAlbums())
        
        res.status(201).send("Data for: [users, posts, todos, albums] has been reset in the MongoDB")
    } catch (error) {
        next(error)
    }
})

export default router