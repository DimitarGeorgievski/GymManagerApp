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
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}
export interface Workout {
  title: string;
  description: string;
  durationMinutes: number;
  date: Date;
}
