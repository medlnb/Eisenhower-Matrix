import Member from "@models/member";
import Note from "@models/note";
import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const session = await getServerSession();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ err: "You need to be logged in" }), {
        status: 401,
      });
    }
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const p = Number(params.get("p") ?? 1);
    const perPage = 6;

    const user = await Member.findOne({
      email: session.user.email,
    }).select("_id");

    const count = await Note.countDocuments({ owner: user._id });
    const notes = await Note.find({ owner: user._id })
      .sort({ updatedAt: -1 })
      .skip((p - 1) * perPage)
      .limit(perPage);

    return new Response(JSON.stringify({ notes, count }), {
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

    const { title, content } = await req.json();
    const newNote = await Note.create({
      title,
      content,
      owner: user._id,
    });

    return new Response(JSON.stringify({ _id: newNote._id }), {
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

    const { _id, title, content } = await req.json();

    const note = await Note.findById(_id);

    if (!note)
      return new Response(JSON.stringify({ err: "Note not found" }), {
        status: 404,
      });

    if (note.owner.toString() !== user._id.toString())
      return new Response(JSON.stringify({ err: "You are not the owner" }), {
        status: 401,
      });

    note.title = title;
    note.content = content;
    await note.save();

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

    const note = await Note.findById(_id);

    if (!note)
      return new Response(JSON.stringify({ err: "Note not found" }), {
        status: 404,
      });

    if (note.owner.toString() !== user._id.toString())
      return new Response(JSON.stringify({ err: "You are not the owner" }), {
        status: 401,
      });

    await Note.findByIdAndDelete(_id);

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
