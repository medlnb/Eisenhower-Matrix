import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import EmailCode from "@models/emailCode";
import { sendEmail } from "@utils/sendEmail";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { userId, code } = await req.json();
    const validationCode = await EmailCode.findOne({ userId });

    if (!validationCode)
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 400,
      });

    if (validationCode.triesLeft === 0)
      return new Response(JSON.stringify({ error: "No tries left" }), {
        status: 400,
      });

    if (validationCode.code !== code) {
      validationCode.triesLeft -= 1;
      await validationCode.save();
      return new Response(
        JSON.stringify({
          error: `Invalid code, you have ${validationCode.triesLeft} tries left
        `,
        }),
        {
          status: 400,
        }
      );
    }

    const user = await Member.findById(userId);
    user.verified = true;
    await user.save();

    await EmailCode.deleteOne({ userId });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};

//reset email validation code
export const PATCH = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { userId } = await req.json();
    const validationCode = await EmailCode.findOne({ userId });

    if (!validationCode) {
      return new Response(JSON.stringify({ error: "Invalid user" }), {
        status: 400,
      });
    }
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    validationCode.code = newCode;
    validationCode.triesLeft = 3;
    await validationCode.save();

    const { email } = await Member.findById(userId).select("email");
    await sendEmail(email, newCode);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};
