import { Document, Schema, Types, model } from "mongoose";
import { ICountryModel } from "./countryModel";

// 1. Interface
export interface ISupplierModel extends Document {
    _id: Types.ObjectId;
    companyName: string;
    contactName: string;
    contactTitle: string;
    city: string;
    address: string;
    phone: string;
    fax: string;
    countryId: Types.ObjectId;
    country?: ICountryModel;
}

// 2. Schema
export const SupplierSchema = new Schema<ISupplierModel>({
    companyName: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true },
    contactTitle: { type: String, trim: true },
    city: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    fax: { type: String, trim: true },
    countryId: { type: Schema.Types.ObjectId, ref: "CountryModel" }
}, { versionKey: false, collection: "suppliers", toJSON: { virtuals: true }, id: false });

//3.virtual field
SupplierSchema.virtual("country", {
    ref: "CountryModel",
    localField: "countryId",
    foreignField: "_id",
    justOne: true
});


// 4. Model
export const SupplierModel = model<ISupplierModel>("SupplierModel", SupplierSchema);