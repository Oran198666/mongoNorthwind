import { Role } from "../models/enum";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { appConfig } from "./app-config";
import { UserModel } from "../models/userModel";

class Cyber {


// Generate a random salt:
public generateSalt(): string {
    return crypto.randomBytes(20).toString("hex");
}

// Hash with per-user salt + pepper:
public hashPassword(plainText: string, salt: string): string {
    return crypto
        .createHmac("sha512", appConfig.hmacKey)
        .update(salt + plainText)
        .digest("hex");
}

    public getNewToken(user: UserModel): string {
        const { password, ...userWithoutPassword } = user;
        return jwt.sign({ user: userWithoutPassword }, appConfig.jwtSecret!, { expiresIn: "3h" });
    }

    public verifyToken(token: string): boolean {
        try {
            // If no token:
            if (!token) {
                return false;
            }
            // Verify:
            jwt.verify(token, appConfig.jwtSecret!);

            // All is good - token is legal:
            return true;
        }
        catch (err: any) {
            return false; // Token not legal.
        }
    }
    public getUserId(token: string): number {
    const payload = jwt.decode(token) as { user: UserModel };
    return payload.user.id!;
}

    public verifyAdmin(token: string): boolean {
        try {
            // If no token:
            if (!token) {
                return false;
            }
            // Verify:
            jwt.verify(token, appConfig.jwtSecret!);

            //verify Roll admin
            const payload = jwt.decode(token) as { user: UserModel };
            ////extract user
            const user = payload.user;
            if (user.roleId !== Role.Admin) {
                return false;
            }

            // All is good - token is legal:
            return true;
        }
        catch (err: any) {
            return false; // Token not legal.
        }
    }
}

export const cyber = new Cyber();