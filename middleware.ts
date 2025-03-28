import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

const authMiddleware = withAuth({
  callbacks: {
    authorized: ({ token }) => token != null,
  },
  pages: {
    signIn: "/login",
  },
});

export default function middleware(req: NextRequest) {
  console.log(req.url);
  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ["/", "/matrix", "/notes", "/user"],
};
