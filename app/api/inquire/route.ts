import { NextResponse } from "next/server";
import { site } from "@/lib/config";

// Inquiry destination — server-side only, never shipped to the browser.
const DEST = "rhuke@me.com";

type Body = {
  name?: string;
  email?: string;
  message?: string;
  work?: string;
  image?: string;
  company?: string; // honeypot — real users never fill this
  elapsed?: number; // ms the form was open before submit (time-trap)
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();
  const work = (body.work || "").trim();
  const image = (body.image || "").trim();

  // Bot traps: honeypot filled, or submitted implausibly fast. Return success so
  // bots learn nothing, but never forward the message.
  if ((body.company || "").trim() !== "" || Number(body.elapsed || 0) < 2500) {
    return NextResponse.json({ ok: true });
  }

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!name || !emailOk || !message) {
    return NextResponse.json(
      { ok: false, error: "Please add your name, a valid email, and a message." },
      { status: 422 }
    );
  }

  const absImage = image
    ? /^https?:/i.test(image)
      ? image
      : `${site.url}${image.startsWith("/") ? "" : "/"}${image}`
    : "";

  // FormSubmit forwards to DEST with no account/API key. First submission triggers
  // a one-time activation email to DEST (click once to enable delivery).
  const payload = {
    name,
    email,
    message,
    Artwork: work || "(general inquiry)",
    Image: absImage || "(none)",
    _subject: `Huke Collection inquiry${work ? " — " + work : ""}`,
    _template: "table",
    _captcha: "false",
  };

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(DEST)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data: { success?: string | boolean } = await res.json().catch(() => ({}));
    if (res.ok && (data.success === "true" || data.success === true)) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: "Couldn't send right now — please try again in a moment." },
      { status: 502 }
    );
  } catch {
    return NextResponse.json({ ok: false, error: "Network error — please try again." }, { status: 502 });
  }
}
