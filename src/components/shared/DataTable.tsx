"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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

const SKELETON_ROWS = ["s1", "s2", "s3", "s4", "s5"];

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[] | undefined;
  getRowId: (row: T) => string;
  loading?: boolean;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
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
  emptyMessage = "No records found.",
  toolbar,
}: DataTableProps<T>) {
  const rows = data ?? [];

  return (
    <div className="space-y-3">
      {toolbar && <div className="flex flex-wrap items-center gap-2">{toolbar}</div>}

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
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
                    <TableCell key={column.key}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={getRowId(row)} className={cn(loading && "opacity-60")}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className={column.className}>
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between gap-2 text-sm">
          <p className="text-muted-foreground">
            Page {meta.page} of {meta.totalPages} · {meta.total} total
          </p>
          <div className="flex gap-2">
            <AppButton
              variant="outline"
              size="sm"
              disabled={meta.page <= 1}
              leftIcon={<ChevronLeft />}
              onClick={() => onPageChange?.(meta.page - 1)}
            >
              Previous
            </AppButton>
            <AppButton
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages}
              rightIcon={<ChevronRight />}
              onClick={() => onPageChange?.(meta.page + 1)}
            >
              Next
            </AppButton>
          </div>
        </div>
      )}
    </div>
  );
}
