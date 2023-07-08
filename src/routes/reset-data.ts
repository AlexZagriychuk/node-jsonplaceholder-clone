import express, { Request, Response, NextFunction } from "express"
import { idCounterModel as IdCounter } from "../models/id_counter";
import { userModel as User, userIdCounterName } from "../models/user";
import { postModel as Post, postIdCounterName } from "../models/post";
import { todoModel as Todo, todoIdCounterName } from "../models/todo";
import { albumModel as Album, albumIdCounterName } from "../models/album";
import { photoModel as Photo, photoIdCounterName } from "../models/photo";
import { commentModel as Comment, commentIdCounterName } from "../models/comment";
import { generateAlbums, generateComments, generatePhotos, generatePosts, generateTodos, generateUsers } from "../utils/mongoDbDataGenerator";

const router = express.Router()

function getMaxId(objs: Array<{_id: number}>) {
    const maxId = Math.max(...objs.map(obj => obj._id))
    console.log("maxId:", maxId)
    return maxId
}

// Removing existing data from MongoDB and uploading initial test data 
// ToDo: update in the future to allow this API call to Admin user only
router.put("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        await IdCounter.deleteMany({}) // delete all counters

        const users = generateUsers()
        await User.deleteMany({}) // delete all
        await User.insertMany(users)
        await IdCounter.create({_id: userIdCounterName, last_id: getMaxId(users)})

        const posts = generatePosts()
        await Post.deleteMany({}) // delete all
        await Post.collection.createIndex( { userId : 1 } )
        await Post.insertMany(posts)
        await IdCounter.create({_id: postIdCounterName, last_id: getMaxId(posts)})

        const todos = generateTodos()
        await Todo.deleteMany({}) // delete all
        await Todo.collection.createIndex( { userId : 1 } )
        await Todo.insertMany(todos)
        await IdCounter.create({_id: todoIdCounterName, last_id: getMaxId(todos)})

        const albums = generateAlbums()
        await Album.deleteMany({}) // delete all
        await Album.collection.createIndex( { userId : 1 } )
        await Album.insertMany(albums)
        await IdCounter.create({_id: albumIdCounterName, last_id: getMaxId(albums)})

        const photos = generatePhotos()
        await Photo.deleteMany({}) // delete all
        await Photo.collection.createIndex( { albumId : 1 } )
        await Photo.insertMany(photos)
        await IdCounter.create({_id: photoIdCounterName, last_id: getMaxId(photos)})

        const comments = generateComments()
        await Comment.deleteMany({}) // delete all
        await Comment.collection.createIndex( { postId : 1 } )
        await Comment.insertMany(comments)
        await IdCounter.create({_id: commentIdCounterName, last_id: getMaxId(comments)})

        res.status(201).send("Data for: [users, posts, todos, albums, photos, comments] has been reset in the MongoDB")
    } catch (error) {
        next(error)
    }
})

export default router