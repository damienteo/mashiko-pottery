import { Role } from "@/generated/prisma/enums";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  aud?: string; // Stands for audience, only required if depending on custom JWT logic
  createdAt?: string;
  updatedAt?: string;
  confirmedAt?: string;
  lastSignInAt?: string;
  appMetadata?: Record<string, unknown>;
  userMetadata?: Record<string, unknown>;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  firstNameKana: string;
  lastNameKana: string;
  phone: string;
  gender: "male" | "female" | "other" | "none";
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  zip: string;
  pref: string;
  city: string;
  street: string;
  role: Role;
}

export interface Credentials {
  email: string;
  password?: string;
}
