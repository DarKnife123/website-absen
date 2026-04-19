import NextAuth from "next-auth"
import authConfig from "./auth.config"

// Middleware-safe export - uses only Edge-compatible config
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
}
