import Product from "@models/product";
import { connectToDatabase } from "@utils/database";
import { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params: { id } }: { params: { id?: string } }
) => {
  try {
    await connectToDatabase();
    if (!id || !isValidObjectId(id))
      return new Response(JSON.stringify({ err: "Invalid ID" }), {
        status: 400,
      });

    const product = await Product.findById(id);

    return new Response(JSON.stringify({ product }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), {
      status: 500,
    });
  }
};
