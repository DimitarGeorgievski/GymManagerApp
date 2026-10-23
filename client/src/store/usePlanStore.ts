import { create } from "zustand";
import api from "../services/api";
import type { Plan } from "../models/plan.model";

interface PlanState {
  plans: Plan[] | null;
  fetchPlans: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: null,
  fetchPlans: async () => {
    const res = await api.get("/plans");
    set({ plans: res.data });
  },
}));
