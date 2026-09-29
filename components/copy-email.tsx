"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const noSubscribe = () => () => {};

/**
 * Copies the address for a Visitor who writes from a webmail tab rather than
 * a mail app, and says so in place. Hidden until hydration: without script
 * there is nothing to copy with, and the mailto link still works.
 */
export function CopyEmail({ email }: { email: string }) {
  const ready = useSyncExternalStore(
    noSubscribe,
    () => Boolean(navigator.clipboard),
    () => false,
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(id);
  }, [copied]);

  if (!ready) return null;

  return (
    <button
      type="button"
      className={copied ? "copy done" : "copy"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
    >
      <svg viewBox="0 0 16 16" aria-hidden="true">
        {copied ? (
          <path d="M3 8.5 6.5 12 13 4.5" />
        ) : (
          <>
            <rect x="5.5" y="5.5" width="8" height="8" />
            <path d="M10.5 5.5v-3h-8v8h3" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}
