"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AppButton } from "@/components/shared/AppButton";
import { AppDialog } from "@/components/shared/AppDialog";
import { useUploadProofOfDelivery } from "@/hooks/useParcels";
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
  const upload = useUploadProofOfDelivery();
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const choose = (picked: File | undefined) => {
    if (!picked) return;
    if (!ALLOWED_TYPES.includes(picked.type)) {
      return toast.error("Only JPEG, PNG or WebP images are allowed.");
    }
    if (picked.size > MAX_BYTES) return toast.error("Image must be 5 MB or smaller.");
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
      title="Proof of delivery"
      description={`Parcel #${parcel.trackingNumber}`}
      footer={
        <AppButton
          disabled={!file}
          loading={upload.isPending}
          onClick={() =>
            file && upload.mutate({ id: parcel.id, photo: file }, { onSuccess: onClose })
          }
        >
          Upload photo
        </AppButton>
      }
    >
      <div className="space-y-4 py-4">
        <input
          ref={input}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="sr-only"
          aria-label="Choose delivery photo"
          onChange={(event) => {
            choose(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        {parcel.proofOfDeliveryUrl && !preview && (
          <p className="text-muted-foreground text-sm">
            A photo is already uploaded. Choosing a new one replaces it.
          </p>
        )}
        {preview ? (
          <div className="space-y-3">
            <Image
              src={preview}
              alt="Selected delivery photo preview"
              width={480}
              height={320}
              unoptimized
              className="h-56 w-full rounded-lg border object-cover"
            />
            {upload.isPending && (
              <div
                role="progressbar"
                aria-label="Uploading photo"
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
                Replace
              </AppButton>
              <AppButton variant="ghost" size="sm" disabled={upload.isPending} onClick={clear}>
                Remove
              </AppButton>
            </div>
          </div>
        ) : (
          <AppButton variant="outline" onClick={() => input.current?.click()}>
            Choose photo
          </AppButton>
        )}
        <p className="text-muted-foreground text-sm">
          JPEG, PNG or WebP, up to 5 MB. Available while a parcel is out for delivery or delivered.
        </p>
      </div>
    </AppDialog>
  );
}
