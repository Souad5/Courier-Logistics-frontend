import type { courier as en } from "../en/courier";

export const courier: typeof en = {
  pages: {
    tasks: { title: "আমার কাজ", description: "আপনার কাছে বরাদ্দ করা পার্সেল।" },
    earnings: { title: "আয়", description: "সম্পন্ন ডেলিভারি থেকে আপনার আয়।" },
    availability: {
      title: "প্রাপ্যতা",
      description: "নতুন কাজ নিতে পারবেন কি না, তা এখান থেকে ঠিক করুন।",
    },
  },
  tasks: {
    quickFilters: {
      all: "সব বরাদ্দ",
      outForDelivery: "ডেলিভারির পথে",
      deliveryFailed: "ডেলিভারি ব্যর্থ",
      delivered: "ডেলিভারি সম্পন্ন",
    },
    empty: "এখনো আপনার কাছে কোনো কাজ বরাদ্দ হয়নি।",
    emptyDescription: "অ্যাডমিন আপনাকে কোনো পার্সেল বরাদ্দ দিলে তা এখানে দেখা যাবে।",
  },
  earnings: {
    latest: "আয় · সর্বশেষ {n}টি",
    total: "মোট আয়",
    completed: "সম্পন্ন ডেলিভারি",
    average: "প্রতি ডেলিভারিতে গড় আয়",
    partialNote: "আয়ের হিসাব আপনার সর্বশেষ {n}টি ডেলিভারির ভিত্তিতে।",
    chartTitle: "মাসভিত্তিক আয়",
    chartDescription: "গত ছয় মাসে ডেলিভারি করা পার্সেলের ডেলিভারি ফি।",
    series: "আয়",
    emptyTitle: "গত ছয় মাসে কোনো আয় নেই",
    emptyDescription: "আপনার ডেলিভারি করা পার্সেলের ফি এখানে দেখা যাবে।",
    deliveredHeading: "ডেলিভারি করা পার্সেল",
    columns: { delivered: "ডেলিভারির তারিখ", earnings: "আয়" },
    tableEmpty: "এখনো কোনো ডেলিভারি সম্পন্ন হয়নি।",
    tableEmptyDescription: "ডেলিভারি সম্পন্ন হিসেবে চিহ্নিত পার্সেল ফিসহ এখানে দেখা যাবে।",
  },
  availability: {
    dutyTitle: "ডিউটির অবস্থা",
    dutyDescription: "নতুন কাজ পাবেন কি না, তা নিয়ন্ত্রণ করে।",
    available: "প্রাপ্য",
    unavailable: "অপ্রাপ্য",
    availableHint: "নতুন পার্সেলের জন্য অ্যাডমিনরা আপনাকে দেখতে পাচ্ছেন।",
    unavailableHint: "আবার চালু না করা পর্যন্ত আপনাকে নতুন পার্সেল দেওয়া হবে না।",
    goUnavailable: "অপ্রাপ্য হোন",
    goAvailable: "প্রাপ্য হোন",
    howItWorks: "যেভাবে কাজ করে",
    howItWorksPoints: [
      "প্রাপ্য থাকলে অ্যাডমিনরা আপনাকে নতুন পার্সেল বরাদ্দ দিতে পারেন।",
      "অপ্রাপ্য হলেও আপনার হাতে থাকা পার্সেল সরানো হয় না — আগের মতোই সেগুলো সম্পন্ন বা আপডেট করুন।",
      "শিফট শেষে বন্ধ করে দিন, যাতে নতুন কাজ ডিউটিতে থাকা কেউ পান।",
    ],
    workloadTitle: "আপনার কাজের চাপ",
    workloadDescription: "বর্তমানে আপনার কাছে বরাদ্দ পার্সেল।",
    rating: "রেটিং",
  },
};
