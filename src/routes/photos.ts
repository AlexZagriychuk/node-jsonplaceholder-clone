import express from "express"
import { photoModel as Photo } from "../models/photo";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(Photo))
router.get("/:id", processRequestGetById(Photo))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(Photo))
router.put("/:id", verifyBodyIsNotEmpty, processRequestPutById(Photo))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(Photo))
router.delete("/:id", processRequestDeleteById(Photo))

export default router