import Link from "next/link";
import { Suspense } from "react";
import { LuShoppingCart } from "react-icons/lu";
import { getServerSession } from "next-auth";
import AuthForm from "./AuthForm";
import Image from "next/image";
import SearchBar from "./SearchBar";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";

function TopBar() {
  return (
    <div className="bg-red-400 p-2 flex justify-around items-center text-white">
      <Link href="/" className="text-2xl font-extrabold">
        Shopping
      </Link>
      <SearchBar />
      <Suspense fallback={<p>Loading</p>}>
        <UserMenu />
      </Suspense>
    </div>
  );
}

export default TopBar;

async function UserMenu() {
  const session = await getServerSession();
  return session && session.user ? (
    <div className="flex items-center gap-4">
      <Link href="/cart">
        <LuShoppingCart
          size={20}
          className="hover:scale-110 duration-150 cursor-pointer"
        />
      </Link>
      <Link href="/manageproducts">
        <HiOutlineBuildingStorefront
          size={20}
          className="rounded-full hover:scale-110 duration-150 cursor-pointer"
        />
      </Link>
      <Link href="/user">
        <Image
          src={session.user.image!}
          alt="User"
          className="w-5 h-5 rounded-full hover:scale-110 duration-150 cursor-pointer"
          width={24}
          height={24}
        />
      </Link>
    </div>
  ) : (
    <AuthForm />
  );
}
