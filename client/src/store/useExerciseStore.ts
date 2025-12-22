import { create } from "zustand";
import type { Exercise } from "../models/exercise.model";
import api from "../services/api";

interface ExerciseState {
  exercises: Exercise[] | null;
  fetchExercises: () => void;
}

export const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  fetchExercises: async () => {
    const res = await api.get("/exercises");
    set({ exercises: res.data });
  },
}));
