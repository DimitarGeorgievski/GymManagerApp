import { useEffect } from "react";
import { useDateInfo } from "../../hooks/useDateInfo";
import { useUserStore } from "../../store/useUserStore";
import { useWorkoutStore } from "../../store/useWorkoutStore";
import { useFoodStore } from "../../store/useFoodStore";
import { usePlanStore } from "../../store/usePlanStore";
import { useExerciseStore } from "../../store/useExerciseStore";
import { Dumbbell, Flame, Utensils, Calendar, CheckCircle, AlertCircle, Target } from "lucide-react";

document.title = "Home";
export function HomePage() {
  const { dayName, day, month, year } = useDateInfo();
  const user = useUserStore((state) => state.user);
  const { todayWorkout, fetchTodaysWorkout, weeklyWorkouts, fetchWeeklyWorkouts } = useWorkoutStore();
  const { todaysNutrition, fetchTodaysNutrition } = useFoodStore();
  const { plans, fetchPlans } = usePlanStore();
  const { exercises, fetchExercises } = useExerciseStore();
  useEffect(() => {
    fetchTodaysWorkout();
    fetchWeeklyWorkouts();
    fetchTodaysNutrition();
    fetchPlans();
    fetchExercises();
  }, [fetchTodaysWorkout, fetchWeeklyWorkouts, fetchTodaysNutrition, fetchPlans, fetchExercises]);
  const totalCalories = todaysNutrition?.reduce((sum, f) => sum + (f.calories || 0), 0) || 0;
  const totalProtein = todaysNutrition?.reduce((sum, f) => sum + (f.protein || 0), 0) || 0;
  const totalCarbs = todaysNutrition?.reduce((sum, f) => sum + (f.carbs || 0), 0) || 0;
  const totalFats = todaysNutrition?.reduce((sum, f) => sum + (f.fats || 0), 0) || 0;
  const activePlan = plans?.find((plan) => {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);
    return start <= today && today <= end;
  });
  return (
    <div className="p-6 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-1 text-center pb-8">
        <h1 className="text-center text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600">
          Today is <span className="font-semibold">{dayName}</span>, {day} {month} {year}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white flex-col gap-3 p-6 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.1)] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
              <Dumbbell size={24} />
              Today's Workout
            </h2>
          </div>
          {todayWorkout ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Dumbbell size={24} className="text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-800">{todayWorkout.title}</p>
                  <p className="text-sm text-gray-600">{todayWorkout.description || "No description"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Flame size={20} className="text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-800">{todayWorkout.durationMinutes} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Target size={20} className="text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500">Exercises</p>
                    <p className="font-semibold text-gray-800">
                      {todayWorkout.workoutExercises?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
              {todayWorkout.workoutExercises && todayWorkout.workoutExercises.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Exercises:</p>
                  <div className="flex flex-wrap gap-2">
                    {todayWorkout.workoutExercises.map((we, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                        {we.exercise?.name || "Unknown"} ({we.sets}×{we.reps})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No workout scheduled for today</p>
              <p className="text-sm text-gray-400 italic">"The only bad workout is the one that didn't happen."</p>
              <p className="text-sm text-gray-400 italic mt-1">— Get moving!</p>
            </div>
          )}
        </div>
        <div className="bg-white flex-col gap-3 p-6 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.1)] border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-orange-700 flex items-center gap-2">
              <Utensils size={24} />
              Nutrition Summary
            </h2>
          </div>
          {todaysNutrition && todaysNutrition.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-orange-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Calories</p>
                  <p className="font-bold text-orange-700 text-lg">{totalCalories} kcal</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Protein</p>
                  <p className="font-bold text-red-700 text-lg">{totalProtein.toFixed(1)} g</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Carbs</p>
                  <p className="font-bold text-yellow-700 text-lg">{totalCarbs.toFixed(1)} g</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Fats</p>
                  <p className="font-bold text-purple-700 text-lg">{totalFats.toFixed(1)} g</p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Meals today:</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {todaysNutrition.map((food, idx) => (
                    <div key={idx} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                      <span className="text-gray-700">{food.name}</span>
                      <span className="text-gray-500">{food.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Utensils size={48} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No meals logged today</p>
              <p className="text-sm text-gray-400">Start tracking your nutrition!</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-[0px_5px_15px_rgba(0,0,0,0.1)] border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2">
            <Calendar size={24} />
            Weekly Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <CheckCircle size={32} className="text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-700">{weeklyWorkouts?.length || 0}</p>
            <p className="text-sm text-gray-500">Workouts this week</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <Target size={32} className="text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-700">{activePlan ? 1 : 0}</p>
            <p className="text-sm text-gray-500">Active plan</p>
            {activePlan && (
              <p className="text-xs text-green-600 mt-1 font-medium">{activePlan.title}</p>
            )}
            {!activePlan && (
              <p className="text-xs text-gray-400 mt-1">No active plan</p>
            )}
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <Dumbbell size={32} className="text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-700">{exercises?.length || 0}</p>
            <p className="text-sm text-gray-500">Exercises available</p>
          </div>
        </div>
      </div>
      {user && (
        <div className="mt-6 p-4 bg-linear-to-r from-blue-500 to-blue-600 rounded-2xl text-white">
          <p className="text-center">
            Welcome back, <span className="font-bold">{user.firstName}</span>!
            Let's make today count.
          </p>
        </div>
      )}
    </div>
  );
}