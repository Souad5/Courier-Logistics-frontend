import type { errors as en } from "../en/errors";

export const errors: typeof en = {
  notFound: {
    title: "পৃষ্ঠাটি পথে হারিয়ে গেছে",
    description: "আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি নেই অথবা সরিয়ে নেওয়া হয়েছে।",
    home: "হোমে ফিরে যান",
    contact: "সহায়তায় যোগাযোগ করুন",
  },
  boundary: {
    title: "কিছু একটা সমস্যা হয়েছে",
    description: "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। আবার চেষ্টা করুন, অথবা হোম পেজে ফিরে যান।",
    reference: "রেফারেন্স: {digest}",
  },
  network: "সার্ভারে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।",
};
