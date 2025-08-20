import React, { useState, useMemo } from "react";
import Image from "next/image";

export type GalleryProps = {
  images: string[];
  title?: string;
  imagePriority?: boolean;
};

const Gallery: React.FC<GalleryProps> = ({
  images,
  title = "Product image",
  imagePriority = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentImage = useMemo(
    () => images?.[currentIndex] || "",
    [images, currentIndex]
  );

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="md:flex md:items-start md:gap-4">
        {currentImage && (
          <>
            <div className="relative w-full aspect-square overflow-hidden rounded md:flex-1">
              <Image
                src={currentImage}
                alt={title || "Product image"}
                fill
                className="object-cover transition-transform duration-300"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority={imagePriority}
              />
            </div>
            {images.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-[480px] w-20 thumbnail-scroll">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`relative w-16 h-16 rounded overflow-hidden border-2 focus:outline-none ${
                      idx === currentIndex
                        ? "border-gray-400"
                        : "border-transparent"
                    }`}
                    aria-label={`Select image ${idx + 1}`}
                    title={`Select image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${title || "Product"} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      priority={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="md:hidden mt-4 flex gap-3 overflow-x-auto thumbnail-scroll">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 focus:outline-none ${
                idx === currentIndex ? "border-gray-400" : "border-transparent"
              }`}
              aria-label={`Select image ${idx + 1}`}
              title={`Select image ${idx + 1}`}
            >
              <Image
                src={img}
                alt={`${title || "Product"} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                priority={false}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default Gallery;
