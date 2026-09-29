import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Biome (biome.json) is the formatter and main linter. ESLint runs ONLY the
 * rules Biome doesn't have:
 * - react-hooks v7: the React Compiler's rules (set-state-in-effect, refs,
 *   purity, immutability…) plus rules-of-hooks / exhaustive-deps. They flag
 *   code the compiler can't optimize, so they matter with reactCompiler on.
 * - @next/next core-web-vitals: Next-specific rules (no-html-link-for-pages,
 *   no-location-assign-relative-destination, …).
 * Rules Biome's `next` domain already covers are switched off here.
 */
export default defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"]),
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    languageOptions: {
      // Some @next/next rules only fire on known globals (e.g. `window`).
      globals: { ...globals.browser, ...globals.node },
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    // No unused-disable warnings for biome-ignore style comments ESLint doesn't know.
    linterOptions: { reportUnusedDisableDirectives: "off" },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
      ...reactHooks.configs.recommended.rules,
      // Covered by Biome's `next` domain (noImgElement, noHeadElement, …).
      "@next/next/no-img-element": "off",
      "@next/next/no-head-element": "off",
      "@next/next/google-font-preconnect": "off",
      "@next/next/no-sync-scripts": "off",
    },
  },
]);
