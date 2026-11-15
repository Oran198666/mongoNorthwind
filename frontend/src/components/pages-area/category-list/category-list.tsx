import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryModel } from "../../../models/CategoryModel";
import { categoryService } from "../../../services/CategoryService";

export function CategoryList() {

    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        categoryService.getAllCategories()
            .then(setCategories)
            .catch(err => alert(err.response?.data?.message || err.message));
    }, []);

    async function remove(_id: string) {
        if (!confirm("Delete this category?")) return;
        try {
            await categoryService.deleteCategory(_id);
            setCategories(categories.filter(c => c._id !== _id));
        } catch (err: any) {
            alert(err.response?.data?.message || err.message);
        }
    }

    return (
        <div className="CategoryList">
            <h2>Categories</h2>
            <button onClick={() => navigate("/categories/new")}>+ Add Category</button>

            {categories.map(c =>
                <div key={c._id} className="card">
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                    <button onClick={() => navigate("/categories/edit/" + c._id)}>Edit</button>
                    <button onClick={() => remove(c._id)}>Delete</button>
                </div>
            )}
        </div>
    );
}