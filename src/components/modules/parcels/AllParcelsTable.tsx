"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { StatusUpdateDialog } from "@/components/modules/parcels/StatusUpdateDialog";
import { AssignParcelDialog } from "@/components/modules/parcels/AssignParcelDialog";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { AppInput } from "@/components/shared/form";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useDebounce } from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { useParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";

/**
 * Admin view: all parcels with assign and status update actions.
 * Must render inside <Suspense>.
 */
export function AllParcelsTable() {
  const { query, setPage, setSearch } = usePagination();
  const [search, setSearchInput] = useState(String(query.search ?? ""));
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    if (debouncedSearch !== (query.search ?? "")) setSearch(debouncedSearch);
  }, [debouncedSearch, query.search, setSearch]);

  const { data, isLoading, isFetching, error } = useParcels(query);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [updateStatusParcel, setUpdateStatusParcel] = useState<Parcel | null>(null);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Tracking #",
      cell: (p) => <span className="font-mono text-xs">{p.trackingNumber}</span>,
    },
    { key: "sender", header: "Sender", cell: (p) => p.sender?.name ?? "—" },
    { key: "receiver", header: "Receiver", cell: (p) => p.receiverName },
    {
      key: "courier",
      header: "Courier",
      cell: (p) => p.courier?.name ?? <span className="text-muted-foreground">Unassigned</span>,
    },
    { key: "status", header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { key: "fee", header: "Fee", cell: (p) => formatCurrency(p.fee, p.currency) },
    { key: "created", header: "Booked", cell: (p) => formatDate(p.createdAt) },
    {
      key: "actions",
      header: "",
      className: "text-right",
      cell: (p) => (
        <div className="flex items-center justify-end gap-2">
          {!p.courierId && (
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={() => setSelectedParcel(p)}
            >
              Assign
            </button>
          )}
          <button
            className="text-xs text-amber-600 hover:underline"
            onClick={() => setUpdateStatusParcel(p)}
          >
            Update
          </button>
        </div>
      ),
    },
  ];

  if (error) return <p className="text-destructive text-sm">{getErrorMessage(error)}</p>;

  return (
    <>
      <DataTable
        columns={columns}
        data={data?.data.parcels}
        getRowId={(p) => p.id}
        loading={isLoading || isFetching}
        meta={data?.meta}
        onPageChange={setPage}
        emptyMessage="No parcels yet."
        toolbar={
          <AppInput
            type="search"
            value={search}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search tracking number or sender…"
            aria-label="Search parcels"
            leftIcon={<Search />}
            containerClassName="w-full max-w-xs"
          />
        }
      />
      {selectedParcel && (
        <AssignParcelDialog
          parcel={selectedParcel}
          onClose={() => setSelectedParcel(null)}
        />
      )}
      {updateStatusParcel && (
        <StatusUpdateDialog
          parcel={updateStatusParcel}
          onClose={() => setUpdateStatusParcel(null)}
        />
      )}
    </>
  );
}
