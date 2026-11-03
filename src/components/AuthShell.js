import Logo from "@/components/Logo";

export default function AuthShell({ title, subtitle, children, aside }) {
  return (
    <section className="wrap grid min-h-[78vh] items-center gap-10 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <div className="relative overflow-hidden rounded-box bg-neutral p-10 text-neutral-content">
          <span className="tally absolute right-6 top-6" />
          <Logo className="text-neutral-content" />
          <h2 className="mt-12 font-display text-4xl font-extrabold leading-tight">{aside.title}</h2>
          <p className="mt-4 max-w-md leading-relaxed text-neutral-content/75">{aside.text}</p>
          <ul className="mt-8 space-y-3 text-sm text-neutral-content/85">
            {aside.points.map((p) => <li key={p} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />{p}</li>)}
          </ul>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="card-surface p-7 sm:p-8">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-base-content/70">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </section>
  );
}
