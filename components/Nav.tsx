"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavBar() {
  const pathname = usePathname();
  return (
    <div className="flex justify-between gap-4">
      <Link
        className={`w-1/2 h-8 text-center relative  text-white  ${
          pathname === "/tasks" ? "right--extend bg-secondary-2" : ""
        } `}
        href="/tasks"
      >
        Tasks
      </Link>
      <Link
        className={`w-1/2 h-8 text-center relative  text-white  ${
          pathname === "/" ? "left--extend right--extend bg-secondary-2" : ""
        } `}
        href="/"
      >
        Matrix
      </Link>

      <Link
        className={`w-1/2 h-8 text-center relative  text-white ${
          pathname === "/notes"
            ? "left--extend right--OverExtend bg-secondary-2"
            : ""
        } `}
        href="/notes"
      >
        Notes
      </Link>
    </div>
  );
}

export default NavBar;
