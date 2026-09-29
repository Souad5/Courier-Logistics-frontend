import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";

export interface AppButtonProps extends ComponentProps<typeof Button> {
  /** Shows a spinner (replacing leftIcon) and disables the button. */
  loading?: boolean;
  /** Label shown while loading; defaults to the normal children. */
  loadingText?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

/**
 * shadcn <Button> plus loading state and icon slots.
 *
 * With `asChild` (e.g. wrapping a <Link>), children are passed through untouched
 * because Radix Slot needs exactly one child — put icons inside the child instead.
 */
export function AppButton({
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  disabled,
  asChild,
  children,
  ...props
}: AppButtonProps) {
  if (asChild) {
    return (
      <Button asChild disabled={disabled} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <Button disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? (
        <Loader2 className="animate-spin" data-icon="inline-start" aria-hidden />
      ) : (
        leftIcon && (
          <span data-icon="inline-start" className="contents">
            {leftIcon}
          </span>
        )
      )}
      {loading && loadingText ? loadingText : children}
      {!loading && rightIcon && (
        <span data-icon="inline-end" className="contents">
          {rightIcon}
        </span>
      )}
    </Button>
  );
}
