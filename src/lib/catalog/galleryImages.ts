export function uniqueGalleryImages(
  images: Array<string | null | undefined>
): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const image of images) {
    if (!image || seen.has(image)) continue
    seen.add(image)
    out.push(image)
  }
  return out
}
