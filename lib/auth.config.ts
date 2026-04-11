import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export type AuthRole = "ADMIN" | "PARTICIPANT";

/** Returns undefined in production when unset so Auth.js can surface Configuration / MissingSecret instead of crashing module load. */
export function resolveAuthSecret(): string | undefined {
  const s = process.env.AUTH_SECRET?.trim() ||
            process.env.NEXTAUTH_SECRET?.trim();
  if (s) return s;
  if (process.env.NODE_ENV !== "production") {
    return "local-dev-only-secret-min-32-chars-long!!";
  }
  return undefined;
}

export const baseAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request }: { 
      auth: { user?: { role?: AuthRole } } | null, 
      request: any 
    }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role as AuthRole | undefined;

      if (pathname.startsWith("/dashboard") || pathname.startsWith("/check-in")) {
        return isLoggedIn;
      }

      if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
        if (!isLoggedIn) {
          return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
        }
        if (role !== "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
        }
        return true;
      }

      return true;
    },
    async jwt({ token, user }: { token: any, user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AuthRole;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;