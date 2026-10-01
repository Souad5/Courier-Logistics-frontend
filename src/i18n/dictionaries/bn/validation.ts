import type { validation as en } from "../en/validation";

export const validation: typeof en = {
  required: "এই ঘরটি পূরণ করা আবশ্যক।",
  email: "সঠিক ইমেইল ঠিকানা দিন।",
  url: "সঠিক URL দিন।",
  number: "একটি সংখ্যা দিন।",
  minChars: "কমপক্ষে {n}টি অক্ষর দিন।",
  maxChars: "সর্বোচ্চ {n}টি অক্ষর দেওয়া যাবে।",
  positive: "মান ০-এর বেশি হতে হবে।",
  maxValue: "মান {n} বা তার কম হতে হবে।",
  select: "একটি অপশন বেছে নিন।",
  imageType: "একটি ছবি বেছে নিন।",
  imageTypes: "শুধু JPEG, PNG বা WebP ছবি দেওয়া যাবে।",
  imageSize: "ছবির আকার {n} MB বা তার কম হতে হবে।",
  imageRead: "ছবিটি পড়া যায়নি।",
};
