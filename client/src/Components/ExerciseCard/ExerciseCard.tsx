import type { Exercise } from "../../models/exercise.model";

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="border bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition hover:scale-101 ease-in cursor-pointer">
      <h2 className="font-semibold text-lg">{exercise.name}</h2>
      <p className="text-sm text-gray-800">{exercise.description}</p>
      <div className="mt-2 flex justify-between text-md text-gray-800">
        <span>Muscle: {exercise.muscleGroup}</span>
        {exercise.equipment && <span>Equipment: {exercise.equipment}</span>}
      </div>
      <div className="mt-1 text-right text-md text-gray-800">
        {new Date(exercise.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
