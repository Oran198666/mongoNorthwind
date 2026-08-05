import z from "zod";
import { ClientError } from "./client-error";
import { StatusCode } from "./enum";
import { UploadedFile } from "express-fileupload";

// Product Schema:
const ProductSchema = z.object({
    id: z.number().int().positive().optional(),
    name: z.string().min(2).max(100),
    price: z.coerce.number().min(0).max(1000),
    stock: z.coerce.number().int().min(0).max(1000),
    image: z.custom<UploadedFile>().optional(),
    imgUrl: z.string().optional()
});

// Create interface (type inferred from the schema):
type IProductModel = z.infer<typeof ProductSchema>;

export class ProductModel implements IProductModel {

    public id?: number;          // optional — absent on add, set by DB / from URL on update
    public name: string;
    public price: number;
    public stock: number;
    public image?: UploadedFile;
    public imgUrl?: string;

    public constructor(product: ProductModel) {
        this.id = product.id;
        this.name = product.name;
        this.price = +product.price;
        this.stock = +product.stock;
        this.image = product.image;
        this.imgUrl = product.imgUrl;
    }

    // Validate this product against the schema:
    public validate(): void {
        const result = ProductSchema.safeParse(this);
        if (!result.success) {
            const message = result.error.issues.map(i => i.message).join(", ");
            throw new ClientError(StatusCode.UnprocessableEntity, message);
        }
    }
}