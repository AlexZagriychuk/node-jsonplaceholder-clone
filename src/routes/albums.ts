import express, { NextFunction, Request, Response } from "express"
import { albumModel as Album } from "../models/album";
import { photoModel as Photo } from "../models/photo";
import { verifyBodyIsNotEmpty } from "../middleware/requestVerifiers";
import { processRequestDeleteById, processRequestGetAllByCustomQueryParams, processRequestGetAllByRequestQueryParams, processRequestGetById, processRequestPatchById, processRequestPost, processRequestPutById } from "../middleware/defaultRequestHandlers";


const router = express.Router()

router.get("/", processRequestGetAllByRequestQueryParams(Album))
router.get("/:id", processRequestGetById(Album))
router.post("/", verifyBodyIsNotEmpty, processRequestPost(Album))
router.put("/", verifyBodyIsNotEmpty, processRequestPutById(Album))
router.patch("/:id", verifyBodyIsNotEmpty, processRequestPatchById(Album))
router.delete("/:id", processRequestDeleteById(Album))

router.get("/:id/photos", async function (req: Request, res: Response, next: NextFunction) {
    const albumId = req.params.id
    const processRequestGetPhotosByAlbumId = processRequestGetAllByCustomQueryParams(Photo, {albumId})
    await processRequestGetPhotosByAlbumId(req, res, next)
})

export default router