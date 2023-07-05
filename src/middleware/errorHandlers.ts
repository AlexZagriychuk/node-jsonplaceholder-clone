import { Request, Response, NextFunction } from 'express'


// Error object used in error handling middleware function
class AppError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);
        this.name = Error.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

// Error handling Middleware function for logging the error message
const errorLogger = (error: Error, _req: Request, _res: Response, next: NextFunction) => {
    const statusCode = error instanceof AppError ? error.statusCode + " " : ""
    console.error(`[Error] ${statusCode}${error.message}`)
    next(error) // calling next middleware
}

// Error handling Middleware function reads the error message and sends back a response in JSON format  
const errorResponder = (error: AppError, _req: Request, res: Response, next: NextFunction) => {
    res.header("Content-Type", 'application/json')
    const status = error.statusCode || 400
    res.status(status).send(error.message)
}

// Fallback Middleware function for returning 404 error for undefined paths
const invalidPathHandler = (req: Request, res: Response, _next: NextFunction) => {
    const errorMessage = `Invalid path ${req.method.toUpperCase()} ${req.path}`
    console.error(`[Error] ${errorMessage}`)

    res.status(404)
    res.send(errorMessage)
}

export { AppError, errorLogger, errorResponder, invalidPathHandler }