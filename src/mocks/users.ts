import type { User } from "@/types/auth";

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Admin",
    email: "alice.admin@example.com",
    role: "admin",
  },
  {
    id: 2,
    name: "Oscar Ops",
    email: "oscar.ops@example.com",
    role: "operations",
  },
  {
    id: 3,
    name: "Sam Seller",
    email: "sam.seller@example.com",
    role: "seller",
  },
  {
    id: 4,
    name: "Cathy Customer",
    email: "cathy.customer@example.com",
    role: "customer",
  },
];
