import { cookies } from "next/headers";
import Table from "./Table";

async function Page() {
  const res = await fetch(`${process.env.URL}/api/matrixtask`, {
    cache: "no-cache",
    headers: {
      cookie: cookies().toString(),
    },
  });
  if (!res.ok) return <div>Something went wrong</div>;
  const { matrixTasks } = await res.json();

  return <Table tasks={matrixTasks} />;
}

export default Page;
