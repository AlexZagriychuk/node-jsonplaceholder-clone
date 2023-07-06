import express, { Request, Response, NextFunction } from "express"
import { postModel as Post } from "../models/post";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { AppError } from "../middleware/errorHandlers";


const router = express.Router()

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const allPosts = await Post.find()
        res.type("json").send(JSON.stringify(allPosts, null, 2))
    } catch (error) {
        next(error)
    }
})

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    
    try {
        const post = await Post.findById(id)

        if(post) {
            res.status(200).type("json").send(JSON.stringify(post, null, 2))
        } else {
            // ToDo [question]: is it OK to create a new Error and use next (expect the error to be logged and response to be sent by one of the following middlewares) instead of sending response res.json?
            // res.status(404).send(`Cannot find post with _ID ${id}`)
            next(new AppError(404, `Cannot find post with _ID ${id}`))
        }
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 404, because the object with this illegal _ID does not exist
        if(error.kind === "ObjectId") {
            // res.status(404).send(`Cannot find post with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`)
            next(new AppError(404, `Cannot find post with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`))
        } else {
            next(error)
        }
    }
})

router.post("/", verifyBodyIsNotEmpty, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const post = req.body
        const createdPost = await Post.create(post)
        res.status(201).type("json").send(JSON.stringify(createdPost, null, 2))
    } catch (error) {
        next(error)
    }
})

router.patch("/:id", verifyBodyIsNotEmpty, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    
    try {
        const postUpdates = req.body
        const postUpdateResponse = await Post.findByIdAndUpdate(id, postUpdates, { new: true })

        if(postUpdateResponse) {
            res.status(201).type("json").send(JSON.stringify(postUpdateResponse, null, 2))
        } else {
            // res.status(404).send(`Cannot find post with _ID ${id}`)
            next(new AppError(404, `Cannot find post with _ID ${id}`))
        }
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 404, because the object with this illegal _ID does not exist
        if(error.kind === "ObjectId") {
            // res.status(404).send(`Cannot find post with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`)
            next(new AppError(404, `Cannot find post with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`))
        } else {
            next(error)
        }
    }
})

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const deletedPost = await Post.findByIdAndDelete(id)

        const status = deletedPost ? 200 : 204
        res.status(status).json("{}")
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 204, because the object with this ID
        // cannot exist. Therefore, if the post requests to delete it, we respond that it does not exist (204 No Content)
        if(error.kind === "ObjectId") {
            res.status(204).json("{}")
        } else {
            next(error)
        }
    }
})

export default router