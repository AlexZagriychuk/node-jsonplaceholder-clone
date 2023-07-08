import express, { NextFunction, Request, Response } from "express"
import { userModel as User } from "../models/user";
import { postModel as Post } from "../models/post";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByCustomQueryParams, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers"


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(User))
router.get("/:id", processRequestGetById(User))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(User))
router.put("/", verifyBodyIsNotEmpty, processRequestPutById(User))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(User))
router.delete("/:id", processRequestDeleteById(User))

router.get("/:id/posts", async function (req: Request, res: Response, next: NextFunction) {
    const userId = req.params.id
    const processRequestGetPostsByUserId = processRequestGetAllByCustomQueryParams(Post, {userId})
    await processRequestGetPostsByUserId(req, res, next)
})

export default router