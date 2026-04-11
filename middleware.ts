import NextAuth from "next-auth";
import { baseAuthConfig, resolveAuthSecret } from "@/lib/auth.config";

const { auth } = NextAuth({
  ...baseAuthConfig,
  secret: resolveAuthSecret(),
  providers: [],
});

export default auth;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/check-in/:path*",
  ],
};