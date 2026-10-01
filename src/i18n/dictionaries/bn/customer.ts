import type { customer as en } from "../en/customer";

export const customer: typeof en = {
  activity: {
    title: "আমার কার্যক্রম",
    description: "আপনার শিপমেন্টগুলোর এক নজরে চিত্র। অপেক্ষমাণ পার্সেলের পেমেন্ট করে সেগুলো চালু করুন।",
  },
  parcels: { title: "আমার পার্সেল", description: "আপনার পাঠানো সব পার্সেল।" },
  stats: {
    total: "মোট পার্সেল",
    pending: "অপেক্ষমাণ",
    pendingHint: "এখনো পিকআপ হয়নি",
    delivered: "ডেলিভারি সম্পন্ন",
  },
  latest: {
    title: "সাম্প্রতিক পার্সেল",
    description: "আপনার সর্বশেষ পাঁচটি শিপমেন্ট।",
    awaitingPayment: "{n}টি পেমেন্টের অপেক্ষায়।",
    emptyTitle: "আপনি এখনো কোনো পার্সেল পাঠাননি",
    emptyDescription: "আপনার প্রথম পার্সেল বুক করুন এবং এখান থেকে ট্র্যাক করুন।",
    sendParcel: "পার্সেল পাঠান",
    to: "প্রাপক: {name} · {date}",
    viewAll: "সব পার্সেল দেখুন",
  },
  table: {
    tracking: "ট্র্যাকিং নম্বর",
    receiver: "প্রাপক",
    route: "রুট",
    status: "অবস্থা",
    booked: "বুকিংয়ের তারিখ",
    fee: "ফি",
    actions: "কার্যক্রম",
    empty: "এখনো কোনো পার্সেল নেই।",
    emptyDescription: "সার্চ বা অবস্থার ফিল্টার পরিবর্তন করে দেখুন, অথবা নতুন পার্সেল বুক করুন।",
  },
};
