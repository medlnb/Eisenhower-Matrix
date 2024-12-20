import Filters from "./Filters";
import ProductsTable from "./ProductsTable";

interface QueriesProps {
  p?: string;
  min?: number;
  max?: number;
  category?: string;
}

function Page({ searchParams }: { searchParams: QueriesProps }) {
  const queries = {
    p: searchParams.p,
    min: searchParams.min,
    max: searchParams.max,
    category: searchParams.category,
  };
  return (
    <main className="bg-gray-100 py-2">
      <div className="max-w-[50rem] mx-auto md:flex gap-3">
        <div>
          <Filters queries={queries} />
        </div>
        <ProductsTable queries={queries} />
      </div>
    </main>
  );
}

export default Page;
