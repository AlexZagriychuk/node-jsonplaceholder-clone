import express from "express"
import { userModel as User } from "../models/user";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(User))
router.get("/:id", processRequestGetById(User))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(User))
router.put("/", verifyBodyIsNotEmpty, processRequestPutById(User))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(User))
router.delete("/:id", processRequestDeleteById(User))

export default router