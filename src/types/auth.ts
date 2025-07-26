export interface User {
  id: string;
  name?: string;
  email: string;
  role: "admin" | "operations" | "seller" | "customer";
  createdAt?: string;
  updatedAt?: string;
}

export interface Credentials {
  email: string;
  password?: string;
}
