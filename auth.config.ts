import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

// Edge-compatible config (no Node.js modules like bcrypt or prisma)
export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // authorize will be overridden in auth.ts
      authorize: async () => null,
    }),
  ],
} satisfies NextAuthConfig
