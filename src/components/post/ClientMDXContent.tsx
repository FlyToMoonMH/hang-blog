"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { CopyCodeButton } from "./CopyCodeButton";
import { createPostMdxComponents } from "./post-mdx-components";

export function ClientMDXContent({
  source,
  postAssetBasePath,
}: {
  source: MDXRemoteSerializeResult;
  postAssetBasePath: string;
}) {
  return (
    <>
      <MDXRemote
        {...source}
        components={createPostMdxComponents(postAssetBasePath)}
      />
      <CopyCodeButton trigger={source.compiledSource} />
    </>
  );
}
