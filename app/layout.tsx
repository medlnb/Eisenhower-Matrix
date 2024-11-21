import type { Metadata } from "next";
import { Toaster } from "sonner";

import "@styles/globals.css";

export const metadata: Metadata = {
  title: "Eisenhower Matrix",
  description: "Your Ultimate Note and Task Management Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
