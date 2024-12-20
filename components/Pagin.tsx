"use client";
import { Pagination } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

interface QueriesProps {
  p?: string;
  min?: number;
  max?: number;
  category?: string;
}

function Pagin({
  page,
  count,
  perpage,
  href,
}: {
  page: number;
  count: number;
  perpage: number;
  href: string;
}) {
  const { replace } = useRouter();
  const Url = useSearchParams();
  const params = new URLSearchParams(Url);

  const updateQuery = (p: number) => {
    const updatedQueries = {
      min: params.get("min"),
      max: params.get("max"),
      category: params.get("category"),
      p,
    };

    const queryString = Object.entries(updatedQueries)
      .filter(
        ([_, value]) =>
          value !== undefined &&
          value !== null &&
          value !== 0 &&
          value !== 10000 &&
          value !== "1"
      )
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    replace(`/${href}?${queryString}`);
  };
  return (
    <Pagination
      count={Math.ceil(count / perpage)}
      page={Number(page ?? 1)}
      color="standard"
      onChange={(_, page) => updateQuery(page)}
      size="small"
      sx={{
        "& .MuiPaginationItem-root": {
          color: "gray",
        },
        "& .MuiPaginationItem-root.Mui-selected": {
          color: "white",
          backgroundColor: "gray",
        },
      }}
    />
  );
}

export default Pagin;
