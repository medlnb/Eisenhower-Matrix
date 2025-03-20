import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const options: NextAuthOptions = {
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        await connectToDatabase();
        const { email, password } = credentials;
        const user = await Member.findOne({ email });

        if (!user)
          throw new Error(
            JSON.stringify({ email: "This email is not registered" })
          );

        if (!bcrypt.compareSync(password, user.password))
          throw new Error(JSON.stringify({ password: "Incorrect password" }));

        return {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const existingUser = await Member.findOne({ email: profile?.email });

        if (existingUser) {
          user._id = existingUser._id;
          user.name = existingUser.name;
          user.image = existingUser.image;
          return true;
        } else {
          const newUser = await Member.create({
            name: profile?.name,
            email: profile?.email,
            image: profile?.picture,
          });
          user._id = newUser._id;
          user.image = profile?.picture ?? "";
          user.name = profile?.name ?? "";
          return true;
        }
      }
      return true;
    },
    async jwt({ token, trigger, user, session }) {
      if (trigger === "update") {
        if (session.name) token.name = session.name;
        if (session.image) token.image = session.image;
      }
      if (user) {
        console.log("user", user);
        token._id = user._id;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        image: token.image,
        _id: token._id,
      };
      return session;
    },
  },
};
