export interface Workout {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  date: Date;
  createdAt: string;
  updatedAt: string;
  workoutExercises?: Array<{
    id: string;
    exercise: {
      id: string;
      name: string;
    };
    sets: number;
    reps: number;
  }>;
}

export interface WorkoutExerciseInput {
  exerciseId: string;
  sets: number;
  reps: number;
}

export interface CreateWorkoutReq {
  title: string;
  description?: string;
  durationMinutes: number;
  date: string;
  workoutExercises: WorkoutExerciseInput[];
}