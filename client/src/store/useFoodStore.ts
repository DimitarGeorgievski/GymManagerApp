import { create } from "zustand";
import type { Food } from "../models/food.model";

interface FoodState {
  food: Food | null;
  setFood: (food: Food) => void;
}
export const useFoodStore = create<FoodState>((set) => ({
  food: null,
  setFood: (food) => set({ food }),
}));
