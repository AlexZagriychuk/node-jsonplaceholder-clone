import express, { NextFunction, Request, Response } from "express"
import { postModel as Post } from "../models/post";
import { commentModel as Comment } from "../models/comment";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByCustomQueryParams, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(Post))
router.get("/:id", processRequestGetById(Post))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(Post))
router.put("/:id", verifyBodyIsNotEmpty, processRequestPutById(Post))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(Post))
router.delete("/:id", processRequestDeleteById(Post))

router.get("/:id/comments", async function (req: Request, res: Response, next: NextFunction) {
    const postId = req.params.id
    const processRequestGetCommentsByPostId = processRequestGetAllByCustomQueryParams(Comment, {postId})
    await processRequestGetCommentsByPostId(req, res, next)
})

export default router