"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { useController, Control } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";
// import { useTranslations } from "next-intl";
import Image from "next/image";

interface PhotoUploadFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  multiple?: boolean;
}

export default function PhotoUploadField<T extends FieldValues>({
  name,
  control,
  label,
  multiple = true,
}: PhotoUploadFieldProps<T>) {
  const { field } = useController({ name, control });
  //   const t = useTranslations();
  const [previews, setPreviews] = useState<string[]>(
    Array.isArray(field.value) ? field.value : []
  );

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
        uploadPreset="your_unsigned_preset"
        onUpload={(result) => {
          const info = result?.info;
          if (info && typeof info === "object" && "secure_url" in info) {
            const newUrl = info.secure_url as string;
            const updated = multiple ? [...previews, newUrl] : [newUrl];
            setPreviews(updated);
            field.onChange(updated);
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {label}
          </button>
        )}
      </CldUploadWidget>
      <div className="flex flex-wrap gap-3 mt-3">
        {previews.map((url, index) => (
          <div key={index} className="relative w-24 h-24">
            <Image
              src={url}
              alt={`photo-${index}`}
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-bl"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
