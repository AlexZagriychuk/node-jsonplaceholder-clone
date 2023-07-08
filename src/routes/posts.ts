import express from "express"
import { postModel as Post } from "../models/post";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(Post))
router.get("/:id", processRequestGetById(Post))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(Post))
router.put("/", verifyBodyIsNotEmpty, processRequestPutById(Post))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(Post))
router.delete("/:id", processRequestDeleteById(Post))

export default router