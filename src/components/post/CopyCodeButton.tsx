"use client";

import { useEffect, useState } from "react";

export function CopyCodeButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Inject copy buttons into all code blocks
    const codeBlocks = document.querySelectorAll("pre");

    codeBlocks.forEach((pre) => {
      // Skip if already has a button
      if (pre.querySelector(".copy-code-btn")) return;

      // Make pre relative for absolute positioning
      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.className = "copy-code-btn";
      btn.setAttribute("aria-label", "复制代码");
      btn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span>复制</span>
      `;

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
        btn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>已复制</span>
        `;
        btn.classList.add("copied");
        setTimeout(() => {
          btn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>复制</span>
          `;
          btn.classList.remove("copied");
        }, 2000);
      });

      pre.appendChild(btn);
    });

    return () => {
      // Cleanup is handled by the mutation above; buttons persist across re-renders
    };
  }, []);

  return null;
}
