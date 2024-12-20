import Product from "@models/product";
import { connectToDatabase } from "@utils/database";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const p = Number(params.get("p") ?? 1);
    const perPage = 8;

    const count = await Product.countDocuments();
    const products = await Product.find()
      .sort({ updatedAt: -1 })
      .skip((p - 1) * perPage)
      .limit(perPage);

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

    interface QueriesProps {
      p?: string;
      min?: number;
      max?: number;
      category?: string;
    }

    const { p, min, max, category }: QueriesProps = await req.json();
    const page = Number(p) || 1;
    const perPage = 6;

    const query =
      !min && !max && !category
        ? {}
        : {
            "variances.price": {
              $gte: min ?? 0,
              $lte: max ?? 10000,
            },
            "category.aisle": category ?? "",
          };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select("title variances brand images createdAt");

    const rearanged = products.map((product) => {
      const { _id, title, variances, brand, images, createdAt } = product;
      const price = variances.reduce((acc: number, curr: { price: number }) => {
        if (curr.price < acc) return curr.price;
        return acc;
      }, variances[0].price);

      return {
        _id,
        title,
        brand,
        price,
        image: images[0],
        createdAt,
      };
    });

    return new Response(JSON.stringify({ count, products: rearanged }), {
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify(err), {
      status: 500,
    });
  }
};
