import { CalendarDays, FileText, ClipboardList } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
// import { roleType } from "../../models/user.model";
import type { CreatePlanReq } from "../../models/plan.model";
import api from "../../services/api";

document.title = "Create Plan";
export function CreatePlan() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlanReq>({
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    },
    mode: "onBlur",
  });
  const onSubmit = async (data: CreatePlanReq) => {
    // if (user?.role === roleType.USER) {
    //   toast.error("You are not a trainer. You cannot create plans.");
    //   return;
    // }
    if (!user?.id) {
      toast.error("User information is missing. Please log in again.");
      return;
    }
    if (new Date(data.endDate) < new Date(data.startDate)) {
      toast.error("End date cannot be before start date.");
      return;
    }
    try {
      await api.post("/plans", {
        ...data,
        userId: user.id,
      });
      toast.success("Plan created successfully");
      reset();
      navigate("/plans");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to create plan");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white flex items-center justify-center p-4">
      <ToastContainer autoClose={2000} />
      <div className="w-full max-w-lg shadow-[0px_5px_20px_rgba(0,0,0,0.2)] bg-white rounded-3xl p-8">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Create Plan
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-3 rounded-lg ${
                errors.title ? "border-2 border-red-500" : ""
              }`}
            >
              <ClipboardList size={20} className="text-gray-500 shrink-0" />
              <input
                className="w-full focus:outline-none bg-transparent"
                placeholder="Plan title"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <div
              className={`flex items-start gap-2 bg-[#F1F5F9] p-3 rounded-lg ${
                errors.description ? "border-2 border-red-500" : ""
              }`}
            >
              <FileText
                size={20}
                className="text-gray-500 shrink-0 mt-0.5"
              />
              <textarea
                className="w-full focus:outline-none bg-transparent resize-none"
                rows={3}
                placeholder="Plan description (optional)"
                {...register("description", {
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters",
                  },
                })}
              />
            </div>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start date
            </label>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-3 rounded-lg ${
                errors.startDate ? "border-2 border-red-500" : ""
              }`}
            >
              <CalendarDays size={20} className="text-gray-500 shrink-0" />
              <input
                type="date"
                className="w-full focus:outline-none bg-transparent"
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
            </div>
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.startDate.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End date
            </label>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-3 rounded-lg ${
                errors.endDate ? "border-2 border-red-500" : ""
              }`}
            >
              <CalendarDays size={20} className="text-gray-500 shrink-0" />
              <input
                type="date"
                className="w-full focus:outline-none bg-transparent"
                {...register("endDate", {
                  required: "End date is required",
                  validate: (value, formValues) =>
                    value >= formValues.startDate ||
                    "End date cannot be before start date",
                })}
              />
            </div>
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.endDate.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Create Plan
          </button>
          <button
            type="button"
            onClick={() => navigate("/plans")}
            className="text-gray-500 hover:text-gray-700 font-medium transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}