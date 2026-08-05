import colors from "colors";
import { NextFunction, Request, Response } from "express";

class LoggerMiddleware {
    // passThrough
    public logToConsole(request: Request, response: Response, next: NextFunction): void {
        const method = request.method;
        const route = request.originalUrl;
        const body = request.body ? JSON.stringify(request.body) : null;

        console.log(colors.green(`${method} ${route} | body: ${body}`));
        next();
    }
}

export const loggerMiddleware = new LoggerMiddleware();