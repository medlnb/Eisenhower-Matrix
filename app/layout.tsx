import type { Metadata } from "next";
import { Toaster } from "sonner";
import AuthProvider from "@components/AuthProvider";
import "@styles/globals.css";
import Header from "@components/Header/Header";

export const metadata: Metadata = {
  title: "Shopping",
  description: "Your Ultimate online store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="p-2 md:pt-[7.3rem] pt-60">
        <Toaster richColors />
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
