import { create } from "zustand";
import api from "../services/api";
import type { Food } from "../models/food.model";

interface FoodState {
  foods: Food[] | null;
  todaysNutrition: Food[] | null;
  fetchFoods: () => void;
  fetchTodaysNutrition: () => void;
}

export const useFoodStore = create<FoodState>((set) => ({
  foods: [],
  todaysNutrition: null,
  fetchFoods: async () => {
    const res = await api.get("/food");
    console.log("food", res);
    set({ foods: res.data });
  },
  fetchTodaysNutrition: async () => {
    const res = await api.get("/food/nutrition/today");
    set({ todaysNutrition: res.data || [] });
  },
}));
