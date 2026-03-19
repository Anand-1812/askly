"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconSearch, IconX } from "@tabler/icons-react";

const Search = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = React.useState(searchParams.get("search") || "");

  React.useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (search.trim()) {
      newSearchParams.set("search", search.trim());
    } else {
      newSearchParams.delete("search");
    }
    newSearchParams.delete("page");
    router.push(`${pathname}?${newSearchParams}`);
  };

  const clearSearch = () => {
    setSearch("");
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("search");
    newSearchParams.delete("page");
    router.push(`${pathname}?${newSearchParams}`);
  };

  return (
    <form className="flex w-full items-center gap-3" onSubmit={handleSearch}>
      <div className="relative flex-1">
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search questions by title or content…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 pl-9 pr-9 text-sm shadow-sm"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="flex h-11 shrink-0 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md transition-all duration-150 hover:brightness-95 active:scale-[0.98]"
      >
        <IconSearch className="h-4 w-4" />
        Search
      </button>
    </form>
  );
};

export default Search;
