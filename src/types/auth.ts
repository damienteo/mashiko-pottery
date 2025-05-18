export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "operations" | "seller" | "customer";
}

export interface Credentials {
  email: string;
  password: string;
}
