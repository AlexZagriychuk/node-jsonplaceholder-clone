import mongoose from "mongoose";

export function removePrivateMongoFields(_doc: mongoose.Document<any>, ret: Record<string, any>, _game: mongoose.ToObjectOptions<any>) {
    delete ret.__v;
}