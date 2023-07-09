// Rename obj key (preserve the keys order)
export function renameObjKey(oldObj: any, oldKey: string, newKey: string) {
    const keys = Object.keys(oldObj)
    const newObj = keys.reduce((acc, objKey) => {
        const key = objKey === oldKey ? newKey : objKey
        acc[key] = oldObj[oldKey]
        return acc
    }, {} as any)

    return newObj
}