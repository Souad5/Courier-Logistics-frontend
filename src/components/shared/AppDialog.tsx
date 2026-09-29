"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SIZE_CLASSES = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
} as const;

export interface AppDialogProps {
  /** Element that opens the dialog (rendered with asChild, so pass a single element). */
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** Action buttons, rendered right-aligned in the footer. */
  footer?: ReactNode;
  size?: keyof typeof SIZE_CLASSES;
  /** Controlled mode — omit both for an uncontrolled dialog opened by `trigger`. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCloseButton?: boolean;
  className?: string;
}

/** shadcn <Dialog> assembled from props: trigger, header, scrollable body and footer. */
export function AppDialog({
  trigger,
  title,
  description,
  children,
  footer,
  size = "md",
  open,
  onOpenChange,
  showCloseButton = true,
  className,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn("max-h-[90svh] grid-rows-[auto_1fr_auto]", SIZE_CLASSES[size], className)}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {/* Radix warns when a dialog has no description; keep an empty one for a11y. */}
          <DialogDescription className={cn(!description && "sr-only")}>
            {description ?? title}
          </DialogDescription>
        </DialogHeader>
        {children && <div className="-mx-1 min-h-0 overflow-y-auto px-1">{children}</div>}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
