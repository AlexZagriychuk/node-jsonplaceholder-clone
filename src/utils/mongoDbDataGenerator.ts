import { IUser } from "../models/user"
import { jsonplaceholderPosts, jsonplaceholderUsers } from "./jsonplaceholderData"

export function generateUsers() {
    // replacing "id" field with 24 character long hexadecimal "_id" field
    return replaceWithHex24Chars(jsonplaceholderUsers, [{ fieldName: "id", newFieldName: "_id" }])
}

export function generatePosts() {
    // replacing "id" field with 24 character long hexadecimal "_id" field;
    // converting "userId" field value to 24 character long hexadecimal
    return replaceWithHex24Chars(jsonplaceholderPosts, [{ fieldName: "id", newFieldName: "_id" }, {fieldName: "userId"}])
}

// - If both fieldName and newFieldName are passed then the filed with name ${fieldName} will be removed from an obj ...
//     a new filed with name ${newFieldName} will be added to an object and value will be replaced with Hex 24 length 
// - If only fieldName is passed then the value of this filed will be replaced with Hex 24 length 
function replaceWithHex24Chars(objs: Array<Partial<any>>, fieldsToHex24Len: Array<{ fieldName: string, newFieldName?: string }>) {
    return objs.map(obj => {
        fieldsToHex24Len.forEach(fieldToHex24Len => {
            const fieldValueHex = obj[fieldToHex24Len.fieldName].toString(16)
            const fieldValueHex24Chars = new String("0").repeat(24 - fieldValueHex.length) + fieldValueHex

            if (fieldToHex24Len.hasOwnProperty("newFieldName") && fieldToHex24Len.newFieldName) {
                // If newFieldName is present, then delete old fieldName from the object...
                const { [fieldToHex24Len.fieldName]: _, ...newObj } = obj;
                obj = newObj
                // And add a new filed name
                obj[fieldToHex24Len.newFieldName] = fieldValueHex24Chars
            } else {
                obj[fieldToHex24Len.fieldName] = fieldValueHex24Chars
            }
        })

        return obj
    })
}