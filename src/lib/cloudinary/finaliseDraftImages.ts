

import { v2 as cloudinary } from "cloudinary";

/**
 * Moves images from a draft folder to a finalized folder.
 * @param imageUrl - Single Cloudinary image URL to process.
 * @param photos - Array of Cloudinary image URLs to process.
 * @param folderType - Either 'products' or 'potters'.
 * @param finalId - The ID to use in the final folder structure.
 * @returns Updated list of URLs (renamed if moved).
 */
export async function finalizeDraftImages({
  imageUrl,
  photos,
  folderType,
  finalId,
}: {
  imageUrl?: string;
  photos?: string[];
  folderType: "products" | "potters";
  finalId: string;
}): Promise<{
  imageUrl?: string;
  photos?: string[];
}> {
  const updated: {
    imageUrl?: string;
    photos?: string[];
  } = {};

  const renameAsset = async (url: string): Promise<string> => {
    try {
      const matches = url.match(/upload\/(?:v\d+\/)?(.+?)\.(jpg|jpeg|png|webp)/);
      if (!matches) return url;

      const originalPublicId = matches[1];

      // Only rename if from a draft folder
      if (!originalPublicId.startsWith(`drafts/${folderType}/`)) return url;

      const newPublicId = `${folderType}/${finalId}/${originalPublicId.split("/").pop()}`;
      const result = await cloudinary.uploader.rename(originalPublicId, newPublicId, {
        overwrite: true,
      });

      return result.secure_url;
    } catch (err) {
      console.error("Cloudinary rename failed:", err);
      return url;
    }
  };

  if (imageUrl) {
    updated.imageUrl = await renameAsset(imageUrl);
  }

  if (photos?.length) {
    updated.photos = await Promise.all(photos.map(renameAsset));
  }

  return updated;
}