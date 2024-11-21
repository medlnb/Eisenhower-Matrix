"use client";
import { SessionProvider } from "next-auth/react";

const AuthProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: {
    user: {
      name: string;
      email: string;
      image: string;
    };
    expires: string;
  };
}) => <SessionProvider session={session}>{children}</SessionProvider>;

export default AuthProvider;
