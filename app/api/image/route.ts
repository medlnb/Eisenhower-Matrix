import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import Image from "@models/image";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const { image } = await req.json();

    const imageDb = await Image.create({ image });
    return new Response(JSON.stringify({ imageId: imageDb._id }), {
      status: 201,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
