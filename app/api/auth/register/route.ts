import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import EmailCode from "@models/emailCode";
import { sendEmail } from "@utils/sendEmail";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { email, password, name } = await req.json();
    const user = await Member.findOne({ email }).select("verified");

    if (user && user.verified)
      return new Response(JSON.stringify({ err: "Email already registered" }), {
        status: 400,
      });

    if (user && !user.verified)
      return new Response(
        JSON.stringify({
          userId: user._id,
          err: "Email already registered and need to be verified",
        }),
        {
          status: 403,
        }
      );

    const firstLetter = name[0].toUpperCase();
    const defaultImage = `https://dummyimage.com/100x100/000/fff&text=${firstLetter}`;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await Member.create({
      email,
      password: hashedPassword,
      name,
      image: defaultImage,
      verified: false,
    });

    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    await EmailCode.create({
      userId: newUser._id,
      code: newCode,
      triesLeft: 3,
    });
    await sendEmail(email, newCode);

    return new Response(JSON.stringify({ userId: newUser._id }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ err }), {
      status: 500,
    });
  }
};
