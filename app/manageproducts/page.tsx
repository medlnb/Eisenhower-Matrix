import Table from "./Table";

function Page({ searchParams: { p } }: { searchParams: { p?: number } }) {
  return (
    <main>
      <Table page={p ?? 1} />
    </main>
  );
}

export default Page;
