import Link from "next/link";
import { CiSearch, CiUser, CiShoppingCart } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
import Filters from "./Filters";

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-20">
      <section className="border-b p-4">
        <div className="max-w-[50rem] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <Link
              className="text-3xl font-bold text-start w-full md:w-auto"
              href="/"
            >
              Shopping
            </Link>
            <div className="flex justtify-center items-center gap-8 border rounded-md p-1 px-4 bg-gray-100 cursor-pointer hover:bg-gray-200 duration-150 w-full md:w-auto">
              <p className="text-gray-400 flex-1">i am shopping for...</p>
              <CiSearch className="text-gray-600" />
            </div>

            <div className="flex items-center justify-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2 cursor-pointer">
                <BsTelephone size={20} />
                <div>
                  <p className="text-xs text-gray-400">Support</p>
                  <p className="text-sm font-semibold">+213 549 773 117</p>
                </div>
              </div>
              <div className="h-6 w-[0.5px] bg-gray-400" />
              <div className="flex items-center gap-2 cursor-pointer">
                <CiUser size={20} />
                <div>
                  <p className="text-xs text-gray-400">Account</p>
                  <p className="text-sm font-semibold">Log in</p>
                </div>
              </div>
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="relative">
                  <CiShoppingCart size={20} />
                  <p className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white rounded-full w-4 h-4 flex justify-center items-center text-xs font-semibold">
                    0
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Cart</p>
                  <p className="text-sm font-semibold">0 $</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Filters />
    </header>
  );
}

export default Header;
