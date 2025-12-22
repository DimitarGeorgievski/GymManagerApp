import { create } from "zustand";
import api from "../services/api";
import type { Food } from "../models/food.model";

interface FoodState {
  foods: Food[] | null;
  fetchFoods: () => void;
}

export const useFoodStore = create<FoodState>((set) => ({
  foods: [],
  fetchFoods: async () => {
    const res = await api.get("/food");
    console.log("food", res);
    set({ foods: res.data });
  },
}));
