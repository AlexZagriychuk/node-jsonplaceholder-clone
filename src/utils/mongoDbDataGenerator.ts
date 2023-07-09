import { IAlbum } from "../models/album"
import { IComment } from "../models/comment"
import { IPhoto } from "../models/photo"
import { IPost } from "../models/post"
import { ITodo } from "../models/todo"
import { IUser } from "../models/user"
import { jsonplaceholderAlbums, jsonplaceholderComments, jsonplaceholderPhotos, jsonplaceholderPosts, jsonplaceholderTodos, jsonplaceholderUsers } from "./jsonplaceholderData"
import { renameObjKey } from "./object"


function renameId(objs: Array<Object>) {
    return objs.map(obj => renameObjKey(obj, "id", "_id"))
}

export function generateUsers(): Array<IUser> {
    return renameId(jsonplaceholderUsers)
}

export function generatePosts(): Array<IPost> {
    return renameId(jsonplaceholderPosts)
}

export function generateTodos(): Array<ITodo> {
    return renameId(jsonplaceholderTodos)
}

export function generateAlbums(): Array<IAlbum> {
    return renameId(jsonplaceholderAlbums)
}

export function generatePhotos(): Array<IPhoto> {
    return renameId(jsonplaceholderPhotos)
}

export function generateComments(): Array<IComment> {
    return renameId(jsonplaceholderComments)
}