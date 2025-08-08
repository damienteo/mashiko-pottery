import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const body = await req.json();

  const timestamp = Math.round(Date.now() / 1000) + 600; // expires in 10 minutes
  const folder = body.folder || "draft_uploads";
  const public_id = body.public_id || undefined;

  const paramsToSign: Record<string, string | number | boolean> = {
    timestamp,
    folder,
    tags: "draft",
    overwrite: true,
  };

  if (public_id) {
    paramsToSign.public_id = public_id;
    paramsToSign.use_filename = true;
    paramsToSign.unique_filename = false;
  }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
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