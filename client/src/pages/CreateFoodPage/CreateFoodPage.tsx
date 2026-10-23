import { Apple, Zap, Droplet, BarChart, Beef } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { roleType } from "../../models/user.model";
import type { CreateFoodReq } from "../../models/food.model";

document.title = "Create Food";
export function CreateFood() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFoodReq>({
    defaultValues: {
      name: "",
      calories: 0,
      carbs: 0,
      fats: 0,
      protein: 0,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: CreateFoodReq) => {
    if (user?.role === roleType.USER) {
      toast.error("You are not a trainer. You cannot create Foods.");
      return;
    }
    try {
      const FoodWithUser = {...data, userId: user?.id}
      await api.post("/food", FoodWithUser);
      toast.success("Food created successfully");
      reset();
      navigate("/food");
    } catch (error: unknown) {
      console.log(error);
      toast.error("Failed to create food");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white flex items-center justify-center">
      <ToastContainer autoClose={2000} />
      <div className="w-[35%] shadow-[0px_5px_20px_rgba(0,0,0,0.35)] bg-white rounded-3xl p-8">
        <h1 className="text-center text-2xl font-bold mb-6">Create Food</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-2 rounded ${
                errors.name ? "border-2 border-red-500" : ""
              }`}
            >
              <Apple color="#808080" />
              <input
                className="w-full focus:outline-none bg-[#F1F5F9]"
                placeholder="Food name"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name too short" },
                  maxLength: { value: 100, message: "Name too long" },
                })}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-2 rounded ${
                errors.calories ? "border-2 border-red-500" : ""
              }`}
            >
              <Zap color="#808080" />
              <input
                type="number"
                placeholder="Enter food's Calories"
                step={0.01}
                className="w-full focus:outline-none bg-[#F1F5F9]"
                {...register("calories", {
                  required: "Calories are required",
                  min: { value: 0, message: "Calories cannot be negative" },
                  valueAsNumber: true,
                })}
              ></input>
            </div>
            <div>
              {errors.calories && (
                <p className="text-red-500 text-sm">
                  {errors.calories.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-2 rounded ${
                errors.protein ? "border-2 border-red-500" : ""
              }`}
            >
              <Beef color="#808080" />
              <input
                type="number"
                placeholder="Enter food's Protein"
                step={0.01}
                className="w-full focus:outline-none bg-[#F1F5F9]"
                {...register("protein", {
                  required: "Protein is required",
                  min: { value: 0, message: "Protein cannot be negative" },
                  valueAsNumber: true,
                })}
              ></input>
            </div>
            <div>
              {errors.protein && (
                <p className="text-red-500 text-sm">{errors.protein.message}</p>
              )}
            </div>
          </div>
          <div>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-2 rounded ${
                errors.carbs ? "border-2 border-red-500" : ""
              }`}
            >
              <BarChart color="#808080" />
              <input
                type="number"
                placeholder="Enter food's Carbs"
                step={0.01}
                className="w-full focus:outline-none bg-[#F1F5F9]"
                {...register("carbs", {
                  required: "Carbs are required",
                  min: { value: 0, message: "Carbs cannot be negative" },
                  valueAsNumber: true,
                })}
              ></input>
            </div>
            <div>
              {errors.carbs && (
                <p className="text-red-500 text-sm">{errors.carbs.message}</p>
              )}
            </div>
          </div>
          <div>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-2 rounded ${
                errors.fats ? "border-2 border-red-500" : ""
              }`}
            >
              <Droplet color="#808080" />
              <input
                type="number"
                placeholder="Enter food's Fats"
                step={0.01}
                className="w-full focus:outline-none bg-[#F1F5F9]"
                {...register("fats", {
                  required: "Fats are required",
                  min: { value: 0, message: "Fats cannot be negative" },
                  valueAsNumber: true,
                })}
              ></input>
            </div>
            <div>
              {errors.fats && (
                <p className="text-red-500 text-sm">{errors.fats.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold"
          >
            Create Food
          </button>
        </form>
      </div>
    </div>
  );
}
