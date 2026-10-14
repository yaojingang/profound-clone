import Link from "next/link";

export const metadata = { title: "Page not found | Profound" };

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <div className="flex items-center gap-2.5">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 1l2.2 6.8L19 10l-6.8 2.2L10 19l-2.2-6.8L1 10l6.8-2.2L10 1z" fill="white" />
        </svg>
        <span className="text-[15px] font-semibold tracking-tight">Profound</span>
      </div>
      <p className="mt-10 text-[64px] font-semibold leading-none tracking-tight">404</p>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-zinc-400">
        This page could not be found. It may have moved, or the link is out of date.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/" className="rounded-full bg-white px-5 py-2.5 text-[13.5px] font-medium text-black hover:opacity-85">
          Back to home
        </Link>
        <Link href="/app" className="rounded-full border border-white/20 px-5 py-2.5 text-[13.5px] font-medium text-white hover:bg-white/10">
          Open dashboard
        </Link>
      </div>
      <p className="mt-16 text-[11px] text-zinc-600">Educational local replica. Not affiliated with Profound Inc.</p>
    </main>
  );
}
