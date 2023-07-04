import express, { Request, Response, NextFunction } from "express"
import { userModel as User } from "../models/user";

const router = express.Router()

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const allUsers = await User.find()
        res.type("json")
        res.send(JSON.stringify(allUsers, null, 2))
    } catch (error) {
        next(error)
    }
})

export default router