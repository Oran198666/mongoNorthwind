import express, { Request, Response } from "express";
import { SaleModel } from "../models/saleModel";
import { StatusCode } from "../models/enum";
import { saleService } from "../services/SaleService";

class SaleController {

    public readonly router = express.Router();

    public constructor() {
        this.registerRoutes();
    }

    private registerRoutes(): void {
        this.router.get("/api/sales", this.getAllSales);
        this.router.get("/api/sales/:_id", this.getOneSale);
        this.router.post("/api/sales", this.addSale);
    }

    private async getAllSales(request: Request, response: Response) {
        const sales = await saleService.getAllSales();
        response.json(sales);
    }

    private async getOneSale(request: Request, response: Response) {
        const _id = request.params._id as string;
        const sale = await saleService.getOneSale(_id);
        response.json(sale);
    }

    private async addSale(request: Request, response: Response) {
        const sale = new SaleModel(request.body);
        const dbSale = await saleService.addSale(sale);
        response.status(StatusCode.Created).json(sale);
    }
}

export const saleController = new SaleController();