import { create } from "zustand";
import type { Exercise } from "../models/exercise.model";

interface ExerciseState {
  exercises: Exercise[] | null;
  setExercises: (exercises: Exercise[]) => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  setExercises: (exercises) => set({ exercises }),
}));
