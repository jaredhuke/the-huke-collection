"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type Status = "idle" | "sending" | "sent" | "error";

export default function InquiryForm() {
  const [work, setWork] = useState("");
  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
    const q = new URLSearchParams(window.location.search);
    const w = q.get("work");
    const i = q.get("img");
    if (w) {
      setWork(w);
      setMessage(`I'm interested in "${w}". Could you tell me more about its availability and price?`);
    }
    if (i) setImg(i);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, message, work, image: img, company,
          elapsed: Date.now() - mountedAt.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) setStatus("sent");
      else {
        setStatus("error");
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className="border border-hairline bg-surface px-8 py-12 text-center">
        <p className="font-display text-3xl">Thank you.</p>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          Your message is on its way. We&rsquo;ll be in touch soon.
        </p>
      </div>
    );
  }

  const field =
    "w-full border-b border-hairline bg-transparent py-3 text-ink placeholder:text-faint focus:border-ink focus:outline-none transition-colors";

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {work && (
        <div className="flex items-center gap-4 border border-hairline bg-surface p-3">
          {img && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-bg">
              <Image src={img} alt={work} fill sizes="64px" className="object-cover" />
            </div>
          )}
          <div>
            <p className="text-[0.66rem] uppercase tracking-[0.2em] text-faint">Regarding</p>
            <p className="mt-1 font-display text-lg italic">{work}</p>
          </div>
        </div>
      )}

      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.66rem] uppercase tracking-[0.2em] text-faint">Name</span>
          <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="text-[0.66rem] uppercase tracking-[0.2em] text-faint">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={field} />
        </label>
      </div>

      <label className="block">
        <span className="text-[0.66rem] uppercase tracking-[0.2em] text-faint">Message</span>
        <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you'd like to know…" className={`${field} resize-none`} />
      </label>

      {/* Honeypot — hidden from people, catnip for bots */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label>
          Company
          <input
            type="text" tabIndex={-1} autoComplete="off"
            value={company} onChange={(e) => setCompany(e.target.value)}
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 bg-ink px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send inquiry"}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
        {status === "error" && <p className="text-sm text-accent">{error}</p>}
      </div>
    </form>
  );
}
