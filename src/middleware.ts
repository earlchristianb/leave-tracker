import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function middleware(request: NextRequest) {
  const { isAuthenticated, getAccessTokenRaw } = getKindeServerSession();
  const isUserAuthenticated = await isAuthenticated();
  console.log("middleware is isAuthenticated", isUserAuthenticated);
  const pathname = request.nextUrl.pathname;
  const hostname = request.nextUrl.hostname;
  // Check if the URL is external
  const isExternal = !hostname.startsWith("http://localhost:3000");
  if (
    !isUserAuthenticated &&
    pathname !== "/login" &&
    !pathname.includes("kinde") &&
    !isExternal
  ) {
    return NextResponse.redirect(new URL("/api/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|kinde).*)"], // Apply middleware to all routes except /login, /_next/static, /_next/image, /favicon.ico, and any link containing "kinde"
};
