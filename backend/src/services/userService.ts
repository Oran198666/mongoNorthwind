import { UserModel } from "../models/userModel";
import { CredentialsModel } from "../models/credentialsModel";
import { dal } from "../utils/dal";
import { OkPacket } from "mysql2";
import { StatusCode } from "../models/enum";
import { ClientError } from "../models/client-error";
import { cyber } from "../utils/cyber";
import axios from "axios";
import { appConfig } from "../utils/app-config";


class UserService {

    // Register a new user:
    public async register(user: UserModel): Promise<string> {

        // Verify CAPTCHA with Google:
        const captchaResponse = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            { params: { secret: appConfig.recaptchaSecret, response: user.captchaToken } }
        );

        if (!captchaResponse.data.success) {
            throw new ClientError(StatusCode.Forbidden, "CAPTCHA verification failed.");
        }

        user.validate();

        user.email = user.email.trim().toLowerCase();

        // Generate a per-user salt, hash with it:
        const salt = cyber.generateSalt();
        user.password = cyber.hashPassword(user.password!, salt);

        // Insert user + salt (roleId 2 forced server-side):
        const sql = "INSERT INTO users (firstName, lastName, email, password, salt, roleId) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            const info = await dal.execute(sql, [user.firstName, user.lastName, user.email, user.password!, salt, 2]) as OkPacket;
            user.id = info.insertId;
        }
        catch (err: any) {
            if (err.code === "ER_DUP_ENTRY") {
                throw new ClientError(StatusCode.Conflict, "Email already registered");
            }
            throw err;
        }

        delete (user as any).password;

        const token = cyber.getNewToken(user);
        return token;
    }

    // Log in an existing user:
    public async login(credentials: CredentialsModel): Promise<string> {
        credentials.validate();

        credentials.email = credentials.email.trim().toLowerCase();

        // Fetch by email only:
        const sql = "select * from users where email = ?";
        const users = await dal.execute(sql, [credentials.email]) as UserModel[];
        const user = users[0];

        // Hash the attempt with THIS user's salt, then compare:
        if (!user || cyber.hashPassword(credentials.password, user.salt) !== user.password) {
            throw new ClientError(StatusCode.Unauthorized, "Incorrect email or password.");
        }

        const token = cyber.getNewToken(user);
        return token;
    }
    public async getUserById(id: number): Promise<UserModel> {
        const sql = "SELECT id, firstName, lastName, email, roleId FROM users WHERE id = ?";
        const users = await dal.execute(sql, [id]) as UserModel[];
        const user = users[0];
        if (!user) throw new ClientError(StatusCode.NotFound, `id ${id} not found.`);
        return user;
    }
}

export const userService = new UserService();