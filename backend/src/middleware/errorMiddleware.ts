import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../models/enum";
import { ClientError } from "../models/client-error";
import { Error as MongooseError } from "mongoose";
import colors from "colors";
import { appConfig } from "../utils/app-config";
import { errorLogService } from "../services/error-log-service";

class ErrorMiddleware {

    // Route Not Found Middleware:
    public routeNotFound(request: Request, response: Response, next: NextFunction): void {
        const err = new ClientError(StatusCode.NotFound, `Route ${request.originalUrl} on method ${request.method} not found.`);
        next(err);
    }

    // Catch-All Middleware:
public catchAll(err: any, request: Request, response: Response, next: NextFunction): void {

    // Mongoose validation failed → client error (400):
    if (err instanceof MongooseError.ValidationError) {
        const messages = Object.values(err.errors).map(e => e.message).join(" ");
        err = new ClientError(StatusCode.BadRequest, messages);
    }

    // Malformed _id in the URL → client error (400):
    if (err instanceof MongooseError.CastError) {
        err = new ClientError(StatusCode.BadRequest, `Invalid value "${err.value}" for ${err.path}.`);
    }

    const status = err.status || StatusCode.InternalServerError;
    const isServer = status >= 500 && status <= 599;
    // ... rest unchanged
}

}

export const errorMiddleware = new ErrorMiddleware();