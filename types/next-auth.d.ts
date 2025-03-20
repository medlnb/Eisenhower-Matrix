import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    _id: string;
    name: string;
    email: string;
    image: string;
  }

  interface Profile {
    iss: string;
    azp: string;
    aud: string;
    sub: string;
    email: string;
    email_verified: boolean;
    at_hash: string;
    name: string;
    picture: string;
    given_name: string;
    family_name: string;
    iat: number;
    exp: number;
  }

  interface Session {
    user: {
      _id: string;
      name: string;
      email: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    name: string;
    email: string;
    image?: string;
  }
}
