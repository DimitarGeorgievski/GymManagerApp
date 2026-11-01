import type { Food } from "./food.model";

export interface loginUserReq {
  email: string;
  password: string;
}
export interface RegisterUserReq {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: number;
  weightKg: number;
  heightCm: number;
  birthDate?: string;
  gender?: Gender;
  role?: Exclude<roleType, roleType.ADMIN>;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  weightKg: number;
  heightCm: number;
  role: roleType;
  birthDate: Date;
  gender: Gender;
  createdAt: Date;
  updatedAt: Date;
  foods: Food[];
  plans: Plans[];
  workouts: Workout[];
  trainer?: User;
  clients?: User[];
}
export enum roleType {
  USER = "USER",
  ADMIN = "ADMIN",
  TRAINER = "TRAINER",
}
export enum Gender {
  MALE = "male",
  FEMALE = "female",
}
export interface Plans {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}
export interface Workout {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  date: Date;
  workoutExercises?: WorkoutExercise[];
}
export interface WorkoutExercise {
  id: string;
  sets: number;
  reps: number;
  exercise: Exercise;
}
export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: string;
  equipment: string;
  createdBy?: User;
}
export interface TrainerSwitchRequest {
  id: string;
  user: User;
  requestedTrainer: User;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedByRole: 'USER' | 'TRAINER' | 'ADMIN';
  createdAt: Date;
  decidedAt?: Date;
  decidedBy?: User;
}
