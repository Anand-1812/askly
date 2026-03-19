"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const Pagination = ({
  className,
  total,
  limit,
}: {
  className?: string;
  limit: number;
  total: number;
}) => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = parseInt(page);
  const router = useRouter();
  const pathname = usePathname();

  const isPrevDisabled = currentPage <= 1;
  const isNextDisabled = currentPage >= totalPages;

  const navigate = (newPage: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", `${newPage}`);
    router.push(`${pathname}?${newSearchParams}`);
  };

  const prev = () => {
    if (!isPrevDisabled) navigate(currentPage - 1);
  };

  const next = () => {
    if (!isNextDisabled) navigate(currentPage + 1);
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-3", className)}>
      <button
        onClick={prev}
        disabled={isPrevDisabled}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-all duration-150",
          isPrevDisabled
            ? "cursor-not-allowed border-white/5 text-white/20"
            : "border-white/10 bg-white/[3%] text-white/70 hover:border-white/20 hover:bg-white/[6%] hover:text-white",
        )}
      >
        <IconChevronLeft className="h-4 w-4" />
        <span>Prev</span>
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          let pageNum: number;

          if (totalPages <= 5) {
            pageNum = i + 1;
          } else if (currentPage <= 3) {
            pageNum = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
          } else {
            pageNum = currentPage - 2 + i;
          }

          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => navigate(pageNum)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-orange-500 text-white shadow-[0_0_16px_rgba(249,115,22,0.35)]"
                  : "border border-white/8 bg-white/[3%] text-white/50 hover:border-white/15 hover:bg-white/[6%] hover:text-white",
              )}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        onClick={next}
        disabled={isNextDisabled}
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-all duration-150",
          isNextDisabled
            ? "cursor-not-allowed border-white/5 text-white/20"
            : "border-white/10 bg-white/[3%] text-white/70 hover:border-white/20 hover:bg-white/[6%] hover:text-white",
        )}
      >
        <span>Next</span>
        <IconChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
