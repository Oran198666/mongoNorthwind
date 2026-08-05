import { ProductModel } from "../models/productModel";
import { dal } from "../utils/dal";
import { OkPacket } from "mysql2";
import { StatusCode } from "../models/enum";
import { ClientError } from "../models/client-error";
import { appConfig } from "../utils/app-config";
import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import crypto from "crypto";

class ProductService {

    public async getAllProducts(): Promise<ProductModel[]> {
        const sql = "SELECT id, name, price, stock, imgUrl FROM products";
        const products = await dal.execute(sql) as ProductModel[];
        products.forEach(p => p.imgUrl = p.imgUrl ? appConfig.baseImageUrl + p.imgUrl : undefined);
        return products;
    }

    public async getOneProduct(id: number): Promise<ProductModel> {
        const sql = "SELECT id, name, price, stock, imgUrl FROM products WHERE id = ?";
        const products = await dal.execute(sql, [id]) as ProductModel[];
        const product = products[0];

        if (!product) {
            throw new ClientError(StatusCode.NotFound, `id ${id} not found.`);
        }

        product.imgUrl = product.imgUrl ? appConfig.baseImageUrl + product.imgUrl : undefined;
        return product;
    }

    public async addProduct(product: ProductModel): Promise<ProductModel> {
        const model = new ProductModel(product);
        model.validate();

        if (model.image) {
            model.imgUrl = await this.saveImage(model.image);
        }

        const sql = "INSERT INTO products (name, price, stock, imgUrl) VALUES (?, ?, ?, ?)";
        const info = await dal.execute(sql, [model.name, model.price, model.stock, model.imgUrl ?? null]) as OkPacket;
        model.id = info.insertId;

        return await this.getOneProduct(model.id);
    }

    // Update product:
    public async updateProduct(id: number, product: ProductModel): Promise<ProductModel> {
        const model = new ProductModel(product);
        model.validate();

        // Raw filename from the DB (throws 404 if the product doesn't exist):
        const oldImageName = await this.getImageName(id);

        // Only replace the image if a new one was sent:
        if (model.image) {
            model.imgUrl = await this.saveImage(model.image);
            this.deleteImage(oldImageName);
        }
        else {
            model.imgUrl = oldImageName ?? undefined;
        }

        const sql = "UPDATE products SET name = ?, price = ?, stock = ?, imgUrl = ? WHERE id = ?";
        await dal.execute(sql, [model.name, model.price, model.stock, model.imgUrl ?? null, id]);

        return await this.getOneProduct(id);
    }

    // Delete product:
    public async deleteProduct(id: number): Promise<void> {
        const imageName = await this.getImageName(id);

        const sql = "DELETE FROM products WHERE id = ?";
        const info = await dal.execute(sql, [id]) as OkPacket;

        if (info.affectedRows === 0) {
            throw new ClientError(StatusCode.NotFound, `id ${id} not found.`);
        }

        this.deleteImage(imageName);
    }

    // ---------- Helpers ----------

    // Get image name from db:
    private async getImageName(id: number): Promise<string | null> {
        const sql = "SELECT imgUrl FROM products WHERE id = ?";
        const products = await dal.execute(sql, [id]) as ProductModel[];
        const product = products[0];

        if (!product) {
            throw new ClientError(StatusCode.NotFound, `id ${id} not found.`);
        }

        return product.imgUrl ?? null;
    }

    // Full disk path for an image file:
    private imagePath(imageName: string): string {
        return path.join(__dirname, "..", "assets", "images", imageName);
    }

    // Save an uploaded image, return its new name:
    private async saveImage(image: UploadedFile): Promise<string> {
        const extension = image.name.substring(image.name.lastIndexOf("."));
        const imageName = crypto.randomUUID() + extension;

        const folder = path.join(__dirname, "..", "assets", "images");
        fs.mkdirSync(folder, { recursive: true });

        await image.mv(this.imagePath(imageName));
        return imageName;
    }

    // Delete an image file from disk:
    private deleteImage(imageName: string | null): void {
        if (!imageName) return;
        const filePath = this.imagePath(imageName);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    // Get top three products:
    public async getTopProducts(): Promise<ProductModel[]> {
        const sql = "SELECT id, name, price, stock, imgUrl FROM products ORDER BY stock DESC LIMIT 3";
        const products = await dal.execute(sql) as ProductModel[];
        products.forEach(p => p.imgUrl = p.imgUrl ? appConfig.baseImageUrl + p.imgUrl : undefined);
        return products;
    }
}

export const productService = new ProductService();