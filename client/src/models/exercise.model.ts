export enum MuscleGroup {
  CHEST = "chest",
  BACK = "back",
  SHOULDERS = "shoulders",
  ARMS = "arms",
  LEGS = "legs",
  GLUTEUS = "gluteus",
  ABS = "abs",
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment?: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
}
