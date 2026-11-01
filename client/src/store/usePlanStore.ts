import { create } from "zustand";
import api from "../services/api";
import type { Plan } from "../models/plan.model";

interface PlanState {
  plans: Plan[] | null;
  clientActivePlan: Plan | null;
  fetchPlans: () => void;
  fetchClientActivePlan: (clientId: string) => Promise<void>;
}

export const usePlanStore = create<PlanState>((set) => ({
  plans: null,
  clientActivePlan: null,
  fetchPlans: async () => {
    const res = await api.get("/plans/my-plans");
    set({ plans: res.data });
  },
  fetchClientActivePlan: async (clientId: string) => {
    try {
      const res = await api.get(`/plans/trainer/clients/${clientId}/active-plan`);
      set({ clientActivePlan: res.data });
    } catch {
      set({ clientActivePlan: null });
    }
  },
}));