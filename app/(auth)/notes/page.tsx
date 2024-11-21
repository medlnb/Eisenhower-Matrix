"use client";
import Note from "@components/Note";
import { DialogActions, Pagination } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaNoteSticky } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { MoonLoader } from "react-spinners";
import { Button } from "@mui/joy";
import EmptyState from "@components/EmptyState";

interface NoteType {
  _id: string;
  title: string;
  content: string;
}

function Page({ searchParams: { p } }: { searchParams: { p?: string } }) {
  const [dialog, setDialog] = useState(false);
  const [newNote, setNewNote] = useState<{
    _id?: string;
    title: string;
    content: string;
    loading?: boolean;
  } | null>();
  const { replace } = useRouter();
  const [notes, setNotes] = useState<{
    data: NoteType[];
    count: number;
    loading: boolean;
  }>({
    data: [],
    count: 1,
    loading: true,
  });
  useEffect(() => {
    setNotes({ data: [], count: 1, loading: true });
    const fetchNotes = async () => {
      const res = await fetch(`/api/note?p=${p}`);
      if (!res.ok) return setNotes({ data: [], count: -1, loading: false });
      const { notes, count } = await res.json();
      setNotes({ data: notes, count, loading: false });
    };
    fetchNotes();
  }, [p]);

  const HandleAdd = async () => {
    setNewNote((prev) => ({ ...prev!, loading: true }));
    const res = await fetch(`/api/note`, {
      method: "POST",
      body: JSON.stringify(newNote),
    });
    if (!res.ok) return setNewNote((prev) => ({ ...prev!, loading: false }));

    const { _id } = await res.json();
    setNotes((prev) => ({
      data: [
        { _id, title: newNote!.title, content: newNote!.content },
        ...prev.data.slice(0, 5),
      ],
      count: prev.count + 1,
      loading: false,
    }));

    setDialog(false);
  };

  const HandleEdit = async () => {
    setNewNote((prev) => ({ ...prev!, loading: true }));
    const res = await fetch(`/api/note`, {
      method: "PATCH",
      body: JSON.stringify(newNote),
    });
    if (!res.ok) return setNewNote((prev) => ({ ...prev!, loading: false }));

    setNotes((prev) => ({
      ...prev,
      data: prev.data.map((note) =>
        note._id === newNote?._id
          ? {
              title: newNote?.title,
              content: newNote?.content,
              _id: newNote?._id,
            }
          : note
      ),
    }));
    setDialog(false);
  };

  const HandleDelete = async (_id: string) => {
    setNewNote((prev) => ({ ...prev!, loading: true }));
    const res = await fetch(`/api/note`, {
      method: "DELETE",
      body: JSON.stringify({ _id }),
    });
    if (!res.ok) return false;
    setNotes((prev) => ({
      data: prev.data.filter((note) => note._id !== _id),
      count: prev.count - 1,
      loading: false,
    }));
    return true;
  };

  const HandleOpenEdit = (_id: string, title: string, content: string) => {
    setNewNote({
      _id,
      title,
      content,
      loading: false,
    });
    setDialog(true);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 my-3 text-white">
        <div
          className="flex bg-primary-2 py-2 px-2 md:px-4 rounded-xl gap-3 hover:scale-105 duration-200 cursor-pointer shadow-black shadow-md"
          onClick={() => {
            setNewNote({
              title: "",
              content: "",
              loading: false,
            });
            setDialog(true);
          }}
        >
          <FaNoteSticky
            size={40}
            className="p-2 bg-secondary-2 rounded-full"
            fill="black"
          />

          <div>
            <div className="flex items-center gap-1 ">
              <IoMdAdd className="text-gray-400 border rounded-md" />
              <p className="text-gray-400 text-xs">New Note</p>
            </div>
            <h2 className="font-semibold text-sm">Take a Note</h2>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className="text-white flex gap-3 items-center">
          <h2>All Notes</h2>
          <p className="text-gray-400 text-sm">• {notes.count} Note</p>
        </div>
        <Pagination
          count={Math.ceil(notes.count / 6)}
          defaultPage={Number(p ?? 1)}
          color="standard"
          onChange={(_, page) => replace(`/notes?p=${page}`)}
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "gray",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              color: "white",
              backgroundColor: "#ffad72",
            },
          }}
        />
      </div>

      {notes.loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <MoonLoader color="#ffad72" />
        </div>
      ) : notes.count ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ">
          {notes.data.map((note) => (
            <Note
              key={note._id}
              HandleOpenEdit={HandleOpenEdit}
              HandleDelete={HandleDelete}
              {...note}
            />
          ))}
        </div>
      ) : (
        <div className="mt-28">
          <EmptyState label="No Notes Found" />
        </div>
      )}

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
          <b className="text-white">{newNote?._id ? "Edit" : "Add New"} Note</b>
        </DialogTitle>
        <DialogContent>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border border-[#282a35] rounded-md"
            value={newNote?.title}
            disabled={newNote?.loading}
            onChange={(e) =>
              setNewNote((prev) => ({
                ...prev!,
                title: e.target.value,
              }))
            }
          />
          <textarea
            placeholder="Content"
            className="w-full p-2 border border-[#282a35] rounded-md mt-2"
            value={newNote?.content}
            disabled={newNote?.loading}
            onChange={(e) =>
              setNewNote((prev) => ({
                ...prev!,
                content: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button color="neutral" onClick={() => setDialog(false)}>
            Cancel
          </Button>
          <Button
            loading={newNote?.loading}
            onClick={newNote?._id ? HandleEdit : HandleAdd}
            disabled={!newNote?.title || newNote?.loading}
            sx={{
              backgroundColor: "#ffad72",
              "&:hover": {
                backgroundColor: "#ff9271",
              },
            }}
          >
            {newNote?._id ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Page;
