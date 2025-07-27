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
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  zip: string;
  pref: string;
  city: string;
  street: string;
  role: "admin" | "operations" | "seller" | "customer";
}

export interface Credentials {
  email: string;
  password?: string;
}
