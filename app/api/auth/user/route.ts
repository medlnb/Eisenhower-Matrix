import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../[...nextauth]/options";

export const GET = async () => {
  try {
    await connectToDatabase();
    const session = await getServerSession(options);
    const user = await Member.findById(session?.user._id).select(
      "name phoneNumber address image"
    );

    if (!user)
      return new Response(JSON.stringify({ err: "No User found" }), {
        status: 401,
      });

    return new Response(JSON.stringify({ user }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ err }), {
      status: 500,
    });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const session = await getServerSession(options);
    const user = await Member.findById(session?.user._id).select(
      "name phoneNumber address"
    );
    if (!user || !session)
      return new Response(JSON.stringify({ err: "No User found" }), {
        status: 401,
      });

    const { name, phoneNumber, address, image } = await req.json();
    if (name) user.name = name;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (image) user.image = image;

    await user.save();

    return new Response(JSON.stringify({ user }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ err }), {
      status: 500,
    });
  }
};
