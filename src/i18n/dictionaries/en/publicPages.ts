export const publicPages = {
  services: {
    meta: {
      title: "Services",
      description:
        "Door-to-door delivery for documents, parcels, fragile and perishable goods — with live tracking, proof of delivery and smart retries.",
    },
    header: {
      eyebrow: "Services",
      title: "Door-to-door delivery for every kind of shipment.",
      description:
        "Documents, everyday parcels, fragile items and perishables — booked online, carried by our couriers and tracked across every zone we serve.",
    },
    types: {
      eyebrow: "What we carry",
      title: "Four parcel types, one booking flow.",
      description:
        "Pick the type when you book so the courier knows how to handle it. The price is the same formula for all four.",
      photoAlts: {
        DOCUMENT: "A hand holding a sealed white envelope",
        PARCEL: "A neat stack of brown cardboard boxes",
        FRAGILE: "A small parcel marked Fragile, handle with care",
        PERISHABLE: "Fresh pineapples and oranges packed in a cardboard crate",
      },
      tips: {
        DOCUMENT: "Contracts, certificates, letters",
        PARCEL: "Clothes, books, electronics in boxes",
        FRAGILE: "Glass, ceramics, screens — packed well",
        PERISHABLE: "Food and produce that can't wait",
      },
    },
    steps: {
      eyebrow: "How a delivery works",
      title: "Four steps from booking to doorstep.",
      items: {
        book: {
          title: "Book and pay",
          text: "Choose the type, weight and hubs. See the fee, pay by card.",
        },
        pickup: {
          title: "Hub pickup",
          text: "An admin assigns a courier, who collects it from the origin hub.",
        },
        transit: {
          title: "In transit",
          text: "Every scan — picked up, in transit, out for delivery — is timestamped.",
        },
        delivered: {
          title: "Delivered with proof",
          text: "The courier uploads a photo, visible on the tracking page.",
        },
      },
    },
    included: {
      photoAlt: "A courier carrying a parcel along a busy city street",
      caption: "Every parcel gets the same service — no add-ons to choose.",
      eyebrow: "Included",
      title: "With every delivery.",
      description: "Tracking, clear pricing, photo proof and retries come as standard.",
    },
    cta: {
      title: "Ready to book? It takes about a minute.",
      description:
        "Create a free account, enter the parcel details and pay by card — we take it from there.",
      primary: "Send a parcel",
      secondary: "See pricing",
    },
  },
  pricing: {
    meta: {
      title: "Pricing",
      description:
        "Transparent courier pricing: a flat base fee, a per-kg weight rate and zone surcharges. See exactly what your parcel costs before you pay.",
    },
    header: {
      eyebrow: "Pricing",
      title: "Simple, transparent pricing.",
      description:
        "Every fee comes from three things: a flat base fee, the parcel's weight, and the zones of the pickup and delivery hubs. You see the total before you pay.",
    },
    parts: {
      base: { label: "Base fee", note: "Charged once on every parcel." },
      weight: {
        label: "Weight",
        /** {amount} is the formatted per-kg rate. */
        value: "{amount} / kg",
        note: "Billed on the actual weight you enter.",
      },
      zones: {
        label: "Zones",
        value: "Per hub",
        note: "Added for both the pickup and the delivery hub.",
      },
    },
    calculator: {
      title: "Delivery calculator",
      description:
        "Pick real hubs from our network and a weight — this is the fee you'll be charged.",
    },
    table: {
      eyebrow: "Delivery charges",
      title: "Common prices at a glance.",
      /** {zone} is the zone name in lower case. */
      description:
        "Sending from an {zone} hub. Surcharges for each zone are shown in the last column.",
      deliveryZone: "Delivery zone",
      weight: "{kg} kg",
      zoneSurcharge: "Zone surcharge",
      otherZone: "Any other zone",
    },
    example: {
      title: "Worked example",
      /** {kg}, {from}, {to} */
      description: "A {kg} kg parcel from an {from} hub to an {to} hub.",
      baseFee: "Base fee",
      weight: "Weight {kg} kg × {rate}",
      origin: "Origin · {zone}",
      destination: "Destination · {zone}",
      total: "Total",
      note: "The server always calculates the final fee with the same rule — this page mirrors it.",
    },
    faq: { eyebrow: "FAQ", title: "Pricing questions." },
    cta: {
      title: "Know the price? Book it now.",
      description: "Create a free account and the fee you just saw is the fee you pay.",
      primary: "Send a parcel",
      secondary: "Explore services",
    },
  },
  about: {
    meta: {
      title: "About",
      description:
        "We connect customers with couriers through a hub network, clear pricing and end-to-end parcel tracking.",
    },
    header: {
      /** {name} is the brand name. */
      eyebrow: "About {name}",
      title: "We connect people who need things delivered with the couriers who deliver them.",
      description:
        "A hub network, clear pricing and end-to-end tracking sit in between — so everyone involved can see where a parcel is and who is responsible for it.",
    },
    story: {
      photoAlt: "A team loading cardboard parcels into the back of a truck",
      eyebrow: "Our story",
      title: "Built around the parcel, not the paperwork.",
      /** {name} is the brand name. */
      p1: "Sending a parcel shouldn't mean phone calls to find out where it is. {name} puts the booking, the payment and every scan of the journey in one place.",
      p2: "Customers see the fee before they pay. Couriers get a clear task list and update the status from the road. Admins assign work, manage hubs and can audit every critical action.",
    },
    values: {
      eyebrow: "What we value",
      title: "Three promises we build around.",
      items: {
        reliability: {
          title: "Reliability",
          text: "Every status change is recorded with a timestamp, so nothing goes missing without a trace.",
        },
        transparency: {
          title: "Transparency",
          text: "Fees follow one published formula and are shown before you pay.",
        },
        accountability: {
          title: "Accountability",
          text: "Couriers confirm deliveries with a photo, and every critical action is written to an audit log.",
        },
      },
    },
    network: {
      eyebrow: "The network today",
      title: "Real numbers, straight from our hub list.",
      description:
        "No rounded-up marketing figures — these update as hubs are added to the network.",
    },
    model: {
      eyebrow: "How it's organised",
      title: "Hubs, zones and roles.",
      items: {
        hubs: {
          term: "Hubs",
          text: "Parcels move between hubs. Each hub has a code, an address and belongs to a zone.",
        },
        zones: {
          term: "Zones",
          text: "A zone sets the surcharge for pickups and deliveries at its hubs — inner city to remote.",
        },
        roles: {
          term: "Roles",
          text: "Customers, couriers and admins each get their own workspace, checked on every request.",
        },
      },
    },
    cta: {
      title: "Join the network.",
      description: "Send your first parcel, or sign up as a courier and start delivering.",
      primary: "Create free account",
      secondary: "Contact us",
    },
  },
  contact: {
    meta: {
      title: "Contact",
      description:
        "Questions about a delivery, pricing or becoming a courier? Get in touch with our support team.",
    },
    header: {
      eyebrow: "Contact",
      title: "Talk to a person.",
      description:
        "Questions about a delivery, pricing, or becoming a courier? Send us a message and our support team will help.",
    },
    channels: {
      email: { title: "Email us", cta: "Write an email" },
      track: {
        title: "Where's my parcel?",
        detail: "Track it any time with your tracking number — no account needed.",
        cta: "Track a parcel",
      },
      courier: {
        title: "Become a courier",
        detail: "Sign up, go on duty and start receiving delivery tasks.",
        cta: "Join as a courier",
      },
    },
    form: {
      title: "Send us a message",
      description: "Tell us what you need and we'll get back to you by email.",
      name: "Name",
      email: "Email",
      message: "Message",
      submit: "Send message",
      nameRequired: "Please enter your name",
      messageMin: "Message must be at least {n} characters",
      success: "Thanks! We'll get back to you shortly.",
    },
    aside: {
      photoAlt: "A parcel being handed from one person to another",
      title: "Before you write",
      tips: [
        "Include your tracking number if it's about a delivery",
        "Mention the pickup and delivery hubs for pricing questions",
        "Use the email address on your account so we can find it",
      ],
      /** {faq} and {pricing} are links. */
      more: "Quick answers are in the {faq}, and current rates are on the {pricing}.",
      faqLink: "FAQ",
      pricingLink: "pricing page",
    },
  },
};
