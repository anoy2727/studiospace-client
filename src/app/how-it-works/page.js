import Link from "next/link";
import { FiSearch, FiClock, FiCheckCircle, FiVideo, FiHome, FiList, FiInbox, FiDollarSign } from "react-icons/fi";

export const metadata = { title: "How It Works" };

const CREATOR = [
  { icon: FiSearch, title: "Discover spaces", text: "Search by name, city or amenity, then filter by category, price and rating." },
  { icon: FiClock, title: "Select shoot hours", text: "Choose a date, a start time and a duration. Your total updates instantly." },
  { icon: FiCheckCircle, title: "Book instantly", text: "Send a request in one click. Once the host confirms, the slot is locked and no one else can book it." },
  { icon: FiVideo, title: "Create and produce", text: "Show up, shoot, record or teach. Download a PDF invoice for any confirmed session." },
];
const HOST = [
  { icon: FiHome, title: "List your space", text: "Add photos, amenities, your hourly rate and a security deposit." },
  { icon: FiInbox, title: "Review requests", text: "Every request arrives on your dashboard with the guest, time and total." },
  { icon: FiList, title: "Confirm your calendar", text: "Confirming a slot blocks overlapping requests so you never get double-booked." },
  { icon: FiDollarSign, title: "Get paid for idle hours", text: "Mark sessions completed and track what each studio earns." },
];

function Track({ title, intro, steps }) {
  return (
    <section className="wrap page-pad">
      <h2 className="section-title">{title}</h2>
      <p className="section-sub">{intro}</p>
      <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.title} className="card-surface h-full p-6">
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-primary-content"><s.icon size={22} /></span>
              <span className="font-display text-4xl font-extrabold text-base-content/10">{i + 1}</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-base-content/70">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function HowItWorks() {
  return (
    <>
      <section className="bg-neutral text-neutral-content">
        <div className="wrap py-16 md:py-20">
          <h1 className="max-w-3xl font-display text-4xl font-extrabold leading-tight md:text-5xl">Booking a studio should take minutes, not a week of emails</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-neutral-content/75">StudioSpace connects creators who need a room with hosts who have one sitting empty. Here is how it works on both sides.</p>
        </div>
      </section>
      <Track title="For creators" intro="Find, book and shoot without chasing quotes." steps={CREATOR} />
      <div className="border-y border-base-300 bg-base-100"><Track title="For hosts" intro="Turn empty hours into income and stay in control of your calendar." steps={HOST} /></div>
      <section className="wrap page-pad text-center">
        <h2 className="section-title">Ready for your first session?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
          <Link href="/add-studio" className="btn btn-outline">Host Your Space</Link>
        </div>
      </section>
    </>
  );
}
