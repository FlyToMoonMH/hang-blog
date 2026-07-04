import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxOptions } from "@/lib/mdx";
import { CopyCodeButton } from "./CopyCodeButton";
import { NoteImage } from "./NoteImage";

const components = {
  NoteImage,
};

export function MDXContent({ source }: { source: string }) {
  return (
    <>
      <MDXRemote source={source} options={{ mdxOptions }} components={components} />
      <CopyCodeButton />
    </>
  );
}
