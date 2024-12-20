import { ReactNode } from "react";
import Nav from "./Nav";

function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-gray-100">
      <Nav />
      {children}
    </main>
  );
}

export default Layout;
