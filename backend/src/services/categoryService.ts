import { ICategoryModel, CategoryModel } from "../models/category-model";

async function getAllCategories(): Promise<ICategoryModel[]> {
    return CategoryModel.find().exec();
}

async function getOneCategory(_id: string): Promise<ICategoryModel> {
    const category = await CategoryModel.findById(_id).exec();
    if (!category) throw new Error(`Category ${_id} not found.`);
    return category;
}

async function addCategory(category: ICategoryModel): Promise<ICategoryModel> {
    await category.validate();   
    return category.save();
}

async function updateCategory(category: ICategoryModel): Promise<ICategoryModel> {
    await category.validate();

    const updated = await CategoryModel.findByIdAndUpdate(
        category._id,
        category,
        { returnOriginal: false, runValidators: true }
    ).exec();

    if (!updated) throw new Error(`Category ${category._id} not found.`);
    return updated;
}

async function deleteCategory(_id: string): Promise<void> {
    const deleted = await CategoryModel.findByIdAndDelete(_id).exec();
    if (!deleted) throw new Error(`Category ${_id} not found.`);
}

export default { getAllCategories, getOneCategory, addCategory, updateCategory, deleteCategory };