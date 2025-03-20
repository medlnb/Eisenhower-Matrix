import Image from "next/image";
import logo from "@public/logo.png";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex bg-primary-1 text-white md:flex-row flex-col min-h-screen">
      <div className="flex items-center justify-center bg-primary-2 text-center w-[45rem] max-w-full py-36 md:py-16 px-8">
        <div>
          <Image alt="logo" src={logo.src} height={320} width={320} className="w-96 mx-auto mb-4" />
          <h1 className="text-xl font-semibold">Welcome to <b>Eisenhower Matrix</b></h1>
          <h2 className="text-lg mt-2">Your Ultimate Note and Task Management Solution</h2>
          <p className="text-gray-200 text-base mt-4 leading-relaxed">
            Effortlessly organize your notes and tasks with our innovative Eisenhower Matrix Tasks System.
            <br />
            Experience seamless productivity and stay on top of your to-do list like never before. Get started now!
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center flex-1 md:p-12 py-36 md:py-16">
        {children}
      </div>
    </main>
  );
}

export default Layout;