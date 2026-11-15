import axios from "axios";
import { CategoryModel } from "../models/CategoryModel";
import { appConfig } from "../utils/app-config";

class CategoryService {

    public async getAllCategories(): Promise<CategoryModel[]> {
        const response = await axios.get<CategoryModel[]>(appConfig.categoriesUrl);
        return response.data;
    }

    public async getOneCategory(_id: string): Promise<CategoryModel> {
        const response = await axios.get<CategoryModel>(appConfig.categoriesUrl + "/" + _id);
        return response.data;
    }

    public async addCategory(category: CategoryModel): Promise<CategoryModel> {
        const response = await axios.post<CategoryModel>(appConfig.categoriesUrl, category);
        return response.data;
    }

    public async updateCategory(category: CategoryModel): Promise<CategoryModel> {
        const response = await axios.put<CategoryModel>(appConfig.categoriesUrl + "/" + category._id, category);
        return response.data;
    }

    public async deleteCategory(_id: string): Promise<void> {
        await axios.delete(appConfig.categoriesUrl + "/" + _id);
    }
}

export const categoryService = new CategoryService();