import { Fragment, type ReactNode } from "react";

/**
 * Like interpolate(), but placeholders can be React nodes — for sentences where a
 * value is styled, e.g. "Showing {from}–{to} of {total}" with bold numbers. Word
 * order comes from the translation, so each language can place values naturally.
 */
export function interpolateNodes(template: string, values: Record<string, ReactNode>): ReactNode {
  return template.split(/(\{\w+\})/g).map((part, index) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    // biome-ignore lint/suspicious/noArrayIndexKey: parts of a fixed template, never reordered
    return <Fragment key={index}>{key && key in values ? values[key] : part}</Fragment>;
  });
}
