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
            ? "cursor-not-allowed border-border/60 text-muted-foreground/50"
            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
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
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "border border-border bg-card text-muted-foreground hover:border-primary/35 hover:text-primary",
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
            ? "cursor-not-allowed border-border/60 text-muted-foreground/50"
            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
        )}
      >
        <span>Next</span>
        <IconChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
