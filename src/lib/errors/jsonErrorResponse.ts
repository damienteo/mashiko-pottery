import { NextResponse } from "next/server";

/**
 * Create a standardized JSON error response.
 * @param message Error message string or object.
 * @param status HTTP status code (default 400).
 * @returns NextResponse with error JSON and status code.
 */
export function jsonErrorResponse(
  message: string | Record<string, unknown>,
  status: number = 400,
) {
  const payload = typeof message === "string" ? { error: message } : message;
  return NextResponse.json(payload, { status });
}
