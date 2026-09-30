import { cn, humanize } from "@/lib/utils";
import type { ParcelStatus, PaymentStatus } from "@/types";

const PARCEL_STATUS_STYLES: Record<ParcelStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  ACCEPTED: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  PICKED_UP: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300",
  IN_TRANSIT: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  OUT_FOR_DELIVERY: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  DELIVERY_FAILED: "bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300",
  DELIVERED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  RETURN_TO_SENDER: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
  RETURNED: "bg-zinc-200 text-zinc-800 dark:bg-zinc-500/20 dark:text-zinc-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDING: PARCEL_STATUS_STYLES.PENDING,
  PAID: PARCEL_STATUS_STYLES.DELIVERED,
  FAILED: PARCEL_STATUS_STYLES.CANCELLED,
  REFUNDED: PARCEL_STATUS_STYLES.RETURNED,
  CANCELED: PARCEL_STATUS_STYLES.RETURNED,
};

type StatusBadgeProps =
  | { kind?: "parcel"; status: ParcelStatus; className?: string }
  | { kind: "payment"; status: PaymentStatus; className?: string };

export function StatusBadge(props: StatusBadgeProps) {
  const style =
    props.kind === "payment"
      ? PAYMENT_STATUS_STYLES[props.status]
      : PARCEL_STATUS_STYLES[props.status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        style,
        props.className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current opacity-70" />
      {humanize(props.status)}
    </span>
  );
}
