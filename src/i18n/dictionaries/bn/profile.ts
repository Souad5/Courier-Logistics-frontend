import type { profile as en } from "../en/profile";

export const profile: typeof en = {
  page: { title: "প্রোফাইল", description: "আপনার অ্যাকাউন্টের তথ্য।" },
  uploadPhoto: "ছবি আপলোড করুন",
  photoHint: 'JPG বা PNG, সর্বোচ্চ ৫ MB। "পরিবর্তন সংরক্ষণ করুন" চাপলে সংরক্ষিত হবে।',
  personal: {
    title: "ব্যক্তিগত তথ্য",
    description: "কুরিয়ার ও সহায়তা দল কীভাবে আপনার সঙ্গে যোগাযোগ করবে।",
    fullName: "পূর্ণ নাম",
    phone: "ফোন",
    save: "পরিবর্তন সংরক্ষণ করুন",
  },
  account: {
    title: "অ্যাকাউন্ট",
    description: "এই তথ্যগুলো প্ল্যাটফর্ম থেকে পরিচালিত হয়।",
    email: "ইমেইল",
    role: "ভূমিকা",
    signIn: "সাইন-ইন পদ্ধতি",
    google: "গুগল",
    password: "ইমেইল ও পাসওয়ার্ড",
    memberSince: "সদস্য হয়েছেন",
    emailVerified: "ইমেইল যাচাই",
    yes: "হ্যাঁ",
    notYet: "এখনো হয়নি",
    status: "অ্যাকাউন্টের অবস্থা",
  },
  errors: {
    nameMin: "নাম কমপক্ষে ২ অক্ষরের হতে হবে",
    tooShort: "খুব ছোট",
    tooLong: "খুব বড়",
    url: "সঠিক URL দিন",
  },
};
