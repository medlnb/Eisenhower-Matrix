import Member from "@models/member";
import Task from "@models/task";
import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = async () => {
  try {
    await connectToDatabase();
    const session = await getServerSession();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ err: "You need to be logged in" }), {
        status: 401,
      });
    }
    // const url = new URL(req.url);
    // const params = new URLSearchParams(url.searchParams);
    // const p = Number(params.get("p") ?? 1);
    // const perPage = 6;

    const user = await Member.findOne({
      email: session.user.email,
    }).select("_id");

    const count = await Task.countDocuments();
    const data = await Task.find({
      owner: user._id,
      folder: undefined,
    }).sort({ updatedAt: -1 });

    const { all, daily } = {
      all: data.filter((task) => !task.checkedDaily),
      daily: data
        .filter((task) => task.checkedDaily)
        .map((task) => ({
          ...task._doc,
          checked:
            task.checkedDaily.toDateString() === new Date().toDateString(),
        })),
    };
    // console.log(all, daily);

    return new Response(JSON.stringify({ all, daily, count }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: "Something went wrong" }), {
      status: 500,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const session = await getServerSession();
    if (!session || !session.user)
      return new Response(JSON.stringify({ err: "You need to be logged in" }), {
        status: 401,
      });

    const user = await Member.findOne({ email: session.user.email }).select(
      "_id"
    );

    if (!user)
      return new Response(JSON.stringify({ err: "You need to be a member" }), {
        status: 401,
      });

    const { title, isDaily, folder } = await req.json();
    const task: {
      title: string;
      owner: string;
      checked?: boolean;
      checkedDaily?: Date;
      folder?: string;
    } = { title, owner: user._id };
    if (isDaily) task.checkedDaily = new Date("1900-01-01");
    else task.checked = false;
    if (folder) task.folder = folder;

    const newTask = await Task.create(task);

    return new Response(JSON.stringify({ _id: newTask._id }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: "Something went wrong" }), {
      status: 500,
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const session = await getServerSession();
    if (!session || !session.user)
      return new Response(JSON.stringify({ err: "You need to be logged in" }), {
        status: 401,
      });

    const user = await Member.findOne({ email: session.user.email }).select(
      "_id"
    );

    if (!user)
      return new Response(JSON.stringify({ err: "You need to be a member" }), {
        status: 401,
      });

    const { _id } = await req.json();

    const task = await Task.findById(_id);

    if (!task)
      return new Response(JSON.stringify({ err: "Note not found" }), {
        status: 404,
      });

    if (task.owner.toString() !== user._id.toString())
      return new Response(JSON.stringify({ err: "You are not the owner" }), {
        status: 401,
      });
    // console.log(task);
    const isSameDay = (date1: Date, date2: Date) =>
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();

    let isChecked = false;
    let isDaily = true;
    if (task.checkedDaily) {
      const originalDate = task.checkedDaily;
      const isCheckedToday = isSameDay(originalDate, new Date());
      task.checkedDaily = isCheckedToday ? new Date("1900-01-01") : new Date();
      isChecked = !isCheckedToday;
    } else {
      isDaily = false;
      task.checked = !task.checked;
      isChecked = task.checked;
    }
    await task.save();

    return new Response(JSON.stringify({ isChecked, isDaily }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: "Something went wrong" }), {
      status: 500,
    });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const session = await getServerSession();
    if (!session || !session.user)
      return new Response(JSON.stringify({ err: "You need to be logged in" }), {
        status: 401,
      });

    const user = await Member.findOne({ email: session.user.email }).select(
      "_id"
    );

    if (!user)
      return new Response(JSON.stringify({ err: "You need to be a member" }), {
        status: 401,
      });

    const { _id } = await req.json();
    const task = await Task.findById(_id);

    if (!task)
      return new Response(JSON.stringify({ err: "Task not found" }), {
        status: 404,
      });

    if (task.owner.toString() !== user._id.toString())
      return new Response(JSON.stringify({ err: "You are not the owner" }), {
        status: 401,
      });

    await Task.findByIdAndDelete(_id);

    return new Response(JSON.stringify({ _id }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: "Something went wrong" }), {
      status: 500,
    });
  }
};
