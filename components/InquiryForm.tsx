"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/config";

export default function InquiryForm() {
  const [work, setWork] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const w = new URLSearchParams(window.location.search).get("work");
    if (w) {
      setWork(w);
      setMessage(
        `I'm interested in "${w}". Could you tell me more about its availability and price?`
      );
    }
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = work ? `Inquiry — ${work}` : "Inquiry — The Huke Collection";
    const body = [
      message.trim(),
      "",
      name.trim() ? `— ${name.trim()}` : "",
      email.trim() ? `Reply to: ${email.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full border-b border-hairline bg-transparent py-3 text-ink placeholder:text-faint focus:border-ink focus:outline-none transition-colors";

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      {work && (
        <div className="border border-hairline bg-surface px-4 py-3">
          <p className="text-[0.66rem] uppercase tracking-[0.2em] text-faint">Regarding</p>
          <p className="mt-1 font-display text-lg italic">{work}</p>
        </div>
      )}

      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="text-[0.66rem] uppercase tracking-[0.2em] text-faint">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-[0.66rem] uppercase tracking-[0.2em] text-faint">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-[0.66rem] uppercase tracking-[0.2em] text-faint">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you'd like to know…"
          className={`${field} resize-none`}
        />
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="inline-flex items-center justify-center bg-ink px-8 py-4 text-[0.72rem] uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent"
        >
          Send inquiry
        </button>
        <p className="text-xs text-faint">
          Opens your email app. Or write us directly at{" "}
          <a href={`mailto:${site.email}`} className="link-underline text-muted hover:text-ink">
            {site.email}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
