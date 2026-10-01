import type { tracking as en } from "../en/tracking";

export const tracking: typeof en = {
  meta: {
    title: "{trackingNumber} ট্র্যাক করুন",
    description: "আপনার পার্সেলের সর্বশেষ অবস্থা ও ডেলিভারির ইতিহাস।",
  },
  form: {
    placeholder: "ট্র্যাকিং নম্বর, যেমন BCM1A2B3C4D",
    label: "ট্র্যাকিং নম্বর",
    submit: "ট্র্যাক",
  },
  result: {
    notFound: "পার্সেলটি খুঁজে পাওয়া যায়নি",
    summary: "{type} · {from} → {to} · প্রাপক {receiver}",
    origin: "উৎস",
    destination: "গন্তব্য",
    booked: "বুকিং",
    delivered: "ডেলিভারি",
    attempts: "ডেলিভারির চেষ্টা",
    proof: "ডেলিভারির প্রমাণ",
    history: "ইতিহাস",
    noHistory: "এখনো কোনো আপডেট নেই।",
  },
};
