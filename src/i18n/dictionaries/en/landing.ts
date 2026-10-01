/** Home page, plus content shared across public pages (features, services, FAQs, parcel types). */
export const landing = {
  meta: {
    description:
      "Book, pay for and track parcels online. Transparent zone-based pricing, live tracking and photo proof of delivery.",
  },
  hero: {
    eyebrow: "Courier delivery in Bangladesh",
    title: "Parcels across Bangladesh, tracked to the door.",
    subtitle:
      "Clear zone-based pricing, card checkout, a timestamped status for every step and a photo when it's delivered.",
    sendParcel: "Send a parcel",
    becomeCourier: "Become a courier",
    backdropAlt: "",
  },
  services: {
    eyebrow: "What you can do",
    title: "Three jobs, one platform.",
    description: "Send, track and deliver — each with its own workspace, all on the same network.",
    photoAlts: {
      send: "A customer handing a cardboard parcel to another person",
      track: "A courier in a hi-vis vest delivering a parcel to a front door",
      deliver: "A courier on a scooter with a delivery box riding through the city",
    },
  },
  carry: {
    eyebrow: "What we carry",
    title: "From a single letter to a box of mangoes.",
    description: "Pick the type when you book so the courier knows how to handle it.",
    photoAlt: "A small parcel marked Fragile, handle with care, held in an open hand",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "Follow a parcel from booking to doorstep.",
    description: "Every stage below is a real status in the system, recorded with a timestamp.",
  },
  charges: {
    eyebrow: "Delivery charges",
    title: "Know the price before you book.",
    /** {baseFee} and {perKg} are formatted amounts. */
    description:
      "Base {baseFee} + {perKg} per kg + a surcharge for each hub's zone. The server uses the same formula, so the fee you see is the fee you pay.",
    useCalculator: "Use the calculator",
    fullPricing: "Full pricing",
    /** {zone} is the zone name. */
    caption: "Sending from an {zone} hub to…",
    mobileNote: "Prices in {currency}. Each extra kg adds {perKg}.",
    zone: "Zone",
    deliveryZone: "Delivery zone",
    weight: "{kg} kg",
    extraKg: "Each extra kg",
  },
  coverage: {
    eyebrow: "Coverage",
    title: "Find a hub near you.",
    description: "Every hub in the network, live. Parcels travel between any two of them.",
    photoAlt: "A busy street in Bangladesh with rickshaws, motorbikes and pedestrians",
  },
  audiences: {
    senders: {
      role: "For senders",
      title: "Ship without the guesswork.",
      points: [
        "Book in four short steps",
        "See the exact fee, pay by card",
        "Follow every status change",
        "Photo proof when it's delivered",
      ],
      cta: "Create a free account",
      photoAlt: "The back of a delivery van stacked with parcels ready to go out",
    },
    couriers: {
      role: "For couriers",
      title: "Deliver and keep it simple.",
      points: [
        "A clear list of assigned tasks",
        "Go on or off duty in one tap",
        "Update status from the road",
        "Earnings from every delivered parcel",
      ],
      cta: "Join as a courier",
      photoAlt: "A courier riding a scooter with a delivery box along a city street",
    },
    adminPrompt: "Running the network?",
    adminDemo: "Try the admin demo",
  },
  included: {
    eyebrow: "Included",
    title: "The details that matter after you press pay.",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered.",
  },
  contactStrip: {
    label: "Get in touch",
    email: "Email us",
    message: "Send a message",
    messageDetail: "Questions about a delivery or your account",
    track: "Where's my parcel?",
    trackDetail: "Track it with your tracking number",
  },
  cta: {
    title: "Your next parcel is four steps away.",
    description: "Create a free customer account, or sign up as a courier and start delivering.",
    primary: "Create free account",
    secondary: "Try a demo account",
  },
  tools: {
    label: "Parcel tools",
    track: "Track parcel",
    trackShort: "Track",
    calculate: "Delivery calculator",
    calculateShort: "Calculator",
    trackHint: "Enter the tracking number from your booking — no account needed.",
  },
  calculator: {
    weight: "Weight (kg)",
    /** {max} is the maximum weight. */
    weightError: "Enter 0.1–{max} kg",
    pickupHub: "Pickup hub",
    deliveryHub: "Delivery hub",
    baseFee: "Base fee",
    weightCharge: "Weight charge",
    zoneSurcharges: "Zone surcharges",
    estimatedFee: "Estimated fee",
    hint: "Pick a pickup and delivery hub to see the fee before you book.",
    book: "Book this parcel",
  },
  stats: {
    hubs: "Hubs in the network",
    cities: "Cities served",
    zones: "Delivery zones",
    attempts: "Delivery attempts before return",
  },
  coverageFinder: {
    searchPlaceholder: "Search a city, area or hub…",
    searchLabel: "Search coverage",
    zoneLabel: "Filter by zone",
    allZones: "All zones",
    otherCity: "Other",
    unavailableTitle: "Coverage list unavailable",
    unavailableDescription:
      "We couldn't load the hub list right now. Please try again in a moment.",
    emptyTitle: "No hubs match",
    emptyDescription: "Try another city or area, or clear the zone filter.",
    hubCountOne: "{count} hub",
    hubCountOther: "{count} hubs",
  },
  lifecycle: {
    tablistLabel: "Parcel lifecycle stages",
    /** {actor} is a translated role name. */
    handledBy: "Handled by {actor}",
    stage: "Stage {current} of {total}",
    stages: {
      PENDING: {
        title: "Book and pay",
        text: "Enter sender, recipient and route, then pay by card. The fee is calculated from weight and delivery zone.",
      },
      ACCEPTED: {
        title: "Assigned to a courier",
        text: "An admin matches your parcel with an available courier. You can see who is responsible for it.",
      },
      PICKED_UP: {
        title: "Picked up",
        text: "The courier collects the parcel and updates its status, so the history starts filling in immediately.",
      },
      IN_TRANSIT: {
        title: "In transit",
        text: "Each status change is recorded with a timestamp and an optional location note.",
      },
      OUT_FOR_DELIVERY: {
        title: "Out for delivery",
        text: "The parcel is on its final leg. If a delivery fails it is retried up to three times before returning to the sender.",
      },
      DELIVERED: {
        title: "Delivered with proof",
        text: "The courier uploads a delivery photo that appears on the public tracking page.",
      },
    },
  },
  /** Text for the structural lists in config/content.ts, keyed the same way. */
  content: {
    parcelTypes: {
      DOCUMENT: { label: "Documents", description: "Letters, contracts and paperwork." },
      PARCEL: { label: "Parcels", description: "Everyday boxes and packages." },
      FRAGILE: { label: "Fragile", description: "Glassware, electronics, anything delicate." },
      PERISHABLE: { label: "Perishable", description: "Food and time-sensitive goods." },
    },
    features: {
      liveTracking: {
        title: "Live tracking",
        description: "Follow every parcel from pickup to doorstep with a full status history.",
      },
      transparentPricing: {
        title: "Transparent pricing",
        description: "Fees are calculated from weight and zones. No surprises at checkout.",
      },
      proofOfDelivery: {
        title: "Proof of delivery",
        description: "Couriers upload a delivery photo, visible right on the tracking page.",
      },
      smartRetries: {
        title: "Smart retries",
        description: "Failed attempts are retried up to three times before returning to sender.",
      },
    },
    services: {
      send: {
        title: "Send a parcel",
        description:
          "Book in four short steps, see the fee before you pay, and pay by card. Pickup starts once it's paid.",
        cta: "Book a parcel",
      },
      track: {
        title: "Track a parcel",
        description:
          "Every status change is recorded with a time and place. No account needed — just the tracking number.",
        cta: "Track now",
      },
      deliver: {
        title: "Deliver with us",
        description:
          "Couriers get a clear task list, update statuses from the road and upload photo proof on delivery.",
        cta: "Join as a courier",
      },
    },
    faqs: {
      fee: {
        q: "How is the delivery fee calculated?",
        /** {currency}, {baseFee}, {perKg} are filled from PRICING. */
        a: "A base fee of {currency} {baseFee}, plus {currency} {perKg} per kilogram, plus a surcharge for the zone of each hub. The exact fee is shown before you pay.",
      },
      coverage: {
        q: "Which areas do you cover?",
        a: "We deliver between our hubs. The coverage list on this page shows every hub with its city and zone, straight from our live network.",
      },
      duration: {
        q: "How long does delivery take?",
        a: "It depends on the route and when a courier picks the parcel up. You can follow each step — accepted, picked up, in transit, out for delivery — on the tracking page.",
      },
      payment: {
        q: "How do I pay?",
        a: "By card through Stripe Checkout. The parcel is marked as paid as soon as Stripe confirms the payment.",
      },
      notHome: {
        q: "What happens if nobody is home?",
        a: "Failed deliveries are retried up to three times. After that the parcel is returned to the sender.",
      },
      arrived: {
        q: "How do I know it arrived?",
        a: "The courier uploads a photo on delivery. It appears on the tracking page next to the full status history.",
      },
      account: {
        q: "Do I need an account to track a parcel?",
        a: "No. Anyone with a tracking number can follow it from the tracking page.",
      },
    },
  },
};
