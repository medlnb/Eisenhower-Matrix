"use client";
import { usePathname } from "next/navigation";
import favicon from "@public/favicon.png";
import { FaNoteSticky, FaTable } from "react-icons/fa6";
import { FiCheckSquare } from "react-icons/fi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { CiLogout } from "react-icons/ci";

function SideBar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navs = [
    { href: "/", ico: <FaTable size={25} /> },
    { href: "/notes", ico: <FaNoteSticky size={25} /> },
    { href: "/tasks", ico: <FiCheckSquare size={25} /> },
  ];

  return (
    <>
      <aside className="bg-primary-1 fixed left-0 h-svh md:flex hidden flex-col justify-between py-4 duration-300 w-24">
        <div>
          <img src={favicon.src} className="w-12 h-12 mx-auto" />
          <nav className="mt-20 px-2 py-1 bg-primary-2 w-10 mx-auto rounded-full">
            {navs.map((nav, index) => (
              <Link
                key={nav.href}
                href={nav.href}
                className={`flex hover:gap-5 justify-center items-center gap-3 rounded-full duration-150 ${
                  pathname === nav.href ? "scale-125" : ""
                } ${index ? "mt-4" : ""}`}
              >
                <div
                  className={`rounded-full p-2 ${
                    pathname === nav.href
                      ? "bg-secondary-2 text-white"
                      : "text-gray-400"
                  }`}
                >
                  {nav.ico}
                </div>
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-3  items-center bg-primary-2 w-10 mx-auto rounded-full py-2">
          <CiLogout
            size={25}
            className="text-white cursor-pointer hover:scale-105 duration-200"
            onClick={() => signOut()}
          />

          <img
            src={
              session?.user?.image ??
              "https://dummyimage.com/100x100/000/fff&text=U"
            }
            className="h-8 w-8 rounded-full"
          />
        </div>
      </aside>
      <nav className="fixed md:hidden bottom-0 w-full  rounded-t-2xl overflow-hidden z-30 shadow-lg shadow-black">
        <div className="absolute w-full h-full top-0 left-0  z-10 opacity-80 bg-primary-2"></div>
        <div className="flex justify-around items-center py-2 relative z-20 text-white">
          {navs.map((nav) => (
            <Link
              key={nav.href}
              href={nav.href}
              className={`p-2 text-xs duration-300 ${
                pathname === nav.href
                  ? "scale-105 bg-secondary-2  rounded-full"
                  : ""
              }`}
            >
              {nav.ico}
            </Link>
          ))}
          <img
            onClick={() => signOut()}
            src={
              session?.user?.image ??
              "https://dummyimage.com/100x100/000/fff&text=U"
            }
            className="h-8 w-8 rounded-full"
          />
        </div>
      </nav>
    </>
  );
}

export default SideBar;
