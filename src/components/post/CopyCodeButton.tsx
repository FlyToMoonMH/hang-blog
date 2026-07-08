"use client";

import { useEffect } from "react";

function createDefaultMarkup() {
  return `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <span>复制</span>
  `;
}

function createSuccessMarkup() {
  return `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>已复制</span>
  `;
}

export function CopyCodeButton({ trigger }: { trigger?: string | null }) {
  useEffect(() => {
    function enhanceCodeBlocks(root: ParentNode = document) {
      const codeBlocks = root.querySelectorAll("pre");

      codeBlocks.forEach((pre) => {
        if (pre.querySelector(".copy-code-btn")) return;

        let wrapper = pre.parentElement?.classList.contains("code-block-wrapper")
          ? pre.parentElement
          : null;

        if (wrapper?.querySelector(".copy-code-btn")) return;

        if (!wrapper) {
          wrapper = document.createElement("div");
          wrapper.className = "code-block-wrapper";
          pre.before(wrapper);
          wrapper.appendChild(pre);
        }

        const btn = document.createElement("button");
        btn.className = "copy-code-btn";
        btn.setAttribute("aria-label", "复制代码");
        btn.innerHTML = createDefaultMarkup();

        btn.addEventListener("click", async () => {
          const code = pre.querySelector("code");
          if (!code) return;

          const text = code.textContent || "";

          try {
            await navigator.clipboard.writeText(text);
          } catch {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
          }

          btn.innerHTML = createSuccessMarkup();
          btn.classList.add("copied");

          setTimeout(() => {
            btn.innerHTML = createDefaultMarkup();
            btn.classList.remove("copied");
          }, 2000);
        });

        wrapper.appendChild(btn);
      });
    }

    enhanceCodeBlocks();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;

          if (node.matches("pre")) {
            enhanceCodeBlocks(node.parentElement ?? document);
            return;
          }

          enhanceCodeBlocks(node);
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [trigger]);

  return null;
}
