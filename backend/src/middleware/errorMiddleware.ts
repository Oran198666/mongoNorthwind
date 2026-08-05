import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../models/enum";
import { ClientError } from "../models/client-error";
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
        const status = err.status || StatusCode.InternalServerError;
        const isServer = status >= 500 && status <= 599;
        if (isServer) {
            errorLogService.logError(request.method, request.originalUrl, status, err.message)
                .catch(e => console.log("error log failed:", e.message));
        }
        const message = isServer && appConfig.isProduction ? "please try again later." : err.message;
        console.log(colors.red(err.message));
        response.status(status).json({ message });

    }
}

export const errorMiddleware = new ErrorMiddleware();