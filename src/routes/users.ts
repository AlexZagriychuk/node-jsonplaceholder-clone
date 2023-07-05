import express, { Request, Response, NextFunction } from "express"
import { userModel as User } from "../models/user";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { AppError } from "../middleware/errorHandlers";


const router = express.Router()

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await User.find()
        res.type("json").send(JSON.stringify(allUsers, null, 2))
    } catch (error) {
        next(error)
    }
})

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    
    try {
        const user = await User.findById(id)

        if(user) {
            res.status(200).type("json").send(JSON.stringify(user, null, 2))
        } else {
            // ToDo [question]: is it OK to create a new Error and use next (expect the error to be logged and response to be sent by one of the following middlewares) instead of sending response res.json?
            // res.status(404).send(`Cannot find user with _ID ${id}`)
            next(new AppError(404, `Cannot find user with _ID ${id}`))
        }
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 404, because the object with this illegal _ID does not exist
        if(error.kind === "ObjectId") {
            // res.status(404).send(`Cannot find user with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`)
            next(new AppError(404, `Cannot find user with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`))
        } else {
            next(error)
        }
    }
})

router.post("/", verifyBodyIsNotEmpty, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.body
        const createdUser = await User.create(user)
        res.status(201).type("json").send(JSON.stringify(createdUser, null, 2))
    } catch (error) {
        next(error)
    }
})

router.patch("/:id", verifyBodyIsNotEmpty, async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    
    try {
        const userUpdates = req.body
        const userUpdateResponse = await User.findByIdAndUpdate(id, userUpdates, { new: true })

        if(userUpdateResponse) {
            res.status(201).type("json").send(JSON.stringify(userUpdateResponse, null, 2))
        } else {
            // res.status(404).send(`Cannot find user with _ID ${id}`)
            next(new AppError(404, `Cannot find user with _ID ${id}`))
        }
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 404, because the object with this illegal _ID does not exist
        if(error.kind === "ObjectId") {
            // res.status(404).send(`Cannot find user with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`)
            next(new AppError(404, `Cannot find user with _ID ${id} (illegal ObjectId value, must be 24 character hexadecimal)`))
        } else {
            next(error)
        }
    }
})

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const deletedUser = await User.findByIdAndDelete(id)

        const status = deletedUser ? 200 : 204
        res.status(status).json("{}")
    } catch (error: any) {
        // If error of casting ":id" to MongoDB ObjectId ocurred, then we return 204, because the object with this ID
        // cannot exist. Therefore, if the user requests to delete it, we respond that it does not exist (204 No Content)
        if(error.kind === "ObjectId") {
            res.status(204).json("{}")
        } else {
            next(error)
        }
    }
})

export default router