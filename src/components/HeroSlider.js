"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css/effect-fade";
import StudioImage from "@/components/StudioImage";

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`;

const SLIDES = [
  { img: U("photo-1516035069371-29a1b244cc32"), title: "Find the room your next shoot deserves", text: "Cyc walls, natural-light lofts and product studios, booked by the hour from the people who run them." },
  { img: U("photo-1478737270239-2f02b77fc618"), title: "Press record in a room that sounds right", text: "Podcast lounges and recording suites with treated walls, real microphones and zero setup stress." },
  { img: U("photo-1485846234645-a62644f84728"), title: "Rent a full sound stage, not a whole studio lot", text: "Lighting grids, green screens and dolly track for short films, music videos and commercials." },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured studio types" className="relative">
      <Swiper modules={[Autoplay, EffectFade, Pagination]} effect="fade" autoplay={{ delay: 5500, disableOnInteraction: false }} pagination={{ clickable: true }} loop className="hero-swiper h-[34rem] md:h-[40rem]">
        {SLIDES.map((s, i) => (
          <SwiperSlide key={i} className="relative !h-full">
            <div className="absolute inset-0 bg-neutral"><StudioImage src={s.img} alt="" /></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
            <div className="wrap relative flex h-full items-center">
              <div className="max-w-2xl pb-8 text-white">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1 text-sm backdrop-blur"><span className="tally" /> Studios open for booking now</p>
                <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">{s.title}</h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{s.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                  <Link href="/add-studio" className="btn border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:border-white/60">Host Your Space</Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
