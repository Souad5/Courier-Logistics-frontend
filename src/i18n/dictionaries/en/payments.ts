export const payments = {
  page: {
    title: "Payments",
    description: "What you've paid, what's outstanding, and the payment status of every parcel.",
  },
  summary: {
    totalPaid: "Total paid",
    awaiting: "Awaiting payment",
    paidParcels: "Paid parcels",
    /** {n} is the sample size. */
    sampled: "Across your latest {n} parcels",
    toPayOne: "{n} parcel to pay",
    toPayMany: "{n} parcels to pay",
  },
  table: {
    parcel: "Parcel",
    /** {name} is the receiver. */
    to: "To {name}",
    payment: "Payment",
    notStarted: "Not started",
    paidAt: "Paid at",
    amount: "Amount",
    actions: "Actions",
    searchPlaceholder: "Tracking # or receiver…",
    searchLabel: "Search payments",
    empty: "No payments yet.",
    emptyDescription: "Book a parcel and pay for it — the transaction will show up here.",
  },
  payNow: "Pay now",
  success: {
    metaTitle: "Payment successful",
    title: "Payment received",
    description:
      "Thanks! Your parcel will be marked as paid in a moment, and a courier will be assigned shortly.",
    /** {id} is the Stripe session id. */
    reference: "Ref: {id}",
    viewParcels: "View my parcels",
  },
  cancel: {
    metaTitle: "Payment cancelled",
    title: "Payment cancelled",
    description:
      "No charge was made. Your parcel is saved as pending — you can pay for it any time.",
    back: "Back to my parcels",
  },
};
