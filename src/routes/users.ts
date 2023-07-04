import express from "express"
import { userModel as User } from "../models/user";

const router = express.Router()

router.get("/", async (_req, res) => {
    const allUsers = await User.find()
    res.type("json")
    res.send(JSON.stringify(allUsers, null, 2))
}) 

export default router