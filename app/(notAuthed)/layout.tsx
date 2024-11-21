import logo from "@public/logo.png";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex bg-primary-1 text-white md:flex-row flex-col ">
      <div className="flex items-center bg-primary-2 text-center w-[40rem] max-w-full py-32 md:py-10">
        <div className="text-sm">
          <img src={logo.src} className="w-72 mx-auto mb-2" />
          <p>
            Welcome to <b>Eisenhower Matrix</b> <br />
            <br />
            Your Ultimate Note and Task Management Solution <br />
            <br />
            Effortlessly organize your notes and tasks with our innovative
            Eisenhower Matrix Tasks System.
            <br />
            Experience seamless productivity and stay on top of your to-do list
            like never before. Get started now!{'"'}
          </p>
        </div>
      </div>
      <div className="h-svh flex items-center justify-center flex-1 p-10 py-32 md:py-10">
        {children}
      </div>
    </main>
  );
}

export default Layout;
