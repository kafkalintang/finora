import { NextRequest, NextResponse } from "next/server";
export function middleware(req: NextRequest) {
  if (!req.cookies.get("finora_rt")) return NextResponse.redirect(new URL("/login", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*"] };
