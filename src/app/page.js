"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiSearch, FiClock, FiCheckCircle, FiVideo, FiShield, FiUserCheck, FiTool, FiHeadphones } from "react-icons/fi";
import HeroSlider from "@/components/HeroSlider";
import StudioCard from "@/components/StudioCard";
import CategoryIcon from "@/components/CategoryIcon";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { CATEGORY_CARDS } from "@/lib/constants";

const STEPS = [
  { icon: FiSearch, title: "Discover spaces", text: "Filter by category, city, price and amenities to shortlist rooms that fit the shoot." },
  { icon: FiClock, title: "Select shoot hours", text: "Pick a date, a start time and how long you need. The total updates as you choose." },
  { icon: FiCheckCircle, title: "Book instantly", text: "Send your request in one click. The host confirms and your slot is locked." },
  { icon: FiVideo, title: "Create and produce", text: "Arrive, set up and shoot. Download your invoice when the session is confirmed." },
];

const GUARANTEES = [
  { icon: FiShield, title: "Liability protection", text: "Every confirmed session is covered by our host and guest damage terms." },
  { icon: FiUserCheck, title: "Verified profiles", text: "Hosts and creators sign in with a verified account before they can book or list." },
  { icon: FiTool, title: "Equipment safety", text: "Listings state exactly what gear is included, and deposits protect both sides." },
  { icon: FiHeadphones, title: "24/7 host support", text: "A real person answers when a door will not open or a light will not turn on." },
];

export default function Home() {
  const [studios, setStudios] = useState(null);
  const [error, setError] = useState("");
  const [counts, setCounts] = useState({});

  useEffect(() => {
    api("/studios/featured").then((d) => setStudios(d.studios)).catch((e) => { setError(e.message); setStudios([]); });
    api("/studios/stats/categories").then(setCounts).catch(() => {});
  }, []);

  return (
    <>
      <HeroSlider />

      <section className="wrap page-pad">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Featured studios</h2>
            <p className="section-sub">The highest-rated and newest spaces on StudioSpace right now.</p>
          </div>
          <Link href="/studios" className="btn btn-outline btn-sm">See all studios</Link>
        </div>
        <div className="mt-8">
          {studios === null ? <GridSkeleton count={6} /> : studios.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{studios.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
          ) : (
            <EmptyState icon={FiSearch} title={error ? "We could not load studios" : "No studios listed yet"} text={error || "Be the first to list a space and start earning from your studio hours."} href="/add-studio" cta="Host Your Space" />
          )}
        </div>
      </section>

      <section className="border-y border-base-300 bg-base-100">
        <div className="wrap page-pad">
          <h2 className="section-title">Browse by studio category</h2>
          <p className="section-sub">Jump straight to the kind of room you need.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORY_CARDS.map((c) => (
              <Link key={c.value} href={`/studios?category=${encodeURIComponent(c.value)}`} className="group flex h-full flex-col rounded-box border border-base-300 bg-base-200 p-5 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-primary-content transition group-hover:scale-105"><CategoryIcon name={c.icon} /></span>
                <h3 className="mt-4 font-display text-lg font-bold">{c.label}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-base-content/70">{c.blurb}</p>
                <p className="mt-4 text-sm font-medium text-primary">{counts[c.value] ?? 0} {counts[c.value] === 1 ? "studio" : "studios"}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap page-pad">
        <h2 className="section-title">How booking works</h2>
        <p className="section-sub">From first search to first take in four steps.</p>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card-surface relative h-full p-6">
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-base-content/10">{i + 1}</span>
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-secondary text-secondary-content"><s.icon size={22} /></span>
              <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-base-content/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-neutral text-neutral-content">
        <div className="wrap page-pad">
          <h2 className="section-title">Host guarantee and creator support</h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-neutral-content/70">Book and host with confidence. These protections come with every listing and every booking.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map((g) => (
              <div key={g.title} className="h-full rounded-box border border-neutral-content/15 p-6">
                <g.icon size={26} className="text-secondary" />
                <h3 className="mt-4 font-display text-lg font-bold">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-content/70">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
