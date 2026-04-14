import NextAuth from "next-auth"
// import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import Credentials from "next-auth/providers/credentials"
import { SignInSchema } from "./lib/zod"
import { compareSync } from "bcrypt-ts"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  session: {strategy: "jwt"},
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => { 
        const validateFields = SignInSchema.safeParse(credentials);

        if(!validateFields.success){
          return null;
        }

        const { email, password } = validateFields.data;

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const passwordMatch = compareSync(password, user.password);
        if (!passwordMatch) return null;

        return user;
      }
    })
  ],

  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id
      token.role = user.role
    }
    return token
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string
      session.user.role = token.role as string
    }
    return session
  },
}
  // callbacks
  // callbacks: {
  //   authorized ( {auth, request: { nextUrl } } ) {
  //     const isLoggedIn = !!auth?.user;
  //     const ProtectedRoutes = ["/dashboard", "/user"];

  //     if (!isLoggedIn && ProtectedRoutes.includes(nextUrl.pathname)) {
  //       return Response .redirect(new URL("/login", nextUrl));
  //   }

  //   if (isLoggedIn && nextUrl.pathname.startsWith("/login")) {
  //     return Response.redirect(new URL("/dashboard", nextUrl));
  //   }
  //   return true;
  //   }
  // }
})
