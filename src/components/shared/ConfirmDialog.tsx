"use client";

import { type ReactNode, useState } from "react";

import { AppButton } from "./AppButton";
import { AppDialog } from "./AppDialog";

export interface ConfirmDialogProps {
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  /** Red confirm button for irreversible actions (delete, cancel parcel…). */
  destructive?: boolean;
  /**
   * May return a promise: the confirm button shows a spinner until it settles,
   * and the dialog closes only if it resolves (stays open on error).
   */
  onConfirm: () => void | Promise<unknown>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  onConfirm,
  open: controlledOpen,
  onOpenChange,
}: ConfirmDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = (next: boolean) => {
    if (pending) return; // don't close mid-request
    setInternalOpen(next);
    onOpenChange?.(next);
  };

  const handleConfirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      setPending(false);
      setInternalOpen(false);
      onOpenChange?.(false);
    } catch {
      // The caller surfaces the error (e.g. a mutation's onError toast); keep the dialog open.
      setPending(false);
    }
  };

  return (
    <AppDialog
      trigger={trigger}
      title={title}
      description={description}
      size="sm"
      open={open}
      onOpenChange={setOpen}
      showCloseButton={false}
      footer={
        <>
          <AppButton variant="outline" disabled={pending} onClick={() => setOpen(false)}>
            {cancelText}
          </AppButton>
          <AppButton
            variant={destructive ? "destructive" : "default"}
            loading={pending}
            onClick={handleConfirm}
          >
            {confirmText}
          </AppButton>
        </>
      }
    />
  );
}
