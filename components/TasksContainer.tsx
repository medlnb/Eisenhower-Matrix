import { Checkbox } from "@mui/joy";
import { useState } from "react";
import { BsFillTrash2Fill } from "react-icons/bs";
import { IoMdAdd } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { MoonLoader } from "react-spinners";

interface TaskType {
  _id: string;
  title: string;
  checked?: boolean;
  checkedDaily?: Date;
}

function TasksContainer({
  title,
  list,
  HandleCheck,
  HandleDelete,
  isFolder,
  loadingData,
}: {
  title: string;
  list: TaskType[];
  HandleCheck: (id: string, folder?: string) => Promise<boolean>;
  HandleDelete: ({
    _id,
    folder,
    isDaily,
  }: {
    _id: string;
    folder?: string;
    isDaily?: boolean;
  }) => Promise<void>;

  isFolder?: {
    HandleOpenAdd: ({
      isDaily,
      folder,
    }: {
      isDaily?: boolean;
      folder?: string;
    }) => void;
    HandleDeleteFolder: (folder: string) => Promise<void>;
  };
  loadingData?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const finished = list.filter((task) => task.checked).length;
  return (
    <div
      className={`relative flex flex-col h-72 p-4 rounded-xl shake gap-2 bg-[#ffcb6f] shadow-black shadow-md  ${
        title === "All Tasks" ? "mb-2" : "mb-8"
      }`}
    >
      <div className="absolute top-5 right-4">
        {loading && <MoonLoader size={13} />}
        {openEdit && isFolder && !loading && (
          <BsFillTrash2Fill
            size={13}
            onClick={() => {
              isFolder.HandleDeleteFolder(title);
              setLoading(true);
            }}
          />
        )}
      </div>
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        <div
          className={`${
            title === "All Tasks"
              ? "grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-3"
              : ""
          }`}
        >
          {loadingData && (
            <div className="w-40 loading--background h-4 rounded-xl mt-1" />
          )}

          {list.map((task) => (
            <div key={task._id} className="relative">
              <div className="absolute bg-[#ffce6c] grid place-items-center h-full px-0.5">
                {openEdit ? (
                  <BsFillTrash2Fill
                    onClick={() => {
                      setLoading(true);
                      HandleDelete({
                        _id: task._id,
                        folder: isFolder ? title : undefined,
                        isDaily: !!task.checkedDaily,
                      }).then(() => setLoading(false));
                    }}
                    className="cursor-pointer text-gray-600"
                  />
                ) : (
                  <Checkbox
                    size="sm"
                    variant="outlined"
                    checked={task.checked}
                    onChange={() => {
                      setLoading(true);
                      HandleCheck(task._id, isFolder ? title : undefined).then(
                        () => setLoading(false)
                      );
                    }}
                  />
                )}
              </div>
              <p
                onClick={() => {
                  setLoading(true);
                  HandleCheck(task._id, isFolder ? title : undefined).then(() =>
                    setLoading(false)
                  );
                }}
                className={`pl-6 whitespace-nowrap overflow-auto hidden-scrollbar cursor-pointer  ${
                  task.checked ? "line-through" : ""
                } `}
              >
                {task.title}
              </p>
            </div>
          ))}
        </div>
      </div>
      <footer className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Finished <b>{finished}</b> {" / "} {list.length}
        </p>
        <div className="flex gap-2 items-center">
          {isFolder && (
            <IoMdAdd
              onClick={() => isFolder.HandleOpenAdd({ folder: title })}
              className="mt-0.5 text-gray-600 cursor-pointer hover:scale-110 hover:text-black duration-200"
              size={17}
            />
          )}
          <div
            className="cursor-pointer bg-white rounded-full shadow-md flex items-center p-2 gap-3 relative"
            onClick={() => setOpenEdit((prev) => !prev)}
          >
            <FiEdit
              size={17}
              className={`z-20 ${openEdit ? "" : "text-white"}`}
            />
            <BsFillTrash2Fill
              size={17}
              className={`z-20 ${openEdit ? "text-white" : ""}`}
            />
            <div
              className={`absolute top-1/2 bg-primary-1 -translate-y-1/2 h-9 w-9 rounded-full z-10 duration-200
            ${openEdit ? " -right-0.5" : "right-7"}
              `}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TasksContainer;
