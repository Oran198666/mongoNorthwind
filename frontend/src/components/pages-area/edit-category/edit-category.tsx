import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryModel } from "../../../models/CategoryModel";
import { categoryService } from "../../../services/CategoryService";

export function EditCategory() {

    const { register, handleSubmit, setValue, formState } = useForm<CategoryModel>();
    const navigate = useNavigate();
    const { catId } = useParams();

    useEffect(() => {
        categoryService.getOneCategory(catId!)
            .then(c => {
                setValue("_id", c._id);
                setValue("name", c.name);
                setValue("description", c.description);
            })
            .catch(err => alert(err.response?.data?.message || err.message));
    }, [catId]);

    async function send(category: CategoryModel) {
        try {
            await categoryService.updateCategory(category);
            navigate("/categories");
        } catch (err: any) {
            alert(err.response?.data?.message || err.message);
        }
    }

    return (
        <form onSubmit={handleSubmit(send)}>
            <h2>Edit Category</h2>

            <input type="hidden" {...register("_id")} />

            <label>Name:</label>
            <input type="text" {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "Name too short" }
            })} />
            <span>{formState.errors.name?.message}</span>

            <label>Description:</label>
            <textarea {...register("description", { required: "Description is required" })} />
            <span>{formState.errors.description?.message}</span>

            <button>Update</button>
        </form>
    );
}