import { resolvePostAssetSrc } from "@/lib/post-assets";
import { NoteImage } from "./NoteImage";

export function createPostMdxComponents(postAssetBasePath: string) {
  return {
    img: ({
      src,
      alt = "",
      ...props
    }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        {...props}
        src={
          typeof src === "string"
            ? resolvePostAssetSrc(src, postAssetBasePath)
            : undefined
        }
        alt={alt}
      />
    ),
    NoteImage: (props: React.ComponentProps<typeof NoteImage>) => (
      <NoteImage {...props} postAssetBasePath={postAssetBasePath} />
    ),
  };
}
