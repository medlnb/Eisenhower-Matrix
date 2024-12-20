"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { CiSearch } from "react-icons/ci";

function SearchBar() {
  const params = useSearchParams();
  const router = useRouter();

  return (
    <div className="flex p-2 items-center gap-1 rounded-full bg-white">
      <CiSearch fill="black" />
      <input
        className="text-sm text-black focus:outline-none"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) =>
          router.push(`?q=${encodeURIComponent(e.target.value)}`)
        }
      />
    </div>
  );
}

export default SearchBar;
