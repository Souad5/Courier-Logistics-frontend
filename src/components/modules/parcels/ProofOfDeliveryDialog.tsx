"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { useUploadProofOfDelivery } from "@/hooks/useParcels";
import { useI18n } from "@/i18n/client";
import type { Parcel } from "@/types";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/** Courier uploads a delivery photo (stored on Cloudinary by the backend). */
export function ProofOfDeliveryDialog({
  parcel,
  onClose,
}: {
  parcel: Parcel;
  onClose: () => void;
}) {
  const { t, f, format } = useI18n();
  const labels = t.parcels.proof;
  const upload = useUploadProofOfDelivery();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const choose = (picked: File | undefined) => {
    if (!picked) return;
    if (!ALLOWED_TYPES.includes(picked.type)) {
      return toast.error(t.validation.imageTypes);
    }
    if (picked.size > MAX_BYTES) {
      return toast.error(format(t.validation.imageSize, { n: f.number(MAX_BYTES / 1024 / 1024) }));
    }
    if (preview) URL.revokeObjectURL(preview);
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  return (
    <AppDialog
      open
      onOpenChange={(open) => !open && !upload.isPending && onClose()}
      title={labels.title}
      description={format(t.parcels.parcelRef, { tracking: parcel.trackingNumber })}
      footer={
        <AppButton
          disabled={!file}
          loading={upload.isPending}
          onClick={() =>
            file && upload.mutate({ id: parcel.id, photo: file }, { onSuccess: onClose })
          }
        >
          {labels.upload}
        </AppButton>
      }
    >
      <div className="space-y-4 py-4">
        <input
          ref={input}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="sr-only"
          aria-label={labels.chooseLabel}
          onChange={(event) => {
            choose(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {parcel.proofOfDeliveryUrl && !preview && (
          <p className="text-muted-foreground text-sm">{labels.alreadyUploaded}</p>
        )}
        {preview ? (
          <div className="space-y-3">
            <Image
              src={preview}
              alt={labels.previewAlt}
              width={480}
              height={320}
              unoptimized
              className="h-56 w-full rounded-lg border object-cover"
            />
            {upload.isPending && (
              <div
                role="progressbar"
                aria-label={labels.uploading}
                className="bg-muted h-1.5 overflow-hidden rounded-full"
              >
                <div className="bg-signal h-full w-1/3 animate-pulse rounded-full" />
              </div>
            )}
            <div className="flex gap-2">
              <AppButton
                variant="outline"
                size="sm"
                disabled={upload.isPending}
                onClick={() => input.current?.click()}
              >
                {labels.replace}
              </AppButton>
              <AppButton variant="ghost" size="sm" disabled={upload.isPending} onClick={clear}>
                {labels.remove}
              </AppButton>
            </div>
          </div>
        ) : (
          <AppButton variant="outline" onClick={() => input.current?.click()}>
            {labels.choose}
          </AppButton>
        )}
        <p className="text-muted-foreground text-sm">{labels.hint}</p>
      </div>
    </AppDialog>
  );
}
