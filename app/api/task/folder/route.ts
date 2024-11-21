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

    const user = await Member.findOne({
      email: session.user.email,
    }).select("_id folders");

    const folders = user.folders;
    // data: {
    //   title: string;
    //   tasks: TaskType[];
    // }[];
    const data: {
      title: string;
      tasks: { _id: string; title: string; checked: boolean }[];
    }[] = folders.map((fld: string) => ({
      title: fld,
      tasks: [],
    }));

    const tasks = await Task.find({
      owner: user._id,
      folder: { $in: folders },
    }).sort({ createdAt: -1 });

    tasks.forEach((task) => {
      const folderIndex = data.findIndex((fld) => fld.title === task.folder);
      data[folderIndex].tasks.push({
        _id: task._id,
        title: task.title,
        checked: task.checked,
      });
    });

    return new Response(JSON.stringify({ data }), {
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
      "_id folders"
    );

    if (!user)
      return new Response(JSON.stringify({ err: "You need to be a member" }), {
        status: 401,
      });

    const { folder } = await req.json();

    if (!folder)
      return new Response(JSON.stringify({ err: "Folder name is required" }), {
        status: 400,
      });

    if (user.folders.includes(folder))
      return new Response(JSON.stringify({ err: "Folder already exists" }), {
        status: 400,
      });
    user.folders.push(folder);
    await user.save();

    return new Response(JSON.stringify({ folder }), {
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
      "_id folders"
    );

    if (!user)
      return new Response(JSON.stringify({ err: "You need to be a member" }), {
        status: 401,
      });

    const { folder } = await req.json();
    user.folders = user.folders.filter((fld: string) => fld !== folder);
    await user.save();
    const task = await Task.deleteMany({
      folder,
      owner: user._id,
    });

    return new Response(JSON.stringify({ deletedCount: task.deletedCount }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: "Something went wrong" }), {
      status: 500,
    });
  }
};
