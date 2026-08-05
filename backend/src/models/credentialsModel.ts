import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enum";

// Credentials Schema:
const CredentialsSchema = z.object({
    email: z.string().email().max(100),
    password: z.string().min(6).max(100)
});

type ICredentialsModel = z.infer<typeof CredentialsSchema>;

export class CredentialsModel implements ICredentialsModel {

    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    public validate(): void {
        const result = CredentialsSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues.map(i => i.message).join(", ");
            throw new ClientError(StatusCode.UnprocessableEntity, message);
        }
    }
}