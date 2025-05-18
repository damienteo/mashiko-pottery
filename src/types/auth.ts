export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "seller" | "customer";
}

export interface Credentials {
  email: string;
  password: string;
}
