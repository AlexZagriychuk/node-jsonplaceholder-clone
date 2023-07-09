import { Request, Response, NextFunction } from "express"
import { AppError } from "./errorHandlers";
import { convertMongooseDocumentToPojoIfNeeded, removePrivateMongoFieldsFromObj } from "../utils/mongoUtils";
import { renameObjKey } from "../utils/object";


function renameIdInBodyObj(obj: any) {
    obj = convertMongooseDocumentToPojoIfNeeded(obj)
    return renameObjKey(obj, "_id", "id")
}

export function processResponseJsonBody(body: any) {
    // rename _id into id, and remove private mongo fields from response
    return Array.isArray(body) 
        ? body.map(obj => removePrivateMongoFieldsFromObj(renameIdInBodyObj(obj))) 
        : removePrivateMongoFieldsFromObj(renameIdInBodyObj(body))
}

export function processResponseSendBody(body: string) {
    return processResponseJsonBody(JSON.parse(body))
}


// We can pass body replacer functions for both res.json and res.send, or for only one of them (null for another)
// If both body replacer functions are passed, after res.json is intercepted we do not intercept res.send (because we would have already done all response updates on data in json format before res.send is called) 
export function responseInterceptor(
    resJsonBodyReplacer: null | ((body: any) => any),
    resSendBodyReplacer: null | ((body: string) => string),
) {
    return function (_req: Request, res: Response, next: NextFunction) {
        if(!resJsonBodyReplacer && !resSendBodyReplacer) {
            next(new AppError(500, `[Implementation error] responseInterceptor function both resJsonBodyReplacer and resSendBodyReplacer cannot be null`))
            return
        }

        const originalJson = res.json
        const originalSend = res.send

        // Override response.json to intercept only if allowed
        if(resJsonBodyReplacer) {
            res.json = function (): any {
                // If res.json is intercepted we do not intercept res.send (because we would have already done all response updates on data in json format before res.send is called) 
                res.send = originalSend

                arguments[0] = resJsonBodyReplacer(arguments[0])
                originalJson.apply(res, arguments as any)
            }
        }

        // Intercept response.json only if allowed
        if(resSendBodyReplacer) {
            res.send = function (): any {
                arguments[0] = resSendBodyReplacer(arguments[0])
                originalSend.apply(res, arguments as any)
            }
            next()
        }
    }
}