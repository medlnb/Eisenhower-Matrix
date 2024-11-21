import Member from "@models/member";
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

    const { matrixTasks } = await Member.findOne({
      email: session.user.email,
    }).select("matrixTasks");

    return new Response(JSON.stringify({ matrixTasks }), {
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
    const session = await getServerSession();
    if (!session || !session.user)
      return new Response(JSON.stringify({ err: "You need to be logged in" }), {
        status: 401,
      });

    const user = await Member.findOne({ email: session.user.email }).select(
      "matrixTasks"
    );

    if (!user)
      return new Response(JSON.stringify({ err: "You need to be a member" }), {
        status: 401,
      });

    const { container, title, content } = await req.json();
    user.matrixTasks.push({ container, title, content });
    await user.save();

    const newTask = user.matrixTasks[user.matrixTasks.length - 1];

    return new Response(JSON.stringify({ newTask }), {
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
    const session = await getServerSession();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ err: "You need to be logged in" }), {
        status: 401,
      });
    }

    const user = await Member.findOne({ email: session.user.email }).select(
      "matrixTasks"
    );

    if (!user) {
      return new Response(JSON.stringify({ err: "You need to be a member" }), {
        status: 401,
      });
    }

    const {
      tracker,
    }: {
      tracker: {
        _id: string;
        from: string;
        to: string;
      }[];
    } = await req.json();

    user.matrixTasks = user.matrixTasks.map(
      (task: { _id: string; container: string }) => {
        const exist = tracker.find(
          (track) => track._id === task._id.toString()
        );
        if (exist) task.container = exist.to;
        return task;
      }
    );
    await user.save();

    return new Response(JSON.stringify({ newMatrixs: user.matrixTasks }), {
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
    const session = await getServerSession();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ err: "You need to be logged in" }), {
        status: 401,
      });
    }

    const user = await Member.findOne({ email: session.user.email }).select(
      "matrixTasks"
    );

    if (!user) {
      return new Response(JSON.stringify({ err: "You need to be a member" }), {
        status: 401,
      });
    }

    const { id } = await req.json();

    user.matrixTasks = user.matrixTasks.filter(
      (task: { _id: string }) => task._id.toString() !== id
    );

    await user.save();

    return new Response(JSON.stringify({ newMatrixs: user.matrixTasks }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: "Something went wrong" }), {
      status: 500,
    });
  }
};
