import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import Image from "@models/image";
import { NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDatabase();
    const imageId = params.id;
    const image = await Image.findById(imageId);

    if (!image) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const base64Data = image.image.split(",")[1];
    const imgBuffer = Buffer.from(base64Data, "base64");

    return new NextResponse(imgBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": imgBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDatabase();

    const imageId = params.id;
    const { image } = await req.json();
    const imageDb = await Image.findById(imageId);
    imageDb.image = image;
    await imageDb.save();
    return new Response(JSON.stringify({ imageId: imageDb._id }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectToDatabase();
    const imageId = params.id;

    const imageDb = await Image.findByIdAndDelete(imageId);
    return new Response(JSON.stringify({ imageId: imageDb._id }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), { status: 501 });
  }
};
