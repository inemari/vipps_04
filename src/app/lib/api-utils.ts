/**
 * Shared utilities for API routes
 */
import { NextResponse } from "next/server";

export const createErrorResponse = (
  message: string,
  error?: unknown,
  status = 500
) => {
  console.error(message, error);
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return new NextResponse(`${message}: ${errorMessage}`, {
    status,
  });
};

export const createSuccessResponse = (data: Record<string, unknown>) => {
  return NextResponse.json(data);
};
