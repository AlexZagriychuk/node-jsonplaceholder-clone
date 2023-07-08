import express from "express"
import { albumModel as Album } from "../models/album";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(Album))
router.get("/:id", processRequestGetById(Album))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(Album))
router.put("/", verifyBodyIsNotEmpty, processRequestPutById(Album))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(Album))
router.delete("/:id", processRequestDeleteById(Album))

export default router