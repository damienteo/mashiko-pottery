import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  const body = await req.json();

  // Accept either a flat payload or a nested { paramsToSign: {...} } shape
  const raw: Record<string, unknown> = body?.paramsToSign
    ? { ...body.paramsToSign, ...body }
    : { ...body };
  delete raw.paramsToSign; // avoid signing the wrapper key

  // Build paramsToSign by filtering out non-signable keys
  const paramsToSign: Record<string, string | number> = {};
  for (const key of Object.keys(raw)) {
    if (
      key === "file" ||
      key === "api_key" ||
      key === "signature" ||
      key === "cloud_name" ||
      key === "resource_type"
    ) {
      continue;
    }

    let val = raw[key];
    if (val === null || val === undefined) continue;

    if (Array.isArray(val)) {
      val = val.join(",");
    } else if (typeof val === "boolean") {
      val = val ? "true" : "false";
    } else if (typeof val === "object") {
      // Ignore nested objects; the widget sometimes nests things under paramsToSign only
      // Any nested structure should already have been flattened into `raw` above
      continue;
    } else if (typeof val === "string") {
      val = val.trim();
      if (val === "") continue;
    }

    paramsToSign[key] = val as string | number;
  }

  // Ensure a single timestamp in seconds; prefer a provided one if present
  if (paramsToSign.timestamp == null) {
    paramsToSign.timestamp = Math.round(Date.now() / 1000);
  } else {
    const ts =
      typeof paramsToSign.timestamp === "string"
        ? parseInt(paramsToSign.timestamp as string, 10)
        : Number(paramsToSign.timestamp);
    paramsToSign.timestamp = ts > 9_999_999_999 ? Math.floor(ts / 1000) : ts;
  }

  // Dev-only: log the exact string we are signing
  const stringToSign = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k as keyof typeof paramsToSign]}`)
    .join("&");
  console.log("[cloudinary] string_to_sign:", stringToSign);
  console.log("[cloudinary] params:", paramsToSign);

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    (process.env.CLOUDINARY_API_SECRET || "").trim(),
  );

  return NextResponse.json({
    ...paramsToSign,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
}
