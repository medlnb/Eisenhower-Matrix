"use client";
import { DialogActions } from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Button } from "@mui/joy";
// import EmptyState from "@components/EmptyState";
import { FiCheckSquare } from "react-icons/fi";
import { LuTimerReset } from "react-icons/lu";
import TasksContainer from "@components/TasksContainer";
import { MoonLoader } from "react-spinners";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import "swiper/css";
import { toast } from "sonner";

interface TaskType {
  _id: string;
  title: string;
  checked: boolean;
}

function Page() {
  const [folders, setFolders] = useState<{
    data: {
      title: string;
      tasks: TaskType[];
    }[];
    loading: boolean;
  }>({
    data: [],
    loading: true,
  });

  const [newFolder, setNewFolder] = useState({
    folder: "",
    loading: false,
  });

  const [dialog, setDialog] = useState(false);

  const [newTask, setNewTask] = useState<{
    _id?: string;
    title: string;
    folder?: string;
    checkedDaily?: Date;
    isDaily?: boolean;
    loading?: boolean;
  } | null>();

  const [tasks, setTasks] = useState<{
    data: {
      daily: TaskType[];
      all: TaskType[];
    };
    count: number;
    loading: boolean;
  }>({
    data: { daily: [], all: [] },
    count: 1,
    loading: true,
  });

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch(`/api/task`);
      if (!res.ok)
        return setTasks({
          data: { daily: [], all: [] },
          count: -1,
          loading: false,
        });
      const { all, daily, count } = await res.json();
      setTasks({ data: { all, daily }, count, loading: false });

      const response = await fetch(`/api/task/folder`);
      if (!response.ok) return;
      const { data } = await response.json();
      setFolders({ data, loading: false });
    };
    fetchNotes();
  }, []);

  const HandleAdd = async () => {
    if (!newTask || !newTask.title) return;
    setNewTask((prev) => ({ ...prev!, loading: true }));
    const res = await fetch(`/api/task`, {
      method: "POST",
      body: JSON.stringify(newTask),
    });
    if (!res.ok) return setNewTask((prev) => ({ ...prev!, loading: false }));

    const { _id } = await res.json();

    if (newTask.folder) {
      setFolders((prev) => ({
        data: prev.data.map((fld) => {
          if (fld.title === newTask.folder)
            return {
              title: fld.title,
              tasks: [
                { _id, title: newTask.title, checked: false },
                ...fld.tasks,
              ],
            };
          return fld;
        }),
        loading: false,
      }));
      setTasks((prev) => ({
        ...prev,
        count: prev.count + 1,
      }));
    } else
      setTasks((prev) => ({
        data: newTask?.isDaily
          ? {
              daily: [
                {
                  _id,
                  title: newTask.title,
                  checked: false,
                },
                ...prev.data.daily,
              ],
              all: prev.data.all,
            }
          : {
              daily: prev.data.daily,
              all: [
                {
                  _id,
                  title: newTask.title,
                  checked: false,
                },
                ...prev.data.all,
              ],
            },
        count: prev.count + 1,
        loading: false,
      }));

    setDialog(false);
  };

  const HandleAddFolder = async () => {
    if (!newFolder.folder || newFolder.loading) return;
    setNewFolder((prev) => ({ ...prev, loading: true }));
    const res = await fetch(`/api/task/folder`, {
      method: "POST",
      body: JSON.stringify({ folder: newFolder.folder }),
    });
    if (!res.ok) {
      const { err } = await res.json();
      toast.error(err);
      return setNewFolder((prev) => ({ ...prev, loading: false }));
    }
    setFolders((prev) => ({
      data: [{ title: newFolder.folder, tasks: [] }, ...prev.data],
      loading: false,
    }));
    setNewFolder({
      folder: "",
      loading: false,
    });
  };

  const HandleCheck = async (_id: string, folder?: string) => {
    const res = await fetch(`/api/task`, {
      method: "PATCH",
      body: JSON.stringify({ _id }),
    });
    if (!res.ok) return false;
    const { isChecked, isDaily } = await res.json();

    if (folder) {
      setFolders((prev) => ({
        data: prev.data.map((fld) => {
          if (fld.title === folder)
            return {
              title: fld.title,
              tasks: fld.tasks.map((task) =>
                task._id === _id ? { ...task, checked: isChecked } : task
              ),
            };
          return fld;
        }),
        loading: false,
      }));
      return true;
    }
    setTasks((prev) => ({
      data: {
        daily: isDaily
          ? prev.data.daily.map((task) =>
              task._id === _id ? { ...task, checked: isChecked } : task
            )
          : prev.data.daily,
        all: isDaily
          ? prev.data.all
          : prev.data.all.map((task) =>
              task._id === _id ? { ...task, checked: isChecked } : task
            ),
      },
      count: prev.count,
      loading: false,
    }));
    return true;
  };

  const HandleOpenAdd = ({
    isDaily,
    folder,
  }: {
    isDaily?: boolean;
    folder?: string;
  }) => {
    setNewTask({
      title: "",
      isDaily,
      folder,
      loading: false,
    });
    setDialog(true);
  };

  const HandleDelete = async ({
    _id,
    folder,
    isDaily,
  }: {
    _id: string;
    folder?: string;
    isDaily?: boolean;
  }) => {
    const res = await fetch(`/api/task`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/Json",
      },
      body: JSON.stringify({ _id }),
    });
    if (!res.ok) return;

    if (folder) {
      setFolders((prev) => ({
        data: prev.data.map((fld) => ({
          title: fld.title,
          tasks: fld.tasks.filter((task) => task._id !== _id),
        })),
        loading: false,
      }));
      setTasks((prev) => ({
        ...prev,
        count: prev.count - 1,
      }));
    } else
      setTasks((prev) => ({
        data: {
          daily: isDaily
            ? prev.data.daily.filter((task) => task._id !== _id)
            : prev.data.daily,
          all: isDaily
            ? prev.data.all
            : prev.data.all.filter((task) => task._id !== _id),
        },
        count: prev.count - 1,
        loading: false,
      }));
  };

  const HandleDeleteFolder = async (folder: string) => {
    const res = await fetch(`/api/task/folder`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/Json",
      },
      body: JSON.stringify({ folder }),
    });
    if (!res.ok) return;
    const { deletedCount } = await res.json();
    setFolders((prev) => ({
      data: prev.data.filter((fld) => fld.title !== folder && fld.tasks),
      loading: false,
    }));
    setTasks((prev) => ({
      ...prev,
      count: prev.count - deletedCount,
    }));
  };

  return (
    <>
      <section className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 my-3 text-white">
        <div
          className="flex bg-primary-2 py-2 px-2 md:px-4 rounded-xl gap-3 hover:scale-105 duration-200 cursor-pointer shadow-black shadow-md"
          onClick={() => HandleOpenAdd({})}
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

        <div
          className="flex bg-primary-2 py-2 px-2 md:px-4 rounded-xl gap-3 hover:scale-105 duration-200 cursor-pointer shadow-black shadow-md"
          onClick={() => HandleOpenAdd({ isDaily: true })}
        >
          <LuTimerReset size={40} className="p-2 bg-secondary-2 rounded-full" />

          <div>
            <div className="flex items-center gap-1 ">
              <IoMdAdd className="text-gray-400 border rounded-md" />
              <p className="text-gray-400 text-xs">New daily Task</p>
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
          <p className="text-gray-400 text-sm">• {tasks.count} Task</p>
        </div>
      </section>

      <main>
        <TasksContainer
          title="All Tasks"
          list={tasks.data.all}
          HandleCheck={HandleCheck}
          HandleDelete={HandleDelete}
          loadingData={tasks.loading}
        />
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={8}
          slidesPerView={1.2}
          breakpoints={{
            700: {
              slidesPerView: 3,
            },
          }}
        >
          <SwiperSlide>
            <TasksContainer
              title="Daily Tasks"
              list={tasks.data.daily}
              HandleCheck={HandleCheck}
              HandleDelete={HandleDelete}
              loadingData={tasks.loading}
            />
          </SwiperSlide>

          {folders.loading ? (
            <SwiperSlide>
              <div className="h-72 p-4 bg-white rounded-xl loading--background"></div>
            </SwiperSlide>
          ) : (
            folders.data.map((fld) => (
              <SwiperSlide key={fld.title}>
                <TasksContainer
                  title={fld.title}
                  list={fld.tasks}
                  HandleCheck={HandleCheck}
                  HandleDelete={HandleDelete}
                  isFolder={{
                    HandleOpenAdd,
                    HandleDeleteFolder,
                  }}
                />
              </SwiperSlide>
            ))
          )}

          <SwiperSlide>
            <div className="h-72 flex flex-col justify-center items-center text-center gap-2">
              {newFolder.loading ? (
                <MoonLoader color="white" className="mb-2" />
              ) : (
                <IoMdAdd
                  className=" text-8xl text-primary-2 hover:text-white hover:scale-105 cursor-pointer duration-200"
                  onClick={HandleAddFolder}
                />
              )}
              <input
                value={newFolder.folder}
                disabled={newFolder.loading}
                onChange={(e) =>
                  setNewFolder({ folder: e.target.value, loading: false })
                }
                type="text"
                placeholder="New Folder"
                className="p-2 border border-[#282a35] bg-primary-2 rounded-xl w-1/2 focus:outline-none text-white text-center"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </main>

      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "10px",
            backgroundColor: "#171731",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <b className="text-white">
            {newTask?.folder
              ? "Add Task to " + newTask?.folder
              : newTask?.isDaily
              ? "Add Daily Task"
              : "Add New Task"}
          </b>
        </DialogTitle>
        <DialogContent>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border border-[#282a35] rounded-md"
            value={newTask?.title}
            disabled={newTask?.loading}
            onChange={(e) =>
              setNewTask((prev) => ({
                ...prev!,
                title: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button color="neutral" onClick={() => setDialog(false)}>
            Cancel
          </Button>
          <Button
            loading={newTask?.loading}
            onClick={HandleAdd}
            disabled={!newTask?.title || newTask?.loading}
            sx={{
              backgroundColor: "#ffad72",
              "&:hover": {
                backgroundColor: "#ff9271",
              },
            }}
          >
            {newTask?._id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Page;
