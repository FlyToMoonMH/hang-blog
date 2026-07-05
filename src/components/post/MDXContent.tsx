import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxOptions } from "@/lib/mdx";
import { resolvePostAssetSrc } from "@/lib/post-assets";
import { CopyCodeButton } from "./CopyCodeButton";
import { NoteImage } from "./NoteImage";

function createComponents(postSlug: string) {
  return {
    img: ({ src, alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img
        {...props}
        src={typeof src === "string" ? resolvePostAssetSrc(src, postSlug) : undefined}
        alt={alt}
      />
    ),
    NoteImage: (props: React.ComponentProps<typeof NoteImage>) => (
      <NoteImage {...props} postSlug={postSlug} />
    ),
  };
}

export function MDXContent({ source, postSlug }: { source: string; postSlug: string }) {
  return (
    <>
      <MDXRemote
        source={source}
        options={{ mdxOptions }}
        components={createComponents(postSlug)}
      />
      <CopyCodeButton />
    </>
  );
}
