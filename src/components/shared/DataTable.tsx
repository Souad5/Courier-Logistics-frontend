"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/types";

import { AppButton } from "./AppButton";
import { EmptyState } from "./EmptyState";
import { AppSelect } from "./form";

const SKELETON_ROWS = ["s1", "s2", "s3", "s4", "s5"];
const PAGE_SIZES = [10, 20, 50, 100]; // backend caps limit at 100

/** 1 … 4 5 6 … 12 — always the first, last and two neighbours of the current page. */
function pageItems(page: number, totalPages: number): Array<number | "gap-start" | "gap-end"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const start = Math.max(2, Math.min(page - 1, totalPages - 4));
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5));
  return [
    1,
    ...(start > 2 ? (["gap-start"] as const) : []),
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    ...(end < totalPages - 1 ? (["gap-end"] as const) : []),
    totalPages,
  ];
}

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Applied to the header and every cell, so they always line up. Use "right" for money. */
  align?: "left" | "right" | "center";
  className?: string;
}

const ALIGN = { left: "text-left", right: "text-right", center: "text-center" } as const;
// Roomier than the shadcn defaults (p-2) so neighbouring columns never touch.
const CELL_PAD = "px-4 first:pl-5 last:pr-5";

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[] | undefined;
  getRowId: (row: T) => string;
  loading?: boolean;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  /** Shows a rows-per-page picker when given (usePagination's setLimit). */
  onLimitChange?: (limit: number) => void;
  emptyMessage?: string;
  emptyDescription?: string;
  toolbar?: ReactNode;
}

/** Server-paginated table driven by the backend's `meta` block. */
export function DataTable<T>({
  columns,
  data,
  getRowId,
  loading,
  meta,
  onPageChange,
  onLimitChange,
  emptyMessage = "No records found.",
  emptyDescription,
  toolbar,
}: DataTableProps<T>) {
  const rows = data ?? [];

  return (
    <div className="space-y-3">
      {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    "text-muted-foreground h-11 text-sm font-medium",
                    CELL_PAD,
                    ALIGN[column.align ?? "left"],
                    column.className,
                  )}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && rows.length === 0 ? (
              SKELETON_ROWS.map((rowKey) => (
                <TableRow key={rowKey}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn("py-3", CELL_PAD, ALIGN[column.align ?? "left"])}
                    >
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState title={emptyMessage} description={emptyDescription} />
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={getRowId(row)} className={cn(loading && "opacity-60")}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        "py-3",
                        CELL_PAD,
                        ALIGN[column.align ?? "left"],
                        column.className,
                      )}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.total > 0 && (
        <TablePagination
          meta={meta}
          loading={loading}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      )}
    </div>
  );
}

function TablePagination({
  meta,
  loading,
  onPageChange,
  onLimitChange,
}: {
  meta: PaginationMeta;
  loading?: boolean;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}) {
  const { page, limit, total, totalPages } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2">
        <p aria-live="polite">
          Showing <span className="text-foreground font-medium tabular-nums">{from}</span>–
          <span className="text-foreground font-medium tabular-nums">{to}</span> of{" "}
          <span className="text-foreground font-medium tabular-nums">{total}</span>
        </p>
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <AppSelect
              ariaLabel="Rows per page"
              value={String(limit)}
              onValueChange={(value) => onLimitChange(Number(value))}
              options={PAGE_SIZES.map((size) => ({ value: String(size), label: String(size) }))}
              containerClassName="w-20"
            />
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center gap-1">
          <AppButton
            variant="outline"
            disabled={page <= 1 || loading}
            leftIcon={<ChevronLeft />}
            onClick={() => onPageChange?.(page - 1)}
            aria-label="Previous page"
          >
            <span className="hidden sm:inline">Previous</span>
          </AppButton>
          {pageItems(page, totalPages).map((item) =>
            typeof item === "number" ? (
              <AppButton
                key={item}
                variant={item === page ? "default" : "ghost"}
                size="icon"
                className="tabular-nums"
                disabled={loading && item !== page}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Page ${item}`}
                onClick={() => item !== page && onPageChange?.(item)}
              >
                {item}
              </AppButton>
            ) : (
              <span
                key={item}
                aria-hidden
                className="text-muted-foreground grid size-8 place-items-center"
              >
                <MoreHorizontal className="size-4" />
              </span>
            ),
          )}
          <AppButton
            variant="outline"
            disabled={page >= totalPages || loading}
            rightIcon={<ChevronRight />}
            onClick={() => onPageChange?.(page + 1)}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
          </AppButton>
        </nav>
      )}
    </div>
  );
}
