import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler (stable in Next 16): auto-memoizes components and hooks, so
  // manual useMemo/useCallback/React.memo are rarely needed. Runs via
  // babel-plugin-react-compiler on files with JSX/hooks only. ESLint's
  // react-hooks rules report code the compiler has to skip.
  reactCompiler: true,

  // Proof-of-delivery photos are served from Cloudinary.
  images: { remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }] },

  // Dev only: lets the dev server be opened from other hosts on the LAN
  // (e.g. http://192.168.0.175:3000, or a phone on the same Wi-Fi). Without
  // this, Next blocks its dev resources for non-localhost origins and every
  // link click falls back to a full page reload. `*` matches one hostname
  // label, so this covers any 192.168.x.x address the router hands out.
  allowedDevOrigins: ["192.168.*.*"],

  // Dev only: forward same-origin /api/v1/* to the real backend (see
  // DEV_API_PROXY_PATH in src/config/api.config.ts), so the browser never makes
  // a cross-origin call and the backend's CORS list doesn't matter locally.
  async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    const backend = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1"
    ).replace(/\/+$/, "");
    return [{ source: "/api/v1/:path*", destination: `${backend}/:path*` }];
  },
};

export default nextConfig;
