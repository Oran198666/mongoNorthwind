import { StatusCode } from "../models/enum";
import express, { Request, Response, NextFunction, Router } from "express";
import { userService } from "../services/userService";
import { UserModel } from "../models/userModel";
import { CredentialsModel } from "../models/credentialsModel";
import { securityMiddleware } from "../middleware/securityMiddleware";
import { cyber } from "../utils/cyber";
import { ClientError } from "../models/client-error";

class UserController {

    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/register", this.register);
        this.router.post("/api/login", this.login);
        this.router.get("/api/users/:id", securityMiddleware.verifyLoggedIn, this.getUser);
    }

    // Register a new user:
    private async register(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const user = new UserModel(request.body);
            const token = await userService.register(user);
            response.status(StatusCode.Created).json(token);
        }
        catch (err: any) {
            next(err);
        }
    }

    // Log in an existing user:
    private async login(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const credentials = new CredentialsModel(request.body);
            const token = await userService.login(credentials);
            response.status(StatusCode.OK).json(token);
        }
        catch (err: any) {
            next(err);
        }
    }

    // Get one user by id:
    private async getUser(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const id = +request.params.id;

            // Ownership check - you can only view your own account:
            const token = request.headers.authorization!.substring(7);
            const loggedInId = cyber.getUserId(token);
            if (id !== loggedInId) {
                throw new ClientError(StatusCode.Forbidden, "You can only view your own account.");
            }

            const user = await userService.getUserById(id);
            response.status(StatusCode.OK).json(user);
        }
        catch (err: any) {
            next(err);
        }
    }
}

export const userController = new UserController();