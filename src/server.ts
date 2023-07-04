import express from "express"
import mongoose from "mongoose";
import usersRouter from "./routes/users"
import dotenv from "dotenv"
import { requestLogger } from "./middleware/requestLoggers";
import { errorLogger, errorResponder, invalidPathHandler } from "./middleware/errorHandlers";

export async function startServer() {
    dotenv.config()
    const PORT = process.env.PORT || 3000
    const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/jsonplaceholder"

    const app = express()
    app.use(express.json())
    app.use(requestLogger)

    app.use("/users", usersRouter)
    
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
