import express from "express"
import mongoose from "mongoose";
import usersRouter from "./routes/users"
import postsRouter from "./routes/posts"
import todosRouter from "./routes/todos"
import albumsRouter from "./routes/albums"
import photosRouter from "./routes/photos"
import commentsRouter from "./routes/comments"
import resetDataRouter from "./routes/reset-data"
import dotenv from "dotenv"
import { requestLogger } from "./middleware/requestLoggers";
import { errorLogger, errorResponder, invalidPathHandler } from "./middleware/errorHandlers";
import cors from "cors"
import { renameIdInResponseJson, renameIdInResponseSend, responseInterceptor } from "./middleware/responseHandlers";

export async function startServer() {
    dotenv.config()
    const PORT = process.env.PORT || 3000
    const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/jsonplaceholder"

    const app = express()
    app.set('json spaces', 2)
    app.use(cors())
    app.use(express.json())
    app.use(requestLogger)
    app.use(responseInterceptor(renameIdInResponseJson, renameIdInResponseSend))

    app.use("/reset-data", resetDataRouter)
    app.use("/users", usersRouter)
    app.use("/posts", postsRouter)
    app.use("/todos", todosRouter)
    app.use("/albums", albumsRouter)
    app.use("/photos", photosRouter)
    app.use("/comments", commentsRouter)

    app.use(errorLogger)
    app.use(errorResponder)
    app.use(invalidPathHandler)


    mongoose.connect(DATABASE_URL);
    const db = mongoose.connection
    db.on("error", (error) => console.error(error))
    db.once("open", () => console.log("Connected to Database"))

    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
}
