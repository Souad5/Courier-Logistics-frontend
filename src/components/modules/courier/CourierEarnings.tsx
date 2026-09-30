"use client";

import { useMemo } from "react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyParcels } from "@/hooks/useParcels";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Parcel } from "@/types";
import { DollarSign, TrendingUp, Zap } from "lucide-react";

/**
 * Courier view: earnings summary and breakdown.
 * Calculates from DELIVERED parcels only.
 */
export function CourierEarnings() {
  const { data, isLoading, error } = useMyParcels({ limit: 1000 });

  const earnings = useMemo(() => {
    const parcels = data?.data.parcels ?? [];
    const delivered = parcels.filter((p) => p.status === "DELIVERED");

    const totalEarnings = delivered.reduce((sum, p) => sum + Number(p.fee), 0);
    const avgEarning = delivered.length > 0 ? totalEarnings / delivered.length : 0;
    const completedCount = delivered.length;

    return {
      totalEarnings,
      avgEarning,
      completedCount,
      delivered,
    };
  }, [data]);

  const deliveredColumns: DataTableColumn<Parcel>[] = [
    {
      key: "tracking",
      header: "Tracking #",
      cell: (p) => <span className="font-mono text-xs">{p.trackingNumber}</span>,
    },
    { key: "receiver", header: "Receiver", cell: (p) => p.receiverName },
    { key: "fee", header: "Earnings", cell: (p) => formatCurrency(p.fee, p.currency) },
    { key: "delivered", header: "Delivered", cell: (p) => formatDate(p.deliveredAt!) },
  ];

  if (error) {
    return (
      <Card>
        <CardContent className="text-destructive py-8 text-center text-sm">
          {getErrorMessage(error)}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Earnings"
          value={formatCurrency(earnings.totalEarnings)}
          icon={DollarSign}
          loading={isLoading}
        />
        <StatCard
          title="Completed Deliveries"
          value={earnings.completedCount}
          icon={Zap}
          loading={isLoading}
        />
        <StatCard
          title="Average per Delivery"
          value={formatCurrency(earnings.avgEarning)}
          icon={TrendingUp}
          loading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivered Parcels</CardTitle>
          <CardDescription>All parcels you've successfully delivered and earned from.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <DataTable
              columns={deliveredColumns}
              data={earnings.delivered}
              getRowId={(p) => p.id}
              loading={false}
              emptyMessage="No completed deliveries yet."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
