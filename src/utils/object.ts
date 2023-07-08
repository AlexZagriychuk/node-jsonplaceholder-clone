export function replaceFieldNamesInObjects(objs: Array<any>, fieldsToReplace: Array<{ fieldName: string, newFieldName: string }>) {
    return objs.map(obj => replaceFieldNamesInObject(obj, fieldsToReplace))
}

export function replaceFieldNamesInObject(obj: any, fieldsToReplace: Array<{ fieldName: string, newFieldName: string }>) {
    let copiedObj = JSON.parse(JSON.stringify(obj));

    fieldsToReplace.forEach(fieldToReplace => {
        const value = copiedObj[fieldToReplace.fieldName]
        delete copiedObj[fieldToReplace.fieldName]
        copiedObj[fieldToReplace.newFieldName] = value
    })

    return copiedObj
}