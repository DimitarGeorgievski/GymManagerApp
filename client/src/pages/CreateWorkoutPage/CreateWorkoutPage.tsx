import { CalendarDays, FileText, Plus, Minus, Clock, Dumbbell } from "lucide-react";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useExerciseStore } from "../../store/useExerciseStore";
import type { CreateWorkoutReq, WorkoutExerciseInput } from "../../models/workout.model";
import api from "../../services/api";

document.title = "Create Workout";
export function CreateWorkout() {
  const navigate = useNavigate();
  const { exercises, fetchExercises } = useExerciseStore();
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);
  const defaultExercise: WorkoutExerciseInput = {
    exerciseId: "",
    sets: 3,
    reps: 10,
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<CreateWorkoutReq>({
    defaultValues: {
      title: "",
      description: "",
      durationMinutes: 0,
      date: new Date().toISOString().split("T")[0],
      workoutExercises: [defaultExercise],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: "workoutExercises",
  });
  const onSubmit = async (data: CreateWorkoutReq) => {
    const validExercises = data.workoutExercises.filter((we) => we.exerciseId);
    if (validExercises.length === 0) {
      toast.error("At least one exercise is required.");
      return;
    }
    try {
      await api.post("/workout", {
        ...data,
        workoutExercises: validExercises,
      });
      toast.success("Workout created successfully");
      reset({
        title: "",
        description: "",
        durationMinutes: 0,
        date: new Date().toISOString().split("T")[0],
        workoutExercises: [defaultExercise],
      });
      navigate("/workout");
    } catch (error: unknown) {
      console.error(error);
      toast.error("Failed to create workout");
    }
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-[#7f92ff] to-white flex items-center justify-center p-4">
      <ToastContainer autoClose={2000} />
      <div className="w-full max-w-lg shadow-[0px_5px_20px_rgba(0,0,0,0.2)] bg-white rounded-3xl p-8">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-center text-2xl font-bold text-gray-800">
            Create Workout
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-3 rounded-lg ${
                errors.title ? "border-2 border-red-500" : ""
              }`}
            >
              <FileText size={20} className="text-gray-500 shrink-0" />
              <input
                className="w-full focus:outline-none bg-transparent"
                placeholder="Workout title"
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
                placeholder="Workout description (optional)"
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
              Duration (minutes)
            </label>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-3 rounded-lg ${
                errors.durationMinutes ? "border-2 border-red-500" : ""
              }`}
            >
              <Clock size={20} className="text-gray-500 shrink-0" />
              <input
                type="number"
                min="1"
                className="w-full focus:outline-none bg-transparent"
                placeholder="Duration in minutes"
                {...register("durationMinutes", {
                  required: "Duration is required",
                  min: {
                    value: 1,
                    message: "Duration must be at least 1 minute",
                  },
                  valueAsNumber: true,
                })}
              />
            </div>
            {errors.durationMinutes && (
              <p className="text-red-500 text-sm mt-1">
                {errors.durationMinutes.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Date
            </label>
            <div
              className={`flex items-center gap-2 bg-[#F1F5F9] p-3 rounded-lg ${
                errors.date ? "border-2 border-red-500" : ""
              }`}
            >
              <CalendarDays size={20} className="text-gray-500 shrink-0" />
              <input
                type="date"
                className="w-full focus:outline-none bg-transparent"
                {...register("date", {
                  required: "Date is required",
                })}
              />
            </div>
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Exercises <span className="text-red-500">*</span>
            </label>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell size={18} className="text-gray-500" />
                    <span className="font-medium text-gray-700">Exercise #{index + 1}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Exercise</label>
                      <select
                        {...register(`workoutExercises.${index}.exerciseId`, {
                          required: "Exercise is required",
                        })}
                        className={`w-full bg-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.workoutExercises?.[index]?.exerciseId
                            ? "border-2 border-red-500"
                            : "border border-gray-300"
                        }`}
                      >
                        <option value="">Select an exercise</option>
                        {exercises?.map((exercise) => (
                          <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </option>
                        ))}
                      </select>
                      {errors.workoutExercises?.[index]?.exerciseId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.workoutExercises[index].exerciseId.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Sets</label>
                      <input
                        type="number"
                        min="1"
                        {...register(`workoutExercises.${index}.sets`, {
                          required: "Sets is required",
                          min: { value: 1, message: "At least 1 set" },
                          valueAsNumber: true,
                        })}
                        className={`w-full bg-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.workoutExercises?.[index]?.sets
                            ? "border-2 border-red-500"
                            : "border border-gray-300"
                        }`}
                      />
                      {errors.workoutExercises?.[index]?.sets && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.workoutExercises[index].sets.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Reps</label>
                      <input
                        type="number"
                        min="1"
                        {...register(`workoutExercises.${index}.reps`, {
                          required: "Reps is required",
                          min: { value: 1, message: "At least 1 rep" },
                          valueAsNumber: true,
                        })}
                        className={`w-full bg-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.workoutExercises?.[index]?.reps
                            ? "border-2 border-red-500"
                            : "border border-gray-300"
                        }`}
                      />
                      {errors.workoutExercises?.[index]?.reps && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.workoutExercises[index].reps.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-2 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                    >
                      <Minus size={16} />
                      Remove Exercise
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => append(defaultExercise)}
                className="w-full flex items-center justify-center gap-2 text-blue-500 hover:text-blue-700 font-medium py-2 border border-dashed border-blue-500 rounded-lg transition"
              >
                <Plus size={18} />
                Add Exercise
              </button>
              {errors.workoutExercises && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.workoutExercises.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Create Workout
          </button>
          <button
            type="button"
            onClick={() => navigate("/workout")}
            className="text-gray-500 hover:text-gray-700 font-medium transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}