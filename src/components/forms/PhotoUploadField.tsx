"use client";

import { useState, useEffect } from "react";
import { useController, Control } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";
import { useTranslations } from "next-intl";
import Image from "next/image";

import { useToast } from "@/components/ui/Toast";

// TODO: Button should go loading while widget is <opening />
// TODO: Remove preview onyl remove from array. Should just delete straight?

// Minimal Cloudinary Upload Widget types used in this component
type CloudinaryUploadWidget = {
  open: () => void;
  close: () => void;
  destroy: () => void;
  hide: () => void;
  show: () => void;
  update: (options: Record<string, unknown>) => void;
};

type CloudinaryGlobal = {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: unknown) => void
  ) => CloudinaryUploadWidget;
};

declare global {
  interface Window {
    cloudinary: CloudinaryGlobal;
  }
}

interface PhotoUploadFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  multiple?: boolean;
  getPublicId?: () => string;
}

export default function PhotoUploadField<T extends FieldValues>({
  name,
  control,
  label,
  multiple = true,
  getPublicId,
}: PhotoUploadFieldProps<T>) {
  const {
    field,
    fieldState: { error: rhfError },
  } = useController({ name, control });
  const { success, error: toastError } = useToast();
  const t = useTranslations("common");

  const [previews, setPreviews] = useState<
    { url: string; public_id?: string }[]
  >(
    (() => {
      const v = field.value as unknown;
      // multiple -> expect string[]; single -> expect string
      if (multiple) {
        if (Array.isArray(v)) {
          // v is string[] or possibly array of objects; normalize to { url }
          return (v as unknown[]).map((item) =>
            typeof item === "string" ? { url: item } : (item as { url: string })
          );
        }
        return [];
      } else {
        if (typeof v === "string" && v) return [{ url: v }];
        return [];
      }
    })()
  );

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.cloudinary) return; // already loaded
    const script = document.createElement("script");
    script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // do not remove the script on unmount to keep it cached across opens
    };
  }, []);

  const openWidget = () => {
    if (!window.cloudinary) {
      toastError("Cloudinary widget failed to load. Please retry.");
      return;
    }

    const basePublicId = getPublicId?.();
    const folder =
      basePublicId?.split("/")?.slice(0, -1)?.join("/") || undefined;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        multiple: multiple,
        maxFiles: multiple ? undefined : 1,
        sources: ["local", "url", "camera"],
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic", "heif"],
        prepareUploadParams: async (
          cb: (params: Record<string, string | number | boolean>) => void
        ) => {
          // basePublicId is like "drafts/potters/some-base-name" when provided
          const baseName = basePublicId?.split("/").pop();

          const publicId = baseName
            ? !multiple
              ? baseName
              : undefined
            : undefined;

          const draftParams: Record<
            string,
            string | number | boolean | undefined
          > = {
            folder, // send folder separately
            tags: basePublicId?.includes("drafts/") ? "draft" : undefined,
            source: "uw",
            timestamp: Math.floor(Date.now() / 1000),
          };

          if (multiple) {
            draftParams.use_filename = true;
            draftParams.unique_filename = true;
          } else {
            draftParams.public_id = publicId; // basename only, no folder here
          }

          const params = Object.fromEntries(
            Object.entries(draftParams).filter(([, v]) => v !== undefined)
          ) as Record<string, string | number | boolean>;

          const res = await fetch("/api/upload/upload-signature", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(params),
          });
          const data = await res.json();
          const { signature, apiKey } = data || {};

          cb({
            ...params,
            api_key: apiKey || process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
            signature,
          });
        },
      },
      (error: unknown, result: unknown) => {
        if (error != null) {
          setIsUploading(false);
          toastError(t("photo-upload.uploadFail"));
          return;
        }
        if (!result || typeof result !== "object") {
          return;
        }
        const r = result as { event?: string; info?: unknown };
        if (r.event === "queues-start") setIsUploading(true);
        if (r.event === "queues-end") setIsUploading(false);
        if (r.event === "success") {
          const info = r.info;
          if (
            info &&
            typeof info === "object" &&
            "secure_url" in info &&
            "public_id" in info
          ) {
            const newImage = {
              url: (info as { secure_url: string }).secure_url,
              public_id: (info as { public_id: string }).public_id,
            };

            // Use functional state update so concurrent success events do not
            // overwrite each other when multiple uploads finish nearly at once.
            setPreviews((prev) => {
              const exists = newImage.public_id
                ? prev.some((p) => p.public_id === newImage.public_id)
                : prev.some((p) => p.url === newImage.url);
              const next = exists
                ? prev
                : multiple
                  ? [...prev, newImage]
                  : [newImage];

              // Write back to RHF in the expected shape: string or string[]
              if (multiple) {
                field.onChange(next.map((p) => p.url));
              } else {
                field.onChange(next[0]?.url ?? "");
              }
              return next;
            });

            success(t("photo-upload.uploadSuccess"));
          } else {
            toastError(t("photo-upload.uploadFail"));
          }
        }
      }
    );

    widget.open();
  };

  const removeImage = (index: number) => {
    const updated = [...previews];
    updated.splice(index, 1);
    setPreviews(updated);
    if (multiple) {
      field.onChange(updated.map((p) => p.url));
    } else {
      field.onChange(updated[0]?.url ?? "");
    }
  };

  useEffect(() => {
    const v = field.value as unknown;
    if (multiple) {
      if (Array.isArray(v)) {
        setPreviews(
          (v as unknown[]).map((item) =>
            typeof item === "string" ? { url: item } : (item as { url: string })
          )
        );
      }
    } else {
      if (typeof v === "string") setPreviews(v ? [{ url: v }] : []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple, field.value]);

  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <button
        type="button"
        onClick={openWidget}
        className={`px-4 py-2 rounded text-white ${rhfError ? "bg-red-600" : "bg-blue-600"}`}
        disabled={isUploading}
        aria-label={t("photo-upload.ariaAddImage")}
        title={t("photo-upload.ariaAddImage")}
      >
        {label}
      </button>
      <div
        className={`flex flex-wrap gap-3 mt-3 ${rhfError ? "ring-1 ring-red-500/60 rounded-md p-2" : ""}`}
      >
        {previews.map((img, index) => (
          <div key={index} className="relative w-24 h-24">
            <Image
              src={img.url}
              alt={`photo-${index}`}
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-bl"
              aria-label={t("photo-upload.removeImage")}
              title={t("photo-upload.removeImage")}
            >
              {t("photo-upload.removeImage")}
            </button>
          </div>
        ))}
      </div>
      {rhfError?.message && (
        <p className="mt-2 text-sm text-red-600">{String(rhfError.message)}</p>
      )}
    </div>
  );
}
