import express from "express"
import mongoose from "mongoose";
import usersRouter from "./routes/users"

export async function startServer() {
    const PORT = 5000
    const MONGO_DB_CONNECTION = "mongodb://127.0.0.1:27017/jsonplaceholder"

    const app = express()
    app.use("/users", usersRouter)
    
    await mongoose.connect(MONGO_DB_CONNECTION);
    
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`)
    })
}
