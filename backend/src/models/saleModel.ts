import { Document, Schema, Types, model } from "mongoose";

// 1. Interface
export interface ISaleModel extends Document {
    _id: Types.ObjectId;
    details: string;
}

// 2. Schema
export const SaleSchema = new Schema<ISaleModel>({
    details: { type: String, required: true, trim: true }
}, { versionKey: false, collection: "sales", id: false });

// 3. Model
export const SaleModel = model<ISaleModel>("SaleModel", SaleSchema);