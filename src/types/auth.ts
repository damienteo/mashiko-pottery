export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operations" | "seller" | "customer";
  createdAt?: string;
  updatedAt?: string;
}

export interface Credentials {
  email: string;
  password: string;
}
