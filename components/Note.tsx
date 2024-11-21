import { useMemo, useState } from "react";
import { GrFormEdit } from "react-icons/gr";
import { MoonLoader } from "react-spinners";
import { BsFillTrash2Fill } from "react-icons/bs";

export default function Note({
  _id,
  title,
  content,
  HandleOpenEdit,
  HandleDelete,
}: {
  _id: string;
  title: string;
  content: string;
  HandleOpenEdit: (_id: string, title: string, content: string) => void;
  HandleDelete: (_id: string) => Promise<boolean>;
}) {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const backgroundColor = useMemo(() => {
    return Math.floor(Math.random() * 3) + 1 !== 1
      ? "bg-[#ffcb6f]"
      : "bg-[#ff9271]";
  }, []);

  return (
    <div
      className={`flex flex-col h-52 p-3 md:p-4 rounded-xl shadow-black shadow-md shake gap-2 ${backgroundColor}`}
    >
      <div className="flex-1">
        <p className="font-bold whitespace-nowrap overflow-hidden">{title}</p>
        <p className="h-28 overflow-auto hidden-scrollbar text-sm text-gray-800 font-semibold">
          {content}
        </p>
      </div>
      <footer className="flex justify-between items-center">
        <p className="text-sm text-gray-600">14/11/2024</p>
        <div className="flex gap-1 items-center">
          {loadingDelete ? (
            <MoonLoader size={12} className="mt-1 mr-1.5" />
          ) : (
            <BsFillTrash2Fill
              onClick={async () => {
                setLoadingDelete(true);
                const deleted = await HandleDelete(_id);
                if (!deleted) setLoadingDelete(false);
              }}
              className="text-gray-600 cursor-pointer p-1 mt-1 hover:scale-105 duration-200"
              size={23}
            />
          )}

          <GrFormEdit
            onClick={() => HandleOpenEdit(_id, title, content)}
            className="cursor-pointer p-1 bg-white rounded-full shadow-md hover:scale-105 duration-200"
            size={30}
          />
        </div>
      </footer>
    </div>
  );
}
