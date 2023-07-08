import express from "express"
import { todoModel as Todo } from "../models/todo";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(Todo))
router.get("/:id", processRequestGetById(Todo))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(Todo))
router.put("/", verifyBodyIsNotEmpty, processRequestPutById(Todo))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(Todo))
router.delete("/:id", processRequestDeleteById(Todo))

export default router