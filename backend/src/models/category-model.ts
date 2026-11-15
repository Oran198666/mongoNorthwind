import { Document, model, Schema } from "mongoose";

export interface ICategoryModel extends Document {
    name: string;
    description: string;
}

export const CategorySchema = new Schema<ICategoryModel>({
    name: {
        type: String,
        required: [true, "Missing category name."],
        minlength: [2, "Name too short."],
        maxlength: [100, "Name too long."],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Missing description."],
        maxlength: [1000, "Description too long."],
        trim: true
    }
}, {
    versionKey: false,
    toJSON: { virtuals: true },
    id: false
});

export const CategoryModel = model<ICategoryModel>("CategoryModel", CategorySchema, "Categories");