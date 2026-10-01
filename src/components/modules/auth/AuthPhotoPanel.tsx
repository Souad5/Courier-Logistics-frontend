"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { usePathname } from "next/navigation";

import deliverImg from "@/assets/landing/deliver.jpg";
import sendImg from "@/assets/landing/send.jpg";
import { useI18n } from "@/i18n/client";

const IMAGES: Record<"login" | "register", StaticImageData> = {
  login: deliverImg,
  register: sendImg,
};

/** Photo side of the auth layout; the image and copy follow the current page. */
export function AuthPhotoPanel() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();
  const key = pathname.startsWith("/register") ? "register" : "login";
  const panel =
    key === "register"
      ? { title: t.auth.panel.registerTitle, points: t.auth.panel.registerPoints }
      : { title: t.auth.panel.loginTitle, points: t.auth.panel.loginPoints };

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
          src={IMAGES[key]}
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
          {t.auth.panel.eyebrow}
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
          <p className="text-sm text-white/60">{t.auth.panel.stripeNote}</p>
        </motion.div>
      </div>
    </aside>
  );
}
