import { IAlbum } from "../models/album"
import { IComment } from "../models/comment"
import { IPhoto } from "../models/photo"
import { IPost } from "../models/post"
import { ITodo } from "../models/todo"
import { IUser } from "../models/user"
import { jsonplaceholderAlbums, jsonplaceholderComments, jsonplaceholderPhotos, jsonplaceholderPosts, jsonplaceholderTodos, jsonplaceholderUsers } from "./jsonplaceholderData"
import { replaceFieldNamesInObjects } from "./object"


function replaceId(objs: Array<Object>) {
    return replaceFieldNamesInObjects(objs, [{ fieldName: "id", newFieldName: "_id" }])
}

export function generateUsers(): Array<IUser> {
    return replaceId(jsonplaceholderUsers)
}

export function generatePosts(): Array<IPost> {
    return replaceId(jsonplaceholderPosts)
}

export function generateTodos(): Array<ITodo> {
    return replaceId(jsonplaceholderTodos)
}

export function generateAlbums(): Array<IAlbum> {
    return replaceId(jsonplaceholderAlbums)
}

export function generatePhotos(): Array<IPhoto> {
    return replaceId(jsonplaceholderPhotos)
}

export function generateComments(): Array<IComment> {
    return replaceId(jsonplaceholderComments)
}