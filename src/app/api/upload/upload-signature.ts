import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const timestamp = Math.round(Date.now() / 1000) + 600; // expires in 10 minutes
  const folder = req.body.folder || "draft_uploads";
  const public_id = req.body.public_id || undefined;

  const paramsToSign: Record<string, string | number | boolean> = {
    timestamp,
    folder,
    tags: "draft",
    overwrite: true,
  };

  if (public_id) {
    paramsToSign.public_id = public_id;
    paramsToSign.overwrite = true;
    paramsToSign.use_filename = true;
    paramsToSign.unique_filename = false;
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  res.status(200).json({
    timestamp,
    signature,
    folder,
    public_id,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    tags: "draft",
    ...(public_id && {
      overwrite: true,
      use_filename: true,
      unique_filename: false,
    }),
  });
}