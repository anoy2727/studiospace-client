import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[70vh] place-items-center py-16">
      <div className="max-w-lg text-center">
        <svg viewBox="0 0 320 220" className="mx-auto w-72" role="img" aria-label="A clapperboard lying on an empty studio floor">
          <ellipse cx="160" cy="196" rx="120" ry="12" fill="currentColor" opacity=".12" />
          <g transform="rotate(-8 160 120)">
            <rect x="70" y="92" width="180" height="90" rx="8" fill="oklch(var(--n))" />
            <rect x="70" y="62" width="180" height="26" rx="6" fill="oklch(var(--n))" stroke="oklch(var(--b1))" strokeWidth="2" />
            <g fill="oklch(var(--b1))">
              <polygon points="84,64 108,64 96,88 72,88" /><polygon points="118,64 142,64 130,88 106,88" />
              <polygon points="152,64 176,64 164,88 140,88" /><polygon points="186,64 210,64 198,88 174,88" />
              <polygon points="220,64 244,64 232,88 208,88" />
            </g>
            <text x="160" y="148" textAnchor="middle" fontSize="38" fontWeight="800" fill="oklch(var(--p))" fontFamily="sans-serif">404</text>
          </g>
          <circle cx="262" cy="46" r="9" fill="#ff3b3b" />
        </svg>
        <h1 className="mt-6 font-display text-4xl font-bold">This scene was cut</h1>
        <p className="mt-3 text-base-content/70">The page you are looking for is not on our call sheet. It may have moved, or the link may be wrong.</p>
        <Link href="/" className="btn btn-primary mt-7">Return to Home</Link>
      </div>
    </section>
  );
}
