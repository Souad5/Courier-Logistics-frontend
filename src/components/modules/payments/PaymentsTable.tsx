"use client";

import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useMyParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";

/**
 * Customer view: payments history derived from parcels.
 * Shows all parcels with payment status info.
 * Must render inside <Suspense>.
 */
export function PaymentsTable() {
  const { data, isLoading, error } = useMyParcels({ limit: 1000 });

  // Filter parcels that have payments
  const payments = (data?.data.parcels ?? []).filter((p) => p.payment);

  const columns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Parcel",
      cell: (p) => (
        <div>
          <div className="font-mono text-xs font-semibold">{p.trackingNumber}</div>
          <div className="text-muted-foreground text-xs">{p.receiverName}</div>
        </div>
      ),
    },
    { key: "fee", header: "Amount", cell: (p) => formatCurrency(p.fee, p.currency) },
    {
      key: "paymentStatus",
      header: "Payment Status",
      cell: (p) => <StatusBadge status={p.payment?.status as any} />,
    },
    {
      key: "paidAt",
      header: "Paid At",
      cell: (p) => p.payment?.paidAt ? formatDate(p.payment.paidAt, true) : "—",
    },
    { key: "created", header: "Created", cell: (p) => formatDate(p.createdAt) },
  ];

  if (error) return <p className="text-destructive text-sm">{getErrorMessage(error)}</p>;

  return (
    <DataTable
      columns={columns}
      data={payments}
      getRowId={(p) => p.id}
      loading={isLoading}
      emptyMessage="No payments yet."
    />
  );
}
