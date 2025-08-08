"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useController, Control } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

import { useToast } from "@/components/ui/Toast";

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
  const { field } = useController({ name, control });
  const { success, error: toastError } = useToast();
  const t = useTranslations("common");

  const [previews, setPreviews] = useState<
    { url: string; public_id?: string }[]
  >(Array.isArray(field.value) ? field.value : []);
  const [isUploading, setIsUploading] = useState(false);

  const removeImage = (index: number) => {
    const updated = [...previews];
    updated.splice(index, 1);
    setPreviews(updated);
    field.onChange(updated);
  };

  return (
    <div>
      <label className="block font-medium mb-2">{label}</label>
      <CldUploadWidget
        uploadPreset={undefined}
        signatureEndpoint="/api/upload/upload-signature"
        options={{
          multiple,
          maxFiles: multiple ? undefined : 1,
          folder:
            getPublicId?.()?.split("/")?.slice(0, -1)?.join("/") || undefined,
          publicId:
            multiple && getPublicId
              ? `${getPublicId?.()}-${uuidv4()}`
              : getPublicId?.(),
          tags: getPublicId?.()?.includes("drafts/") ? ["draft"] : [],
          clientAllowedFormats: ["jpeg", "png"],
        }}
        onOpen={() => setIsUploading(true)}
        onClose={() => setIsUploading(false)}
        onSuccess={(result) => {
          setIsUploading(false);
          success(t("photo-upload.uploadSuccess"));
          const info = result?.info;

          if (
            info &&
            typeof info === "object" &&
            "secure_url" in info &&
            "public_id" in info
          ) {
            const newImage = {
              url: info.secure_url as string,
              public_id: info.public_id as string,
            };
            const updated = multiple ? [...previews, newImage] : [newImage];
            setPreviews(updated);
            field.onChange(updated);
          } else {
            toastError(t("photo-upload.uploadFail"));
          }
        }}
        onError={(err) => {
          console.log({ err });
          setIsUploading(false);
          toastError(t("photo-upload.uploadFail"));
        }}
        // onQueuesEnd={(_, { widget }) => widget.close()}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={isUploading}
            aria-label={t("photo-upload.ariaAddImage")}
            title={t("photo-upload.ariaAddImage")}
          >
            {label}
          </button>
        )}
      </CldUploadWidget>
      <div className="flex flex-wrap gap-3 mt-3">
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
    </div>
  );
}
