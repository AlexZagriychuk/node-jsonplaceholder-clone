'use strict';

import { replaceFieldNamesInObject, replaceFieldNamesInObjects } from "../utils/object";
 
export function replaceIdInResponse(body: any) {
    const fieldsToReplace = [{fieldName: "_id", newFieldName: "id"}]
    if(Array.isArray(body)) {
        body = replaceFieldNamesInObjects(body, fieldsToReplace)
    } else {
        body = replaceFieldNamesInObject(body, fieldsToReplace)
    }

    return body
}
