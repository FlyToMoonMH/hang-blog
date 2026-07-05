function isAbsoluteOrExternalSrc(src: string): boolean {
  return (
    src.startsWith("/") ||
    src.startsWith("#") ||
    src.startsWith("data:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  );
}

export function resolvePostAssetSrc(src: string, postSlug?: string): string {
  if (!src || isAbsoluteOrExternalSrc(src) || !postSlug) {
    return src;
  }

  const normalizedSrc = src.startsWith("./") ? src.slice(2) : src;
  return `/images/posts/${postSlug}/${normalizedSrc}`;
}
