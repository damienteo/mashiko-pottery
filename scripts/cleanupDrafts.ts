import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// TODO: Script should not just delete draft images, but also check if they are unused
// and only delete those that are not linked to any active potter or product.

async function cleanupDrafts() {
  const result = await cloudinary.api.delete_resources_by_tag("draft", {
    keep_original: false,
    max_results: 100, // optional, repeat if needed
  });

  console.log("Deleted draft uploads:", result);
}

cleanupDrafts().catch(console.error);