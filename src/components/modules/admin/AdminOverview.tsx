"use client";

import {
  Ban,
  Boxes,
  CircleDollarSign,
  PackageCheck,
  RotateCcw,
  Timer,
  TriangleAlert,
  Truck,
  Users,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/useAdmin";
import { getErrorMessage } from "@/lib/api-client";
import { formatCurrency, humanize } from "@/lib/utils";
import { PARCEL_STATUSES } from "@/types";

export function AdminOverview() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    return (
      <Card>
        <CardContent className="text-destructive py-8 text-center text-sm">
          {getErrorMessage(error)}
        </CardContent>
      </Card>
    );
  }

  // Show every status in lifecycle order, including ones with zero parcels.
  const breakdown = PARCEL_STATUSES.map((status) => ({
    status: humanize(status),
    count: stats?.statusBreakdown.find((s) => s.status === status)?.count ?? 0,
  }));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total income"
          value={formatCurrency(stats?.totalIncome ?? 0)}
          icon={CircleDollarSign}
          loading={isLoading}
        />
        <StatCard
          title="Total parcels"
          value={stats?.totalParcels ?? 0}
          icon={Boxes}
          loading={isLoading}
        />
        <StatCard
          title="Customers"
          value={stats?.totalCustomers ?? 0}
          icon={Users}
          loading={isLoading}
        />
        <StatCard
          title="Couriers"
          value={stats?.totalCouriers ?? 0}
          hint={stats ? `${stats.activeCouriers} available now` : undefined}
          icon={Truck}
          loading={isLoading}
        />
        <StatCard
          title="Delivered"
          value={stats?.deliveredParcels ?? 0}
          icon={PackageCheck}
          loading={isLoading}
        />
        <StatCard
          title="Pending"
          value={stats?.pendingParcels ?? 0}
          icon={Timer}
          loading={isLoading}
        />
        <StatCard
          title="Cancelled"
          value={stats?.cancelledParcels ?? 0}
          icon={Ban}
          loading={isLoading}
        />
        <StatCard
          title="Returned"
          value={stats?.returnedParcels ?? 0}
          hint={stats ? `${stats.totalFailedDeliveryAttempts} failed attempts` : undefined}
          icon={stats?.totalFailedDeliveryAttempts ? TriangleAlert : RotateCcw}
          loading={isLoading}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parcels by status</CardTitle>
          <CardDescription>Current distribution across the delivery lifecycle.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-72 w-full" />
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={breakdown} margin={{ left: -16 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="status"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={70}
                    fontSize={12}
                  />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      color: "var(--popover-foreground)",
                    }}
                  />
                  <Bar dataKey="count" name="Parcels" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
