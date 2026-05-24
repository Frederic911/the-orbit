import { NextRequest, NextResponse } from "next/server";

export function checkAuth(req: NextRequest): NextResponse | null {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  // Same-origin check via Origin header
  if (origin && host && new URL(origin).host === host) {
    return null;
  }

  // Fallback: check Referer header (some browsers omit Origin for FormData)
  const referer = req.headers.get("referer");
  if (referer && host) {
    try {
      if (new URL(referer).host === host) {
        return null;
      }
    } catch {
      // invalid referer URL
    }
  }

  const key = req.headers.get("x-api-key");
  if (!key || key !== process.env.API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
