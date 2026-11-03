import Link from "next/link";
import { FiCamera, FiMic, FiUsers, FiMapPin } from "react-icons/fi";

export const metadata = { title: "About Us" };

const VALUES = [
  { icon: FiCamera, title: "Creators first", text: "Every feature starts with one question: does this get someone behind a camera or microphone faster?" },
  { icon: FiUsers, title: "Fair to hosts", text: "Hosts set their own rates and approve every request. No hidden fees on their side of the booking." },
  { icon: FiMic, title: "Honest listings", text: "Photos, gear lists and capacity limits are shown up front so there are no surprises on shoot day." },
  { icon: FiMapPin, title: "Built locally", text: "We start with the cities that have the most unused studio hours and grow from there." },
];

export default function About() {
  return (
    <>
      <section className="wrap page-pad">
        <h1 className="section-title max-w-3xl">We built StudioSpace because great rooms were sitting empty</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <p className="leading-relaxed text-base-content/80">Photographers, podcasters, filmmakers and musicians spend hours phoning around for a space that fits their budget. Meanwhile, studio owners leave most of their weekday hours unbooked. StudioSpace puts both sides in one marketplace with clear prices, live availability and a booking flow that respects everyone's time.</p>
          <p className="leading-relaxed text-base-content/80">Hosts list their cyc walls, sound stages, recording suites and workshops. Creators browse, request a slot and get a confirmed booking. When a host confirms a session, that time is blocked so double-bookings never happen.</p>
        </div>
      </section>
      <section className="border-y border-base-300 bg-base-100">
        <div className="wrap page-pad">
          <h2 className="section-title">What we stand for</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="card-surface h-full bg-base-200 p-6">
                <v.icon size={26} className="text-primary" />
                <h3 className="mt-4 font-display text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap page-pad text-center">
        <h2 className="section-title">Have a studio or a project?</h2>
        <p className="section-sub mx-auto">Join the creators and hosts already using StudioSpace.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn btn-primary">Create an account</Link>
          <Link href="/studios" className="btn btn-outline">Explore Studios</Link>
        </div>
      </section>
    </>
  );
}
