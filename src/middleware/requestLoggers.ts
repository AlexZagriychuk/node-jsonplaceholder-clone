import { Request, Response, NextFunction } from 'express'


// Middleware function for logging the request method and request URL
export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} url:: ${req.url}`);
    next()
}