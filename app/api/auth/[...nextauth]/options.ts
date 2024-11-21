import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const options = {
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
        if (!user) throw new Error("Email not found");

        if (user && bcrypt.compareSync(password, user.password)) {
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } else {
          throw new Error("Wrong password");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({
      user,
    }: {
      user: {
        email?: string | null;
        image?: string | null;
        name?: string | null;
      };
    }) {
      try {
        await connectToDatabase();
        if (!user.email || !user.name) return false;

        const userExist = await Member.findOne({ email: user.email });
        if (!userExist) {
          const firstLetter = user.name[0].toUpperCase();
          const defaultImage = `https://dummyimage.com/100x100/000/fff&text=${firstLetter}`;
          await Member.create({
            email: user.email,
            image: user.image ?? defaultImage,
            name: user.name,
            verified: true,
          });
        }
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
