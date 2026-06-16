"use client";

import { useState } from "react";

export default function ShareButtons({
  url,
  image,
  title,
}: {
  url: string;
  image?: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  const pin = `https://www.pinterest.com/pin/create/button/?url=${enc(url)}&media=${enc(
    image || ""
  )}&description=${enc(title)}`;
  const x = `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`;

  const open = (href: string) =>
    window.open(href, "_blank", "noopener,noreferrer,width=660,height=620");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const btn = "link-underline transition-colors hover:text-ink";

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.72rem] uppercase tracking-[0.18em] text-muted">
      <span className="text-faint">Share</span>
      <button type="button" onClick={() => open(pin)} className={btn}>Pinterest</button>
      <button type="button" onClick={() => open(fb)} className={btn}>Facebook</button>
      <button type="button" onClick={() => open(x)} className={btn}>X</button>
      <button type="button" onClick={copy} className={btn}>{copied ? "Copied ✓" : "Copy link"}</button>
    </div>
  );
}
