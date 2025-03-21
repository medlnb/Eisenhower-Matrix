import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "../[...nextauth]/options";
import { compareSync, hashSync } from "bcryptjs";

export const GET = async () => {
  try {
    await connectToDatabase();
    const session = await getServerSession(options);
    const user = await Member.findById(session?.user._id).select("name image");

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

    // Prevent updating the guest user
    if (session?.user?._id === "67db3226a8fcdd7efa768373")
      return new Response(
        JSON.stringify({ err: "You can't update the guest user" }),
        {
          status: 403,
        }
      );

    const user = await Member.findById(session?.user._id).select(
      "name image password"
    );
    if (!user || !session)
      return new Response(JSON.stringify({ err: "No User found" }), {
        status: 401,
      });

    const { name, image, newPassword, password } = await req.json();
    if (name) user.name = name;
    if (image) user.image = image;
    if (newPassword) {
      const isMatch = compareSync(password, user.password ?? "");
      if (user.password && !isMatch)
        return new Response(
          JSON.stringify({ password: "Incorrect password" }),
          {
            status: 403,
          }
        );
      const hashedPassword = hashSync(newPassword, 10);
      user.password = hashedPassword;
    }

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
