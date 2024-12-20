import LoadImage from "@components/LoadImage";
import { cookies } from "next/headers";
import Delete from "./Delete";
import Pagin from "@components/Pagin";
import { AiTwotoneEdit } from "react-icons/ai";
import Link from "next/link";

async function Table({ page }: { page: number }) {
  const res = await fetch(`${process.env.URL}/api/admin/product?p=${page}`, {
    headers: {
      Cookie: cookies().toString(),
    },
  });
  if (!res.ok) return <p className="text-red-500"> Error fetching data</p>;
  const { count, products } = await res.json();

  return (
    <div className="max-w-[50rem] mx-auto">
      <div className="flex justify-between items-center my-4">
        <h1 className="text-xl font-bold text-center">Manage Products</h1>
        <Pagin page={page} count={count} perpage={8} href="manageproducts" />
      </div>
      <table className="bg-white shadow-md rounded-lg w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-sm font-semibold"></th>
            <th className="p-4 text-sm font-semibold text-center">Product</th>
            <th className="p-4 hidden md:table-cell text-sm font-semibold text-center">
              Brand
            </th>
            <th className="p-4 text-sm font-semibold text-center">Stock</th>
            <th className="p-4 text-sm font-semibold text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(
            (product: {
              _id: string;
              title: string;
              brand: string;
              image: string;
              stock: number;
            }) => (
              <tr key={product._id} className="text-center border-t relative">
                <td>
                  <div className="flex justify-center">
                    <Link href={`/manageproducts/product?id=${product._id}`}>
                      <AiTwotoneEdit
                        className="border p-1 rounded-full cursor-pointer hover:bg-gray-200 duration-150"
                        size={25}
                      />
                    </Link>
                  </div>
                </td>
                <td>
                  <div className="flex items-center justify-center gap-2">
                    <LoadImage
                      Css="w-20 p-2 h-20 object-contain"
                      Url={product.image}
                    />
                    <p className="text-sm">{product.title}</p>
                  </div>
                </td>
                <td className="hidden md:table-cell text-sm">
                  {product.brand}
                </td>
                <td className="text-sm">{product.stock}</td>
                <td>
                  <Delete productId={product._id} />
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
