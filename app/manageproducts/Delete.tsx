"use client";
import { FiTrash } from "react-icons/fi";
import { useState } from "react";
import { toast } from "sonner";
import { MoonLoader } from "react-spinners";

function Delete({ productId }: { productId: string }) {
  const [stat, setStat] = useState<"loading" | "deleted">();

  const HandleDelte = async () => {
    setStat("loading");
    const res = await fetch("/api/admin/product", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    if (!res.ok) return toast.error("Something went wrong");
    toast.success("Product deleted");
    setStat("deleted");
  };

  return (
    <div className="flex justify-center gap-2 items-center">
      {stat === "deleted" ? (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-400 opacity-35"></div>
      ) : stat === "loading" ? (
        <MoonLoader size={13} />
      ) : (
        <FiTrash
          onClick={HandleDelte}
          className="border p-1 rounded-full cursor-pointer hover:bg-gray-200 duration-150"
          size={25}
        />
      )}
    </div>
  );
}

export default Delete;
