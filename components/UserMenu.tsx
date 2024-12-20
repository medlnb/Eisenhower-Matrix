import { getServerSession } from "next-auth";
import { CiShoppingCart, CiUser } from "react-icons/ci";

async function UserMenu() {
  const session = await getServerSession();
  return session ? (
    <div className="flex items-center gap-3">
      <CiShoppingCart
        size={30}
        className="p-1 rounded-full hover:scale-110 duration-150 cursor-pointer"
      />
      <CiUser
        size={30}
        className="p-1 rounded-full hover:scale-110 duration-150 cursor-pointer"
      />
    </div>
  ) : (
    <p>Log in</p>
  );
}

export default UserMenu;
