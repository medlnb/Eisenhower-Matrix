"use client";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineDelete } from "react-icons/md";
import { toast } from "sonner";

function ListManager({
  title,
  HandlingAdd,
  HandlingRemove,
  list,
  rtl,
}: {
  title: string;
  HandlingAdd: (item: string) => void;
  HandlingRemove: (item: string) => void;
  list: string[];
  rtl?: boolean;
}) {
  const [input, setInput] = useState("");
  return (
    <div className="flex-1 text-sm my-5">
      <h3 className="text-gray-500 font-semibold mb-2">{title}</h3>
      <div className="flex items-center gap-2 my-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border bg-gray-100 border-gray-300 focus:outline-none w-full p-2 rounded-md"
          placeholder="Tomato"
        />
        <IoIosAddCircleOutline
          size={20}
          className="cursor-pointer hover:text-blue-500 duration-150 hover:scale-110"
          onClick={() => {
            if (input === "" || list.includes(input))
              return toast.warning("Invalid input or already exists");
            HandlingAdd(input);
            setInput("");
          }}
        />
      </div>

      {list.map((item) => (
        <div
          key={item}
          className={`mb-2 show-down-little flex items-center justify-between gap-2 ${
            rtl ? "text-right" : ""
          }`}
        >
          <p className="border border-gray-500 focus:outline-none p-2 rounded-md flex-1">
            {!rtl && "•"} {item}
            {rtl && " •"}
          </p>
          <MdOutlineDelete
            className="cursor-pointer"
            size={20}
            onClick={() => {
              HandlingRemove(item);
              setInput("");
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default ListManager;
