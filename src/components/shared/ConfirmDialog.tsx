"use client";

import { type ReactNode, useState } from "react";

import { useI18n } from "@/i18n/client";

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
   * May return a promise (e.g. `mutateAsync`): the confirm button shows a
   * spinner until it settles, and the dialog closes only if it resolves (stays
   * open on error). Any return value is accepted and awaited.
   */
  onConfirm: () => unknown;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText,
  cancelText,
  destructive = false,
  onConfirm,
  open: controlledOpen,
  onOpenChange,
}: ConfirmDialogProps) {
  const { t } = useI18n();
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
            {cancelText ?? t.common.actions.cancel}
          </AppButton>
          <AppButton
            variant={destructive ? "destructive" : "default"}
            loading={pending}
            onClick={handleConfirm}
          >
            {confirmText ?? t.common.actions.confirm}
          </AppButton>
        </>
      }
    />
  );
}
