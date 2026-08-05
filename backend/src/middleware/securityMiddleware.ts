import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../models/enum";
import { cyber } from "../utils/cyber";
import { ClientError } from "../models/client-error";
import striptags from "striptags";
import rateLimit from "express-rate-limit";
import { Express } from "express";

class SecurityMiddleware {

    //short circuit middleware
    public blackList(request: Request, response: Response, next: NextFunction): void {
        const denyIpAddresses = ["11.22.33.44", "100.200.3.5"];
        const userIp = request.ip?.toString()!;
        console.log(userIp);
        if (denyIpAddresses.includes(userIp)) {
            const message = "You are black listed!";
            response.status(StatusCode.Forbidden).json({ message });
        }
        else {
            next();
        }
    }
    public verifyLoggedIn(request: Request, response: Response, next: NextFunction): void {

        //extract Token
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);
        // if legal token
        if (cyber.verifyToken(token!)) {
            next();
        } else {
            const err = new ClientError(StatusCode.Unauthorized, "you're not authorized");
            next(err);
        }
    }
    public verifyAdmin(request: Request, response: Response, next: NextFunction): void {

        //extract Token
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7);
        // if legal token & admin
        if (cyber.verifyAdmin(token!)) {
            next();
        } else {
            const err = new ClientError(StatusCode.Forbidden, "you're not authorized");
            next(err);
        }
    }
    public preventXss(request: Request, response: Response, next: NextFunction): void {
        for (const prop in request.body) {
            const value = request.body[prop];
            if (typeof value === "string") {
                request.body[prop] = striptags(value);
            }
        }
        next();
    }
    // Prevent DoS attack:
public registerRateLimit(server: Express): void {

    // General limit:
    server.use(rateLimit({
        windowMs: 6000,
        limit: 5,
        skip: (request: Request) => request.path.startsWith("/api/products/images/")
    }));

    // Looser limit for images:
    server.use("/api/products/images/", rateLimit({
        windowMs: 1000,
        limit: 200,
    }));
}
}

export const securityMiddleware = new SecurityMiddleware();