import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enum";
import ReCAPTCHA from "react-google-recaptcha";

const UserSchema = z.object({
    id: z.number().int().positive().optional(),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email().max(100),
    password: z.string()
        .min(8)
        .max(100)
        .refine(
            (val) => {
                let groups = 0;
                if (/[a-z]/.test(val)) groups++;
                if (/[A-Z]/.test(val)) groups++;
                if (/[0-9]/.test(val)) groups++;
                if (/[^a-zA-Z0-9]/.test(val)) groups++;
                return groups >= 3;
            },
            { message: "Password must contain at least 3 of: lowercase, uppercase, digits, symbols" }
        ),
    roleId: z.number().int().positive().optional(),
    captchaToken: z.string().max(2000)
});

type IUserModel = z.infer<typeof UserSchema>;

export class UserModel implements IUserModel {

    public id?: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public roleId?: number;
    public salt: string;
    public captchaToken?: string;

    public constructor(user: UserModel) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
        this.salt = user.salt;
        this.captchaToken = user.captchaToken;
    }

    public validate(): void {
        const result = UserSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues.map(i => i.message).join(", ");
            throw new ClientError(StatusCode.UnprocessableEntity, message);
        }
    }
}