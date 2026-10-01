export const customer = {
  activity: {
    title: "My Activity",
    description: "A quick look at your shipments. Pay for pending ones to get them moving.",
  },
  parcels: { title: "My Parcels", description: "Every parcel you've sent." },
  stats: {
    total: "Total parcels",
    pending: "Pending",
    pendingHint: "Not yet picked up",
    delivered: "Delivered",
  },
  latest: {
    title: "Latest parcels",
    description: "Your five most recent shipments.",
    /** {n} parcels. */
    awaitingPayment: "{n} waiting for payment.",
    emptyTitle: "You haven't sent a parcel yet",
    emptyDescription: "Book your first parcel and track it from here.",
    sendParcel: "Send a parcel",
    /** {name} receiver, {date} booking date. */
    to: "To {name} · {date}",
    viewAll: "View all parcels",
  },
  table: {
    tracking: "Tracking #",
    receiver: "Receiver",
    route: "Route",
    status: "Status",
    booked: "Booked",
    fee: "Fee",
    actions: "Actions",
    empty: "No parcels yet.",
    emptyDescription: "Try changing the search or status filter, or book a new parcel.",
  },
};
