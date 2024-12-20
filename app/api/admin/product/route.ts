import Member from "@models/member";
import Product from "@models/product";
import { connectToDatabase } from "@utils/database";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const p = Number(params.get("p") ?? 1);
    const perPage = 8;

    const count = await Product.countDocuments();
    const rawProducts = await Product.find()
      .sort({ updatedAt: -1 })
      .skip((p - 1) * perPage)
      .limit(perPage);

    const products = rawProducts.map((product) => {
      const { _id, title, brand, images, variances } = product;
      return {
        _id,
        title,
        brand,
        image: images[0],
        stock: variances.reduce(
          (acc: number, cur: { stock: number }) => acc + cur.stock,
          0
        ),
      };
    });
    return new Response(JSON.stringify({ count, products }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), {
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
      "admin"
    );
    if (!user || !user.admin)
      return new Response(JSON.stringify({ err: "You need to be a Admin" }), {
        status: 401,
      });

    const {
      id,
      title,
      description,
      brand,
      category,
      images,
      variances,
      ingedients,
    } = await req.json();
    if (id)
      await Product.findByIdAndUpdate(id, {
        title,
        description,
        ingedients,
        brand,
        category,
        images,
        variances,
      });
    else
      await Product.create({
        title,
        ingedients,
        description,
        brand,
        category,
        images,
        variances,
      });

    return new Response(
      JSON.stringify({
        msg: `${title} had been added to ${category.aisle} aisle`,
      }),
      {
        status: 200,
      }
    );
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
      "admin"
    );

    if (!user || !user.admin)
      return new Response(JSON.stringify({ err: "You need to be a Admin" }), {
        status: 401,
      });

    const { productId } = await req.json();
    await Product.findByIdAndDelete(productId);
    return new Response(JSON.stringify({ msg: "Deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ err: "Something went wrong" }), {
      status: 500,
    });
  }
};
