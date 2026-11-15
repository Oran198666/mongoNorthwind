import { Document, Schema, Types, model } from "mongoose";

// 1. Interface
export interface ICountryModel extends Document {
    _id: Types.ObjectId;
    name: string;
}

// 2. Schema
export const CountrySchema = new Schema<ICountryModel>({
    name: { type: String, required: true, trim: true }
}, { versionKey: false, collection: "countries" });

// 3. Model
export const CountryModel = model<ICountryModel>("CountryModel", CountrySchema);