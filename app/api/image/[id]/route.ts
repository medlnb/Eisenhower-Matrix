import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";
import Image from "@models/image";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    connectToDatabase();
    const imageId = params.id;
    const image = await Image.findById(imageId);
    return new Response(JSON.stringify({ ...image._doc }), { status: 201 });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ err }), { status: 500 });
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
    console.log(params);
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
