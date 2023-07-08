export function replaceFieldNamesInObjects(objs: Array<any>, fieldsToReplace: Array<{ fieldName: string, newFieldName: string }>) {
    return objs.map(obj => replaceFieldNamesInObject(obj, fieldsToReplace))
}

export function replaceFieldNamesInObject(obj: any, fieldsToReplace: Array<{ fieldName: string, newFieldName: string }>) {
    fieldsToReplace.forEach(fieldToReplace => {
        // delete old fieldName from the object...
        const { [fieldToReplace.fieldName]: fieldValue, ...newObj } = obj;
        obj = newObj
        // And add a new filed name
        obj[fieldToReplace.newFieldName] = fieldValue
    })

    return obj
}