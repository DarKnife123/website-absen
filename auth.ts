import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/mongodb"
import { getDb } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import { SignInSchema } from "./lib/zod"
import { compareSync } from "bcrypt-ts"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise) as any,
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

        const db = await getDb();
        const user = await db.collection("users").findOne({ email });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const passwordMatch = compareSync(password, user.password as string);
        if (!passwordMatch) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
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
