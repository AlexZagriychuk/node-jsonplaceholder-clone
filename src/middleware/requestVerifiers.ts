import { Request, Response, NextFunction } from 'express'


export const verifyBodyIsNotEmpty = (req: Request, res: Response, next: NextFunction) => {
    const bodyIsEmpty = Object.keys(req.body).length === 0

    if (bodyIsEmpty) {
        // When we use 'app.use(express.json())', if header 'Content-Type' is not 'application/json', the req.body will be parsed 
        // into an empty object even if it was not an empty object, this is why extra info is added in the parenthesis
        res.status(400).send("Request body must not be an empty object (and header 'Content-Type' must be 'application/json')")
    } else {
        next()
    }
}