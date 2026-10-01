import { bn } from "./bn";
import { en } from "./en";

/** English is the source of truth: every other locale is type-checked against it. */
export type Dictionary = typeof en;

export const dictionaries = { en, bn };
