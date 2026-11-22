import Image, { type ImageProps } from "next/image";
import { cloudinaryLoader } from "@/lib/cloudinary/imageLoader";

export default function SmartImage({ alt, ...props }: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  if (src.includes("res.cloudinary.com")) {
    return <Image {...props} alt={alt} loader={cloudinaryLoader} />;
  }
  return <Image {...props} alt={alt} />;
}
