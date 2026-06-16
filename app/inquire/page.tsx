import type { Metadata } from "next";
import InquiryForm from "@/components/InquiryForm";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Inquire",
  description:
    "Inquire about acquiring a work by Randy Huke or John Huke — request prices, dimensions, and availability, or arrange a viewing.",
  alternates: { canonical: "/inquire" },
};

export default function InquirePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <p className="eyebrow">Inquiries &amp; Acquisitions</p>
      <h1 className="mt-4 font-display text-5xl sm:text-6xl">Inquire</h1>
      <p className="mt-6 max-w-xl leading-relaxed text-muted">
        Whether you&rsquo;re interested in acquiring a work, requesting prices and
        dimensions, or arranging a viewing, we&rsquo;d love to hear from you. Tell us a
        little about what you&rsquo;re looking for and we&rsquo;ll be in touch.
      </p>

      <div className="mt-12">
        <InquiryForm />
      </div>

      <div className="mt-16 border-t border-hairline pt-8 text-muted">
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">Contact</p>
        <p className="mt-3">{site.location}</p>
        <p className="mt-1 text-sm text-faint">
          Messages go straight to the family. We read every one.
        </p>
      </div>
    </div>
  );
}
