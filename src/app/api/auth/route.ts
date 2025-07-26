// DEPRECATED: This mock auth route is no longer used. Supabase Auth handles login and session management.
import { NextRequest, NextResponse } from "next/server";

// Mock user database
const mockUsers = [
  { id: "1", username: "admin", password: "password", name: "Admin User" },
  { id: "2", username: "user", password: "password", name: "Regular User" },
];

// POST /api/auth - login
export async function POST(req: NextRequest) {
  console.warn(
    "DEPRECATED: POST /api/auth is no longer used. Use Supabase Auth instead."
  );
  try {
    const { username, password } = await req.json();
    const user = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // In a real app, you'd set a secure cookie or return a JWT
    const token = `mock-token-for-user-${user.id}`;
    return NextResponse.json({ user: { id: user.id, name: user.name }, token });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// GET /api/auth - get current session (mock)
export async function GET() {
  console.warn(
    "DEPRECATED: GET /api/auth is no longer used. Use Supabase Auth instead."
  );
  // In a real app, you'd read from cookies or headers
  // Here we return a mock "not authenticated" response
  return NextResponse.json({ user: null });
}
