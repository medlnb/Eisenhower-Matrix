import AuthProvider from "@components/AuthProvider";
import SideBar from "@components/SideBar";
import { DateProvider } from "@contexts/DateContext";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AuthProvider>
        <DateProvider>
          <main>
            <SideBar />
            <section className="bg-primary-1 md:p-4 p-2 h-svh overflow-auto duration-300 md:ml-24 pb-20">
              {children}
            </section>
          </main>
        </DateProvider>
      </AuthProvider>
    </main>
  );
}

export default Layout;
