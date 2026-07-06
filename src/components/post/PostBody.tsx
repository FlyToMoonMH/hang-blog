import { POST_CONTENT_CLASSNAME } from "./post-layout";

export function PostBody({ children }: { children: React.ReactNode }) {
  return <article className={POST_CONTENT_CLASSNAME}>{children}</article>;
}
