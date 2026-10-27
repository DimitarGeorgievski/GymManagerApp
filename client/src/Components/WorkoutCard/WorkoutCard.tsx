import { Clock, CalendarDays, Dumbbell, FileText } from "lucide-react";
import type { Workout } from "../../models/workout.model";

interface WorkoutCardProps {
  workout: Workout;
}

export function WorkoutCard({ workout }: WorkoutCardProps) {
  const workoutDate = new Date(workout.date);
  const exerciseNames = workout.workoutExercises
    ?.map((we) => we.exercise?.name)
    .filter(Boolean)
    .join(", ") || "No exercises";

  return (
    <div className="bg-white rounded-2xl border hover:shadow-xl transition hover:scale-[1.01] ease-in cursor-pointer p-5">
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={18} className="text-gray-600 shrink-0" />
          <h2 className="text-lg font-bold text-gray-800 wrap-break-word">
            {workout.title}
          </h2>
        </div>
        <span className="text-sm text-gray-400 whitespace-nowrap">
          {new Date(workout.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
        {workout.description || "No description"}
      </p>
      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarDays size={16} className="shrink-0" />
          <div>
            <p className="text-gray-400 text-xs">Date</p>
            <span className="font-semibold text-gray-800">
              {workoutDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock size={16} className="shrink-0" />
          <span>
            Duration:{" "}
            <span className="font-semibold text-gray-800">
              {workout.durationMinutes} min
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 col-span-2">
          <Dumbbell size={16} className="shrink-0" />
          <span>
            Exercises:{" "}
            <span className="font-semibold text-gray-800">{exerciseNames}</span>
          </span>
        </div>
      </div>
    </div>
  );
}