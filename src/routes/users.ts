import express from "express"
import { userModel as User } from "../models/user";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAll, processRequestGetById, processRequestPatchById, processRequestPost } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAll(User))
router.get("/:id", processRequestGetById(User))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(User))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(User))
router.delete("/:id", processRequestDeleteById(User))

export default router