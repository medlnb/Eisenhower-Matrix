import { useDroppable } from "@dnd-kit/core";

function DroppableTrash({ isShowen }: { isShowen: boolean }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "trash",
  });

  return (
    <div
      className={` bottom-1 left-1/2 -translate-x-1/2 absolute flex flex-col items-center justify-center rounded-md flex-1 p-2 bg-secondary-2 shadow-lg w-[30rem] max-w-[50%] duration-200 ${
        isOver ? "opacity-60" : ""
      } ${isShowen ? "opacity-100" : "opacity-0"}`}
      ref={setNodeRef}
    >
      <img
        src="https://i.imgur.com/f6pKuZt.png"
        className={`h-4 ${isOver ? "translate-x-10 duration-200" : ""}`}
      />
      <img src="https://i.imgur.com/WsLbphf.png" className="h-8" />
    </div>
  );
}

export default DroppableTrash;
