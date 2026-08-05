import fs from "fs";
import { StatusCode } from "../models/enum";
import { ProductModel } from "../models/productModel";
import express, { Request, Response, Router } from "express";
import { productService } from "../services/productService";
import { securityMiddleware } from "../middleware/securityMiddleware";
import { UploadedFile } from "express-fileupload";
import path from "path";

class ProductController {

    public router: Router = express.Router();

    public constructor() {
        this.router.get("/api/products/top-three", this.getTopProducts);
        this.router.get("/api/products/images/:imageName", this.getImage);
        this.router.get("/api/products", this.getAllProducts);
        this.router.get("/api/products/:id", this.getOneProduct);
        this.router.post("/api/products", securityMiddleware.verifyAdmin, this.addProduct);
        this.router.put("/api/products/:id", securityMiddleware.verifyAdmin, this.updateProduct);
        this.router.delete("/api/products/:id", securityMiddleware.verifyAdmin, this.deleteProduct);
    }

    // Get all products:
    private async getAllProducts(request: Request, response: Response): Promise<void> {
        try {
            const products = await productService.getAllProducts();
            response.status(StatusCode.OK).json(products);
        }
        catch (err: any) {
            const status = err.status || StatusCode.InternalServerError;
            response.status(status).json({ message: err.message });
        }
    }

    // Get top three products:
    private async getTopProducts(request: Request, response: Response): Promise<void> {
        try {
            const products = await productService.getTopProducts();
            response.status(StatusCode.OK).json(products);
        }
        catch (err: any) {
            const status = err.status || StatusCode.InternalServerError;
            response.status(status).json({ message: err.message });
        }
    }

    // Get one product:
    private async getOneProduct(request: Request, response: Response): Promise<void> {
        try {
            const id = +request.params.id;
            const product = await productService.getOneProduct(id);
            response.status(StatusCode.OK).json(product);
        }
        catch (err: any) {
            const status = err.status || StatusCode.InternalServerError;
            response.status(status).json({ message: err.message });
        }
    }

    // Add product:
    private async addProduct(request: Request, response: Response): Promise<void> {
        try {
            const product = new ProductModel(request.body);
            product.image = request.files?.image as UploadedFile;
            const dbProduct = await productService.addProduct(product);
            response.status(StatusCode.Created).json(dbProduct);
        }
        catch (err: any) {
            const status = err.status || StatusCode.InternalServerError;
            response.status(status).json({ message: err.message });
        }
    }

    // Update product:
    private async updateProduct(request: Request, response: Response): Promise<void> {
        try {
            const id = +request.params.id;
            const product = new ProductModel(request.body);
            product.image = request.files?.image as UploadedFile;
            const dbProduct = await productService.updateProduct(id, product);
            response.status(StatusCode.OK).json(dbProduct);
        }
        catch (err: any) {
            const status = err.status || StatusCode.InternalServerError;
            response.status(status).json({ message: err.message });
        }
    }

    // Delete product:
    private async deleteProduct(request: Request, response: Response): Promise<void> {
        try {
            const id = +request.params.id;
            await productService.deleteProduct(id);
            response.status(StatusCode.NoContent).send();
        }
        catch (err: any) {
            const status = err.status || StatusCode.InternalServerError;
            response.status(status).json({ message: err.message });
        }
    }

    // Get image by name:
    private getImage(request: Request, response: Response): void {
        const imageName = request.params.imageName as string;
        let filePath = path.join(__dirname, "..", "assets", "images", imageName);

        if (!fs.existsSync(filePath)) {
            filePath = path.join(__dirname, "..", "assets", "images", "not-found.png");
        }

        response.sendFile(filePath);
    }
}

export const productController = new ProductController();