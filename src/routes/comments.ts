import express from "express"
import { commentModel as Comment } from "../models/comment";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(Comment))
router.get("/:id", processRequestGetById(Comment))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(Comment))
router.put("/:id", verifyBodyIsNotEmpty, processRequestPutById(Comment))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(Comment))
router.delete("/:id", processRequestDeleteById(Comment))

export default router