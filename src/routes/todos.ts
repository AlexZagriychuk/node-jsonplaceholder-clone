import express, { NextFunction, Request, Response } from "express"
import { todoModel as Todo } from "../models/todo";
import { commentModel as Comment } from "../models/comment";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByCustomQueryParams, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(Todo))
router.get("/:id", processRequestGetById(Todo))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(Todo))
router.put("/:id", verifyBodyIsNotEmpty, processRequestPutById(Todo))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(Todo))
router.delete("/:id", processRequestDeleteById(Todo))

router.get("/:id/comments", async function (req: Request, res: Response, next: NextFunction) {
    const postId = req.params.id
    const processRequestGetCommentsByPostId = processRequestGetAllByCustomQueryParams(Comment, {postId})
    await processRequestGetCommentsByPostId(req, res, next)
})

export default router