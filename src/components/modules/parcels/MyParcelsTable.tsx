"use client";

import { useEffect, useState } from "react";

import { PayNowButton } from "@/components/modules/payments/PayNowButton";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useMyParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";

/**
 * GET /parcels/my-parcels — the backend scopes it by role (sender for
 * customers, assigned courier for couriers). Must render inside <Suspense>.
 */
export function MyParcelsTable({ showPayAction = false }: { showPayAction?: boolean }) {
  const { query, setPage, setSearch } = usePagination();
  const [search, setSearchInput] = useState(String(query.search ?? ""));
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (debouncedSearch !== (query.search ?? "")) setSearch(debouncedSearch);
  }, [debouncedSearch, query.search, setSearch]);

  const { data, isLoading, isFetching, error } = useMyParcels(query);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Tracking #",
      cell: (p) => <span className="font-mono text-xs">{p.trackingNumber}</span>,
    },
    { key: "receiver", header: "Receiver", cell: (p) => p.receiverName },
    {
      key: "route",
      header: "Route",
      cell: (p) => (
        <span className="text-muted-foreground text-xs">
          {p.originHub?.name ?? "—"} → {p.destinationHub?.name ?? "—"}
        </span>
      ),
    },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { key: "fee", header: "Fee", cell: (p) => formatCurrency(p.fee, p.currency) },
    { key: "created", header: "Booked", cell: (p) => formatDate(p.createdAt) },
  ];

  if (showPayAction) {
    columns.push({
      key: "actions",
      header: "",
      className: "text-right",
      cell: (p) =>
        p.status === "PENDING" && p.payment?.status !== "PAID" ? (
          <PayNowButton parcelId={p.id} />
        ) : null,
    });
  }

  if (error) return <p className="text-destructive text-sm">{getErrorMessage(error)}</p>;

  return (
    <DataTable
      columns={columns}
      data={data?.data.parcels}
      getRowId={(p) => p.id}
      loading={isLoading || isFetching}
      meta={data?.meta}
      onPageChange={setPage}
      emptyMessage="No parcels yet."
      toolbar={
        <Input
          value={search}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search tracking number or receiver…"
          className="max-w-xs"
        />
      }
    />
  );
}
