import { useDateInfo } from "../../hooks/useDateInfo";
// import { useUserStore } from "../../store/useUserStore";

export function HomePage() {
  document.title = "Home";
  const { dayName, day, month, year, date } = useDateInfo();
  // const { user } = useUserStore();
  // const todayWorkout = user?.workouts.find(
  //   (w) => new Date(w.date).setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)
  // );
  // const todaysFoods = user?.foods.filter((f) => {
  //   const foodDate = new Date(f.).setHours(0, 0, 0, 0);
  //   return foodDate === date.setHours(0, 0, 0, 0);
  // });
  console.log([dayName, "ab", day, "abc", month, "ac", year, "dc", date]);
  return (
    <div className="p-6 w-full">
      <div className="flex flex-col gap-1 text-center pb-12">
        <h1 className="text-center text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600">
          Today is <span className="font-semibold">{dayName}</span>, {day}{" "}
          {month}, {year}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex bg-white flex-col gap-3 p-4 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">
            Today’s Workout
          </h2>
          <div className="tex-gray-700">
            <p>Workout: Morning Workout</p>
            <p>Duration: 60 minutes</p>
            <p>Exercises: Bench Press, Squat</p>
          </div>
        </div>
        <div className="flex bg-white flex-col gap-3 p-4 rounded-2xl shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">
            Nutrition Summary
          </h2>
          <div className="text-gray-700">
            <p>Calories: 165 kcal</p>
            <p>Protein: 31 g</p>
            <p>Carbs: 0 g</p>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white rounded-2xl flex flex-col gap-3 p-4 shadow-[0px_5px_15px_rgba(0,0,0,0.35)]">
        <h2 className="text-xl font-semibold text-blue-700 mb-3">
          Weekly Overview
        </h2>
        <div className="text-gray-700">
          <p>Workouts this week: 1</p>
          <p>Active plan: Weight Loss Plan</p>
          <p>Exercises available: 2</p>
        </div>
      </div>
    </div>
  );
}
