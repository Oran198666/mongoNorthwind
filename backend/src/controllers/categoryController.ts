import express, { NextFunction, Request, Response } from "express";
import categoryService from "../services/categoryService";
import { CategoryModel } from "../models/category-model";
import { StatusCode } from "../models/enum";

class CategoryController {

    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get("/api/categories", this.getAllCategories);
        this.router.get("/api/categories/:_id", this.getOneCategory);
        this.router.post("/api/categories", this.addCategory);
        this.router.put("/api/categories/:_id", this.updateCategory);
        this.router.delete("/api/categories/:_id", this.deleteCategory);
    }

    private async getAllCategories(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const categories = await categoryService.getAllCategories();
            response.json(categories);
        } catch (err: any) { next(err); }
    }

    private async getOneCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const category = await categoryService.getOneCategory(request.params._id);
            response.json(category);
        } catch (err: any) { next(err); }
    }

    private async addCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const category = new CategoryModel(request.body);
            const added = await categoryService.addCategory(category);
            response.status(StatusCode.Created).json(added);
        } catch (err: any) { next(err); }
    }

    private async updateCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            request.body._id = request.params._id;
            const category = new CategoryModel(request.body);
            const updated = await categoryService.updateCategory(category);
            response.json(updated);
        } catch (err: any) { next(err); }
    }

    private async deleteCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            await categoryService.deleteCategory(request.params._id);
            response.sendStatus(StatusCode.NoContent);
        } catch (err: any) { next(err); }
    }
}

export const categoryController = new CategoryController();