import { useExerciseStore } from "./useExerciseStore";
import { useUserStore } from "./useUserStore";

export const useStores = () => ({
  user: useUserStore(),
  exercise: useExerciseStore(),
  
});
