import express, { Request, Response, NextFunction } from "express"
import { userModel as User } from "../models/user";
import { postModel as Post } from "../models/post";
import { todoModel as Todo } from "../models/todo";
import { albumModel as Album } from "../models/album";
import { photoModel as Photo } from "../models/photo";
import { commentModel as Comment } from "../models/comment";
import { generateAlbums, generateComments, generatePhotos, generatePosts, generateTodos, generateUsers } from "../utils/mongoDbDataGenerator";

const router = express.Router()

// Removing existing data from MongoDB and uploading initial test data 
// ToDo: update in the future to allow this API call to Admin user only
router.put("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        await User.deleteMany({}) // delete all
        await User.insertMany(generateUsers())

        await Post.deleteMany({}) // delete all
        await Post.collection.createIndex( { userId : 1 } )
        await Post.insertMany(generatePosts())

        await Todo.deleteMany({}) // delete all
        await Todo.collection.createIndex( { userId : 1 } )
        await Todo.insertMany(generateTodos())

        await Album.deleteMany({}) // delete all
        await Album.collection.createIndex( { userId : 1 } )
        await Album.insertMany(generateAlbums())

        await Photo.deleteMany({}) // delete all
        await Photo.collection.createIndex( { albumId : 1 } )
        await Photo.insertMany(generatePhotos())

        await Comment.deleteMany({}) // delete all
        await Comment.collection.createIndex( { postId : 1 } )
        await Comment.insertMany(generateComments())

        res.status(201).send("Data for: [users, posts, todos, albums, photos, comments] has been reset in the MongoDB")
    } catch (error) {
        next(error)
    }
})

export default router