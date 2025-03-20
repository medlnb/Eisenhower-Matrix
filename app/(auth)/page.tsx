import { cookies } from "next/headers";
import Table from "./Table"

async function Page() {
  const res = await fetch(`${process.env.URL}/api/matrixtask`, {
    cache: "no-cache",
    headers: {
      cookie: cookies().toString(),
    },
  });
  if (!res.ok) return <p>Something went wrong</p>;
  const { matrixTasks } = await res.json();

  return <Table tasks={matrixTasks} />;
}

export default Page;
