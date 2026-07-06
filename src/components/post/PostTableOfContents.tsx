"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/types";
import { POST_UNLOCKED_EVENT, type PostUnlockedDetail } from "./post-events";
import { TableOfContents } from "./TableOfContents";

interface PostTableOfContentsProps {
  items: TocItem[];
  unlockSlug?: string;
}

export function PostTableOfContents({
  items,
  unlockSlug,
}: PostTableOfContentsProps) {
  const [visible, setVisible] = useState(!unlockSlug);

  useEffect(() => {
    if (!unlockSlug) {
      setVisible(true);
      return;
    }

    setVisible(false);

    function handleUnlocked(event: Event) {
      const customEvent = event as CustomEvent<PostUnlockedDetail>;
      if (customEvent.detail?.slug === unlockSlug) {
        setVisible(true);
      }
    }

    window.addEventListener(POST_UNLOCKED_EVENT, handleUnlocked as EventListener);
    return () => {
      window.removeEventListener(
        POST_UNLOCKED_EVENT,
        handleUnlocked as EventListener
      );
    };
  }, [unlockSlug]);

  if (!visible) return null;

  return <TableOfContents items={items} />;
}
