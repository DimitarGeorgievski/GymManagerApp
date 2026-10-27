import { create } from "zustand";
import type { User } from "../models/user.model";
import { createJSONStorage, persist } from "zustand/middleware";
import { tokenService } from "../services/tokenService";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        tokenService.clear();
        set({ user: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
