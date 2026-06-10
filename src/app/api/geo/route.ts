import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Read location info injected by the Edge middleware
  const city = request.headers.get("x-detected-city") || "";
  return NextResponse.json({ city });
}
