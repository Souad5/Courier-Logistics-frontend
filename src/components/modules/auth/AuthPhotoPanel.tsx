"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { usePathname } from "next/navigation";

import deliverImg from "@/assets/landing/deliver.jpg";
import sendImg from "@/assets/landing/send.jpg";

const PANELS: Record<
  "login" | "register",
  { image: StaticImageData; title: string; points: string[] }
> = {
  login: {
    image: deliverImg,
    title: "Welcome back. Your parcels are right where you left them.",
    points: [
      "Track every parcel with a timestamped history",
      "Pay pending parcels by card in a few clicks",
      "Couriers pick up their task list instantly",
    ],
  },
  register: {
    image: sendImg,
    title: "Send your first parcel in four short steps.",
    points: [
      "See the exact fee before you pay",
      "Photo proof on every delivery",
      "Or sign up as a courier and start delivering",
    ],
  },
};

/** Photo side of the auth layout; the image and copy follow the current page. */
export function AuthPhotoPanel() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const key = pathname.startsWith("/register") ? "register" : "login";
  const panel = PANELS[key];

  return (
    <aside className="relative isolate m-3 hidden overflow-hidden rounded-3xl text-white lg:flex">
      <motion.div
        key={key}
        className="absolute inset-0 -z-10"
        initial={reduceMotion ? false : { scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={panel.image}
          alt=""
          fill
          placeholder="blur"
          sizes="45vw"
          className="object-cover"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/25"
      />

      <div className="flex w-full flex-col justify-between p-10 xl:p-14">
        <p className="font-mono text-sm tracking-widest text-white/80 uppercase">
          Courier delivery in Bangladesh
        </p>
        <motion.div
          key={`${key}-copy`}
          className="space-y-8"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <p className="max-w-md text-3xl leading-tight font-semibold tracking-tight text-balance xl:text-4xl">
            {panel.title}
          </p>
          <ul className="space-y-3 text-sm">
            {panel.points.map((point) => (
              <li key={point} className="flex gap-3 text-white/85">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
          <p className="text-sm text-white/60">Payments are processed by Stripe in test mode.</p>
        </motion.div>
      </div>
    </aside>
  );
}
