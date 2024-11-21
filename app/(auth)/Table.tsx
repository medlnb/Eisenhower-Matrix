"use client";
import DroppableContainer from "@components/DroppableContainer";
import DroppableTrash from "@components/DroppableTrash";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { PuffLoader, MoonLoader } from "react-spinners";
import { LuSave } from "react-icons/lu";
import { Button } from "@mui/joy";
import { IoMdAdd } from "react-icons/io";
import { FiCheckSquare } from "react-icons/fi";

interface ContainerType {
  container:
    | "ImportUrgant"
    | "ImportNotUrgant"
    | "NotImportUrgant"
    | "NotImportNotUrgant";
}

const containers: ContainerType["container"][] = [
  "ImportUrgant",
  "ImportNotUrgant",
  "NotImportUrgant",
  "NotImportNotUrgant",
];

interface MatrixTask {
  container: ContainerType["container"];
  _id: string;
  title: string;
  content: string;
  loading: boolean;
}

function Table({ tasks }: { tasks: MatrixTask[] }) {
  const [loading, setLoading] = useState(false);
  const [Toggle, setToggle] = useState(false);
  const [draggables, setDraggables] = useState<MatrixTask[]>(tasks);
  const [newMatrixTask, setNewMatrixTask] = useState<{
    container: ContainerType["container"];
    title: string;
    content: string;
    loading: boolean;
  } | null>(null);

  const [tracker, setTracker] = useState<
    {
      _id: string;
      from: string;
      to: string;
    }[]
  >([]);

  const handleDragEnd = async (event: DragEndEvent) => {
    setToggle(false);
    const { over } = event;
    const activeId = event.active.id;
    if (!over || !activeId) return;

    if (over.id === "trash") return HandleDelete(activeId.toString());

    const overId: ContainerType["container"] =
      over.id as ContainerType["container"];

    setDraggables((prev) => {
      return prev.map((draggable) => {
        if (draggable._id === activeId) {
          const from = draggable.container;
          setTracker((prev) => {
            const exist = prev.find((track) => track._id === activeId);
            if (exist && exist.from !== overId)
              return prev.map((track) => {
                if (track._id === activeId) {
                  return { ...track, to: overId };
                } else return track;
              });
            else if (exist && exist.from === overId)
              return prev.filter((track) => track._id !== activeId);
            else if (!exist && draggable.container === overId) return prev;
            else
              return [...prev, { _id: activeId.toString(), from, to: overId }];
          });

          return { ...draggable, container: overId };
        } else return draggable;
      });
    });
  };

  const HandleAdd = async () => {
    if (!newMatrixTask) return;
    setNewMatrixTask((prev) => ({ ...prev!, loading: true }));
    const { container, title, content } = newMatrixTask;
    const res = await fetch("/api/matrixtask", {
      method: "POST",
      body: JSON.stringify({ container, title, content }),
    });
    if (!res.ok)
      return setNewMatrixTask((prev) => ({ ...prev!, loading: false }));

    const { newTask } = await res.json();
    setDraggables((prev) => [...prev, newTask]);
    setNewMatrixTask(null);
  };

  const HandleDelete = async (id: string) => {
    let removedTask: MatrixTask;
    setDraggables((prev) =>
      prev.filter((draggable) => {
        if (draggable._id === id) removedTask = draggable;
        return draggable._id !== id;
      })
    );
    const res = await fetch("/api/matrixtask", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });

    if (!res.ok) return setDraggables((prev) => [...prev, removedTask]);
    setTracker((prev) => prev.filter((track) => track._id !== id));
  };

  const HandleSave = async () => {
    setLoading((prev) => !prev);
    const res = await fetch("/api/matrixtask", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tracker }),
    });
    if (!res.ok) {
      console.log("error");
    } else {
      const { newMatrixs } = await res.json();
      setDraggables(newMatrixs);
      setTracker([]);
    }
    return setLoading((prev) => !prev);
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={() => setToggle(true)}>
      <main className="h-full relative">
        <header className="absolute top-0 z-10">
          <section className=" grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 my-3 text-white">
            <div
              className="flex bg-primary-2 py-2 px-2 md:px-4 rounded-xl gap-3 hover:scale-105 duration-200 cursor-pointer shadow-black shadow-md"
              onClick={() =>
                setNewMatrixTask({
                  container: "ImportUrgant",
                  title: "",
                  content: "",
                  loading: false,
                })
              }
            >
              <FiCheckSquare
                size={40}
                className="p-2 bg-secondary-2 rounded-full"
              />

              <div>
                <div className="flex items-center gap-1 ">
                  <IoMdAdd className="text-gray-400 border rounded-md" />
                  <p className="text-gray-400 text-xs">New Task</p>
                </div>
                <h2 className="font-semibold text-sm whitespace-nowrap">
                  Create a Task
                </h2>
              </div>
            </div>
          </section>
          <section className="flex justify-between items-center mb-2">
            <div className="text-white flex gap-3 items-center">
              <h2>All Tasks</h2>
              <p className="text-gray-400 text-sm">• {tasks.length} Task</p>
            </div>
          </section>
        </header>
        {/* grid grid-cols-2 */}
        <div
          className="flex flex-wrap pt-28 h-full relative overflow-hidden rounded-md"
          style={{ gridAutoRows: "1fr" }}
        >
          {!!tracker.length && (
            <button
              disabled={loading}
              onClick={HandleSave}
              className={`absolute top-1 right-1  p-2 rounded-lg hover:animate-none cursor-pointer hover:bg-secondary-2 duration-200 ${
                loading ? "bg-white" : "animate-pulse bg-gray-400"
              }`}
            >
              {loading ? <PuffLoader size={20} /> : <LuSave size={20} />}
            </button>
          )}

          {containers.map((container) => (
            <DroppableContainer
              key={container}
              tasks={draggables.filter(
                (draggable) => draggable.container === container
              )}
              id={container}
            />
          ))}

          <div className="text-xs md:text-base   text-white absolute top-[calc(50%+3.5rem)] -translate-y-1/2 whitespace-nowrap w-full left-0 flex justify-around">
            <div className="absolute h-0.5 bg-primary-1 top-[calc(50%)] left-0 w-full" />
            <p className="z-10 bg-primary-2 px-2">Urgent</p>
            <p className="z-10 bg-primary-2 px-2">Less Urgent</p>
          </div>

          <div className="text-xs md:text-base text-white absolute top-14 left-1/2 -translate-x-1/2 h-full flex flex-col  w-6 justify-around items-center">
            <p className="rotate-90 whitespace-nowrap z-10 bg-primary-2 px-2">
              Important
            </p>
            <p className="rotate-90 whitespace-nowrap z-10 bg-primary-2 px-2">
              Less Important{" "}
            </p>
            <div className="absolute bg-primary-1 top-14 h-full w-0.5 left-[calc(50%-2px)] " />
          </div>

          <Dialog
            open={!!newMatrixTask}
            onClose={() => setNewMatrixTask(null)}
            aria-labelledby="alert-dialog-title"
          >
            <DialogTitle id="alert-dialog-title">
              Add New Matrix Task
            </DialogTitle>
            <DialogContent>
              <input
                type="text"
                placeholder="Title"
                className="w-full p-2 border border-[#282a35] rounded-md"
                value={newMatrixTask?.title}
                onChange={(e) =>
                  setNewMatrixTask((prev) => ({
                    ...prev!,
                    title: e.target.value,
                  }))
                }
              />
              <textarea
                placeholder="Content"
                className="w-full p-2 border border-[#282a35] rounded-md mt-2"
                value={newMatrixTask?.content}
                onChange={(e) =>
                  setNewMatrixTask((prev) => ({
                    ...prev!,
                    content: e.target.value,
                  }))
                }
              />

              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Import / Urgant", id: "ImportUrgant" },
                  { label: "Import / Less Urgant", id: "ImportNotUrgant" },
                  { label: "Less Import / Urgant", id: "NotImportUrgant" },
                  {
                    label: "Less Import / Less Urgant",
                    id: "NotImportNotUrgant",
                  },
                ].map((container) => (
                  <div
                    key={container.id}
                    className={`p-2 border border-[#282a35] rounded-md cursor-pointer hover:scale-105 duration-300 text-center ${
                      newMatrixTask?.container === container.id
                        ? "bg-secondary-2 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      setNewMatrixTask((prev) => ({
                        ...prev!,
                        container: container.id as ContainerType["container"],
                      }))
                    }
                  >
                    {container.label}
                  </div>
                ))}
              </div>
            </DialogContent>
            <DialogActions>
              <Button color="neutral" onClick={() => setNewMatrixTask(null)}>
                Cancel
              </Button>
              <Button
                loading={newMatrixTask?.loading}
                onClick={HandleAdd}
                disabled={!newMatrixTask?.title || newMatrixTask?.loading}
              >
                {newMatrixTask?.loading ? (
                  <MoonLoader size={15} color="black" />
                ) : (
                  "Add"
                )}
              </Button>
            </DialogActions>
          </Dialog>

          <DroppableTrash isShowen={Toggle} />
        </div>
      </main>
    </DndContext>
  );
}

export default Table;
