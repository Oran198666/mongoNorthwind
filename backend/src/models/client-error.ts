import { Document } from "mongoose";
import { StatusCode } from "./enum";

export class ClientError extends Error {

    public readonly status: StatusCode;

    public constructor(status: StatusCode, message: string) {
        super(message);
        this.status = status;
    }

    public static async validate(document: Document): Promise<void> {
        try {
            await document.validate();
        }
        catch (err: any) {
            throw new ClientError(StatusCode.UnprocessableContent, err.message);
        }
    }
}