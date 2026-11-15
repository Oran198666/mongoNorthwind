import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CategoryModel } from "../../../models/CategoryModel";
import { categoryService } from "../../../services/CategoryService";

export function AddCategory() {

    const { register, handleSubmit, formState } = useForm<CategoryModel>();
    const navigate = useNavigate();

    async function send(category: CategoryModel) {
        try {
            await categoryService.addCategory(category);
            navigate("/categories");
        } catch (err: any) {
            alert(err.response?.data?.message || err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit(send)}>
            <h2>Add Category</h2>

            <label>Name:</label>
            <input type="text" {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name too short" } })} />
            <span>{formState.errors.name?.message}</span>

            <label>Description:</label>
            <textarea {...register("description", { required: "Description is required" })} />
            <span>{formState.errors.description?.message}</span>

            <button>Add</button>
        </form>
    );
}