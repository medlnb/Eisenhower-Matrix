import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import { CiLogin } from "react-icons/ci";

interface props {
  tasks: {
    _id: string;
    container: string;
    title: string;
    content: string;
  }[];
  id:
    | "ImportUrgant"
    | "ImportNotUrgant"
    | "NotImportUrgant"
    | "NotImportNotUrgant";
}

function DroppableContainer({ tasks, id }: props) {
  const [page, setPage] = useState(0);
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-1 h-1/2 w-1/2 p-3 bg-primary-2 relative"
      ref={setNodeRef}
    >
      {tasks.slice(page * 6, (page + 1) * 6).map((note) => (
        <Draggable key={note._id} id={note._id} {...note}></Draggable>
      ))}
      {isOver && (
        <CiLogin
          size={25}
          className="absolute top-1 right-1 rotate-90 text-white duration-200"
        />
      )}
      {tasks.length > 6 && (
        <div className="text-xs absolute right-2 bottom-0 flex items-center gap-4 text-white z-20">
          <button
            className="cursor-pointer"
            onClick={() => {
              if (page === 0) return;
              setPage(page - 1);
            }}
          >
            {"<"}
          </button>
          <p>
            <b>{page + 1}</b>{" "}
            <span className=" text-gray-400">
              / {Math.floor(tasks.length / 6) + 1}
            </span>
          </p>
          <button
            className="cursor-pointer"
            onClick={() => {
              if (page === Math.floor(tasks.length / 6)) return;
              setPage(page + 1);
            }}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}

export default DroppableContainer;

function Draggable({
  id,
  title,
  content,
}: {
  id: string;
  title: string;
  content: string;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};

  return (
    <div
      className={`text-sm md:text-base h-8 overflow-hidden whitespace-nowrap md:h-14 p-2 rounded-md bg-secondary-2 shadow-black shadow-sm  ${
        isDragging ? "z-30 " : ""
      }`}
      ref={setNodeRef}
      style={{ ...style, touchAction: "none" }}
      {...listeners}
      {...attributes}
    >
      <h4 className="font-semibold">{title}</h4>
      <p className="text-xs text-gray-500 font-semibold hidden md:block">
        {content}
      </p>
    </div>
  );
}
