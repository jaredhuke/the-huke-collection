import Link from "next/link";
import { site } from "@/lib/config";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-hairline bg-surface">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="eyebrow">The</p>
            <p className="font-display text-3xl leading-tight">Huke Collection</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              The paintings, works on paper, and sculpture of Randy Huke and John
              Huke (1948&ndash;2016).
            </p>
          </div>

          <nav className="flex flex-col gap-2 text-sm">
            <p className="eyebrow mb-2">Explore</p>
            <Link className="link-underline w-fit text-muted hover:text-ink" href="/works">Works</Link>
            <Link className="link-underline w-fit text-muted hover:text-ink" href="/about">The Artists</Link>
            <Link className="link-underline w-fit text-muted hover:text-ink" href="/inquire">Inquire</Link>
          </nav>

          <div className="flex flex-col gap-2 text-sm">
            <p className="eyebrow mb-2">Contact</p>
            <a className="link-underline w-fit text-muted hover:text-ink" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p className="text-muted">{site.location}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-hairline pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} The Huke Collection. All works &copy; the artists and their estate.</p>
          <p>Austin, Texas</p>
        </div>
      </div>
    </footer>
  );
}
