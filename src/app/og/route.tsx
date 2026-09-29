import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";

/**
 * Social preview image served at /og (1200×630, the size Facebook, LinkedIn,
 * WhatsApp and X all render well), referenced by every page via
 * defaultOgImage in src/lib/seo.ts.
 *
 * Deliberately a route handler, not the `opengraph-image` file convention: the
 * file-based image is dropped on any page that sets its own `openGraph`, and it
 * also suppresses config-provided images there, leaving those pages with none.
 */
export const dynamic = "force-static"; // render once at build time

const size = { width: 1200, height: 630 };

export function GET() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "linear-gradient(135deg, #0a0a0a 0%, #262626 100%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "#fafafa",
            color: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          {siteConfig.name[0]}
        </div>
        <div style={{ fontSize: 44, fontWeight: 700 }}>{siteConfig.name}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, maxWidth: 1060 }}>
          Send anything, anywhere — and always know where it is.
        </div>
        <div style={{ fontSize: 32, color: "#a3a3a3", maxWidth: 950 }}>
          Book, pay, track and deliver parcels across every zone.
        </div>
      </div>
    </div>,
    size,
  );
}
