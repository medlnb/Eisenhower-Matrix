"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function Nav() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const navs = [
    { label: "My Products", link: "/manageproducts" },
    {
      label: "Add Product",
      link: "/manageproducts/product",
    },
  ];

  const pathname = usePathname();
  return (
    <nav className="max-w-[50rem] mx-auto flex items-center gap-4 font-semibold text-xs text-gray-600 py-3 border-b ">
      {navs.map((nav) => (
        <Link
          key={nav.link}
          href={nav.link}
          className={`relative underlined ${
            pathname === nav.link && !productId ? "text-black font-bold" : ""
          } `}
        >
          {nav.label}
        </Link>
      ))}
    </nav>
  );
}

export default Nav;
