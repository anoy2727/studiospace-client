"use client";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import Logo from "@/components/Logo";
import { CATEGORY_CARDS } from "@/lib/constants";

export default function Footer() {
  const [email, setEmail] = useState("");
  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Enter a valid email address to subscribe.");
    toast.success("You are on the list. Watch your inbox for new studios.");
    setEmail("");
  };
  const social = [
    { Icon: FaXTwitter, label: "X", href: "https://x.com" },
    { Icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
    { Icon: FaYoutube, label: "YouTube", href: "https://youtube.com" },
    { Icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
  ];
  return (
    <footer className="mt-16 border-t border-base-300 bg-neutral text-neutral-content">
      <div className="wrap grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className="text-neutral-content" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-content/70">
            Our mission is simple: put every creator within reach of a great room. Book photo studios, sound stages and recording suites by the hour, straight from the people who run them.
          </p>
          <div className="mt-5 flex gap-2">
            {social.map(({ Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-9 w-9 place-items-center rounded-full border border-neutral-content/20 transition hover:bg-primary hover:text-primary-content">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">Quick links</h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-content/70">
            <li><Link className="hover:text-primary" href="/">Home</Link></li>
            <li><Link className="hover:text-primary" href="/studios">Explore Studios</Link></li>
            <li><Link className="hover:text-primary" href="/how-it-works">How It Works</Link></li>
            <li><Link className="hover:text-primary" href="/about">About Us</Link></li>
            <li><Link className="hover:text-primary" href="/add-studio">Host Your Space</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">Popular categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-content/70">
            {CATEGORY_CARDS.map((c) => (
              <li key={c.value}><Link className="hover:text-primary" href={`/studios?category=${encodeURIComponent(c.value)}`}>{c.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">New studios, in your inbox</h3>
          <p className="mt-4 text-sm text-neutral-content/70">One short email when new spaces open near you.</p>
          <form onSubmit={subscribe} className="mt-4 flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" aria-label="Email address" className="input input-sm h-10 w-full bg-base-100 text-base-content" />
            <button className="btn btn-primary btn-sm h-10">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="border-t border-neutral-content/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-5 text-xs text-neutral-content/60 sm:flex-row">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>By using StudioSpace you agree to our Terms of Use and Privacy Policy.</p>
        </div>
      </div>
    </footer>
  );
}
