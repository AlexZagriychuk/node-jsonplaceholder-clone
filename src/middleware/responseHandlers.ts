'use strict';

import { renameObjKey } from "../utils/object";
 
export function replaceIdInResponse(body: any) {
    if(Array.isArray(body)) {
        body = body.map(obj => renameObjKey(obj, "_id", "id"))
    } else {
        body = renameObjKey(body, "_id", "id")
    }

    return body
}
