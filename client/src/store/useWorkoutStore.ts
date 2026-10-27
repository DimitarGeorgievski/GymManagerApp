import { create } from "zustand";
import api from "../services/api";
import type { Workout } from "../models/workout.model";

interface WorkoutState {
  workouts: Workout[] | null;
  todayWorkout: Workout | null;
  weeklyWorkouts: Workout[] | null;
  fetchWorkouts: () => void;
  fetchTodaysWorkout: () => void;
  fetchWeeklyWorkouts: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  workouts: null,
  todayWorkout: null,
  weeklyWorkouts: null,
  fetchWorkouts: async () => {
    const res = await api.get("/workout");
    set({ workouts: res.data });
  },
  fetchTodaysWorkout: async () => {
    const res = await api.get("/workout/workouts/today");
    set({ todayWorkout: res.data?.[0] || null });
  },
  fetchWeeklyWorkouts: async () => {
    const res = await api.get("/workout/workouts/week");
    set({ weeklyWorkouts: res.data || [] });
  },
}));