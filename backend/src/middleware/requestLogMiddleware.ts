import { NextFunction, Request, Response } from "express";
import { requestLogService } from "../services/RequestLogService";

const SENSITIVE = ["password", "confirmPassword", "token"];

function maskBody(body: any): string | null {
    if (!body || Object.keys(body).length === 0) return null;
    const safe = { ...body };
    for (const field of SENSITIVE) {
        if (field in safe) safe[field] = "***";
    }
    return JSON.stringify(safe);
}

class RequestLogMiddleware {
    public logToDB(request: Request, response: Response, next: NextFunction): void {
        const SKIP_BODY_ROUTES = ["/api/login", "/api/register"];
        const body = SKIP_BODY_ROUTES.includes(request.path)
            ? null
            : maskBody(request.body);

        requestLogService
            .logRequest(request.method, request.originalUrl, body)
            .catch(err => console.log("log failed", err.message));

        next();
    }
}

export const requestLogMiddleware = new RequestLogMiddleware();