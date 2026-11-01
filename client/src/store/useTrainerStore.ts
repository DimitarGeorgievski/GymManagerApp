import { create } from "zustand";
import api from "../services/api";
import type { User, TrainerSwitchRequest } from "../models/user.model";
import type { Workout } from "../models/workout.model";

interface TrainerState {
  trainers: User[];
  myTrainer: User | null;
  pendingRequests: TrainerSwitchRequest[];
  clients: User[];
  selectedClient: User | null;
  clientWorkouts: any[];
  clientActiveWorkout: Workout | null;
  loading: boolean;
  error: string | null;
  fetchTrainers: () => Promise<void>;
  fetchMyTrainer: () => Promise<void>;
  requestTrainer: (trainerId: string) => Promise<void>;
  fetchPendingRequests: () => Promise<void>;
  decideRequest: (requestId: string, approve: boolean) => Promise<void>;
  fetchClients: () => Promise<void>;
  fetchClientWorkouts: (clientId: string) => Promise<void>;
  fetchClientActiveWorkout: (clientId: string) => Promise<void>;
  assignPlanToClient: (clientId: string, planId: string) => Promise<void>;
  removePlanFromClient: (clientId: string, planId: string) => Promise<void>;
  removeClient: (clientId: string) => Promise<void>;
  assignWorkoutToClient: (clientId: string, workoutId: string) => Promise<void>;
  removeWorkoutFromClient: (clientId: string, workoutId: string) => Promise<void>;
}

export const useTrainerStore = create<TrainerState>((set, get) => ({
  trainers: [],
  myTrainer: null,
  pendingRequests: [],
  clients: [],
  selectedClient: null,
  clientWorkouts: [],
  clientActiveWorkout: null,
  loading: false,
  error: null,
  fetchTrainers: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/trainer-requests/trainers");
      set({ trainers: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch trainers", loading: false });
    }
  },
  fetchMyTrainer: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/trainer-requests/my-trainer");
      set({ myTrainer: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch trainer", loading: false });
    }
  },
  requestTrainer: async (trainerId: string) => {
    set({ loading: true, error: null });
    try {
      await api.post("/trainer-requests/request", { trainerId });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to request trainer", loading: false });
      throw error;
    }
  },
  fetchPendingRequests: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/trainer-requests/pending");
      set({ pendingRequests: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch requests", loading: false });
    }
  },
  decideRequest: async (requestId: string, approve: boolean) => {
    set({ loading: true, error: null });
    try {
      await api.patch(`/trainer-requests/pending/${requestId}`, { approve });
      const requests = get().pendingRequests.filter(r => r.id !== requestId);
      set({ pendingRequests: requests, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to decide request", loading: false });
      throw error;
    }
  },
  fetchClients: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/trainer-requests/clients");
      set({ clients: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch clients", loading: false });
    }
  },
  fetchClientWorkouts: async (clientId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get(`/workout/trainer/clients/${clientId}/workouts`);
      set({ clientWorkouts: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch client workouts", loading: false });
    }
  },
  fetchClientActiveWorkout: async (clientId: string) => {
    try {
      const res = await api.get(`/workout/trainer/clients/${clientId}/workouts/today`);
      set({ clientActiveWorkout: res.data?.[0] || null });
    } catch {
      set({ clientActiveWorkout: null });
    }
  },
  assignPlanToClient: async (clientId: string, planId: string) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/plans/trainer/clients/${clientId}/assign-plan`, { planId });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to assign plan", loading: false });
      throw error;
    }
  },
  removeClient: async (clientId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/trainer-requests/clients/${clientId}`);
      const res = await api.get("/trainer-requests/clients");
      set({ clients: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to remove client", loading: false });
      throw error;
    }
  },
  assignWorkoutToClient: async (clientId: string, workoutId: string) => {
    set({ loading: true, error: null });
    try {
      await api.post(`/workout/trainer/clients/${clientId}/assign-workout`, { workoutId });
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to assign workout", loading: false });
      throw error;
    }
  },
  removePlanFromClient: async (clientId: string, planId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/plans/trainer/clients/${clientId}/plans/${planId}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to remove plan", loading: false });
      throw error;
    }
  },
  removeWorkoutFromClient: async (clientId: string, workoutId: string) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/workout/trainer/clients/${clientId}/workouts/${workoutId}`);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to remove workout", loading: false });
      throw error;
    }
  },
}));