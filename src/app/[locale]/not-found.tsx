"use client";

import { Link } from "@/lib/i18n/routing";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="label mb-6">Error 404</p>
      <h1 className="font-display text-6xl font-light text-pearl md:text-8xl">
        Page <span className="title-italic font-semibold">not found</span>
      </h1>
      <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-slate">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back to exploring Dubai properties.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-gold rounded-[2px]">
          Return home
        </Link>
        <Link href="/properties" className="btn-outline rounded-[2px]">
          Browse properties
        </Link>
      </div>
    </div>
  );
}
