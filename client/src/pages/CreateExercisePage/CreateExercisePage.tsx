import { Dumbbell, FileText, Layers, Wrench } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import {
  MuscleGroup,
  type CreateExerciseReq,
} from "../../models/exercise.model";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { roleType } from "../../models/user.model";

document.title = "Create Exercise";
export function CreateExercise() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateExerciseReq>({
    defaultValues: {
      name: "",
      muscleGroup: MuscleGroup.CHEST,
      equipment: "",
      description: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: CreateExerciseReq) => {
    if(user?.role === roleType.USER) {
        toast.error("You are not a trainer. You cannot create exercises.")
        return
    }
    try {
      await api.post("/exercises", data);
      toast.success("Exercise created successfully");
      reset();
      navigate("/exercise");
    } catch (error: unknown) {
      console.log(error)
      toast.error("Failed to create exercise");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white flex items-center justify-center">
      <ToastContainer autoClose={2000} />
      <div className="w-[35%] shadow-[0px_5px_20px_rgba(0,0,0,0.35)] bg-white rounded-3xl p-8">
        <h1 className="text-center text-2xl font-bold mb-6">Create Exercise</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-2 rounded ${
                errors.name ? "border-2 border-red-500" : ""
              }`}
            >
              <Dumbbell color="#808080" />
              <input
                className="w-full focus:outline-none bg-[#F1F5F9]"
                placeholder="Exercise name"
                {...register("name", {
                  required: "Name is required",
                  minLength: 3,
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
                errors.muscleGroup ? "border-2 border-red-500" : ""
              }`}
            >
              <Layers color="#808080" />
              <select
                className="w-full focus:outline-none bg-[#F1F5F9]"
                {...register("muscleGroup", { required: true })}
              >
                {Object.values(MuscleGroup).map((group) => (
                  <option key={group} value={group}>
                    {group.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 bg-[#F1F5F9] p-2 rounded">
              <Wrench color="#808080" />
              <input
                className="w-full focus:outline-none bg-[#F1F5F9]"
                placeholder="Equipment"
                {...register("equipment")}
              />
            </div>
          </div>
          <div>
            <div
              className={`flex items-start gap-2 bg-[#F1F5F9] p-2 rounded ${
                errors.description ? "border-2 border-red-500" : ""
              }`}
            >
              <FileText color="#808080" />
              <textarea
                className="w-full focus:outline-none bg-[#F1F5F9] resize-none"
                rows={3}
                placeholder="Description"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 5,
                    message: "Description must be at least 5 characters",
                  },
                  maxLength: {
                    value: 150,
                    message: "Description cannot exceed 150 characters",
                  },
                })}
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-semibold"
          >
            Create Exercise
          </button>
        </form>
      </div>
    </div>
  );
}
