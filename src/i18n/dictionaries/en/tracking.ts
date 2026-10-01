export const tracking = {
  meta: {
    /** {trackingNumber} is the parcel's tracking number. */
    title: "Track {trackingNumber}",
    description: "Live status and delivery history for your parcel.",
  },
  form: {
    placeholder: "Tracking number, e.g. BCM1A2B3C4D",
    label: "Tracking number",
    submit: "Track",
  },
  result: {
    notFound: "We couldn't find that parcel",
    /** {type}, {from}, {to}, {receiver} */
    summary: "{type} · {from} → {to} · for {receiver}",
    origin: "Origin",
    destination: "Destination",
    booked: "Booked",
    delivered: "Delivered",
    attempts: "Delivery attempts",
    proof: "Proof of delivery",
    history: "History",
    noHistory: "No status updates yet.",
  },
};
