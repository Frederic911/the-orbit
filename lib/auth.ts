import { NextRequest, NextResponse } from "next/server";

export function checkAuth(req: NextRequest): NextResponse | null {
  const key = req.headers.get("x-api-key");
  if (!key || key !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
