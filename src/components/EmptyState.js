import Link from "next/link";

export default function EmptyState({ icon: Icon, title, text, href, cta, onCta, ctaLabel }) {
  return (
    <div className="card-surface mx-auto grid max-w-xl place-items-center px-6 py-14 text-center">
      {Icon && <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary"><Icon size={26} /></span>}
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-base-content/70">{text}</p>
      {href && <Link href={href} className="btn btn-primary mt-6">{cta}</Link>}
      {onCta && <button onClick={onCta} className="btn btn-primary mt-6">{ctaLabel}</button>}
    </div>
  );
}
