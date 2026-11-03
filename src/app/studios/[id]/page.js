"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiHeart, FiMapPin, FiUsers, FiShield } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import StudioImage from "@/components/StudioImage";
import { RatingBadge, StarRow } from "@/components/Stars";
import BookingModal from "@/components/BookingModal";
import Avatar from "@/components/Avatar";
import EmptyState from "@/components/EmptyState";
import { PageSpinner } from "@/components/Skeletons";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { money } from "@/lib/constants";

export default function StudioDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { user, wishlist, toggleWishlist } = useAuth();
  const [studio, setStudio] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [missing, setMissing] = useState(false);
  const [open, setOpen] = useState(false);
  const [rv, setRv] = useState({ rating: 5, comment: "" });
  const [posting, setPosting] = useState(false);

  const load = () => {
    api(`/studios/${id}`).then((d) => setStudio(d.studio)).catch(() => setMissing(true));
    api(`/studios/${id}/reviews`).then((d) => setReviews(d.reviews)).catch(() => {});
  };
  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (missing) return <div className="wrap page-pad"><EmptyState title="Studio not found" text="This listing may have been removed by its host." href="/studios" cta="Explore Studios" /></div>;
  if (!studio) return <PageSpinner label="Loading studio" />;

  const mine = user?.email === studio.ownerEmail;
  const images = [...new Set([studio.imageUrl, ...(studio.gallery || [])].filter(Boolean))];
  const saved = wishlist.includes(String(studio._id));

  const book = () => {
    if (!user) {
      toast("Log in to book this studio.", { icon: "🔒" });
      return router.push(`/login?redirect=/studios/${id}`);
    }
    if (mine) return toast.error("You cannot book your own studio.");
    setOpen(true);
  };
  const heart = async () => {
    if (!user) return router.push(`/login?redirect=/studios/${id}`);
    try {
      toast.success((await toggleWishlist(String(studio._id))) ? "Saved to your wishlist." : "Removed from your wishlist.");
    } catch (e) { toast.error(e.message); }
  };
  const postReview = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api(`/studios/${id}/reviews`, { method: "POST", body: rv });
      toast.success("Thanks! Your review is live.");
      setRv({ rating: 5, comment: "" });
      load();
    } catch (err) { toast.error(err.message); }
    finally { setPosting(false); }
  };

  return (
    <div className="wrap page-pad">
      <nav className="mb-5 text-sm text-base-content/60" aria-label="Breadcrumb"><Link href="/studios" className="hover:text-primary">Studios</Link> / <span>{studio.category}</span></nav>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable: true }} className="gallery-swiper aspect-[16/10] w-full overflow-hidden rounded-box bg-base-300">
            {images.map((src, i) => <SwiperSlide key={i}><StudioImage src={src} alt={`${studio.title} photo ${i + 1}`} /></SwiperSlide>)}
          </Swiper>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge badge-neutral py-3">{studio.category}</span>
              <RatingBadge rating={studio.rating} count={studio.reviewCount} />
              {studio.reviewCount > 0 && <span className="text-sm text-base-content/60">{studio.reviewCount} reviews</span>}
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold md:text-4xl">{studio.title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-base-content/70">
              <span className="inline-flex items-center gap-1.5"><FiMapPin /> {studio.location}</span>
              <span className="inline-flex items-center gap-1.5"><FiUsers /> Up to {studio.maxCapacity} people</span>
            </p>
          </div>

          <section>
            <h2 className="font-display text-2xl font-bold">About this space</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-base-content/80">{studio.overview}</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">Amenities</h2>
            {studio.amenities?.length ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((a) => <li key={a} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-success/15 text-success"><FiCheck size={14} /></span>{a}</li>)}
              </ul>
            ) : <p className="mt-3 text-base-content/70">The host has not listed amenities for this space.</p>}
          </section>

          <section className="card-surface flex items-center gap-4 p-5">
            <Avatar user={{ name: studio.ownerName }} size={52} />
            <div className="min-w-0">
              <p className="text-sm text-base-content/60">Hosted by</p>
              <p className="font-display text-lg font-bold">{studio.ownerName}</p>
              <p className="truncate text-sm text-base-content/70">{studio.ownerEmail}</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl font-bold">Reviews</h2>
            {reviews.length ? (
              <ul className="mt-4 space-y-4">
                {reviews.map((r) => (
                  <li key={r._id} className="card-surface flex gap-4 p-4">
                    <Avatar user={{ name: r.userName, photoURL: r.userPhoto }} size={42} />
                    <div>
                      <div className="flex flex-wrap items-center gap-3"><p className="font-semibold">{r.userName}</p><StarRow value={r.rating} size={13} /></div>
                      <p className="mt-1 leading-relaxed text-base-content/80">{r.comment}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-base-content/70">No reviews yet. Book this studio and be the first to share how it went.</p>}

            {user && !mine && (
              <form onSubmit={postReview} className="card-surface mt-6 space-y-3 p-5">
                <h3 className="font-display text-lg font-bold">Rate this studio</h3>
                <div className="rating rating-md" role="radiogroup" aria-label="Rating">
                  {[1, 2, 3, 4, 5].map((n) => <input key={n} type="radio" name="rating" aria-label={`${n} stars`} className="mask mask-star-2 bg-secondary" checked={rv.rating === n} onChange={() => setRv({ ...rv, rating: n })} />)}
                </div>
                <textarea required minLength={5} rows={3} value={rv.comment} onChange={(e) => setRv({ ...rv, comment: e.target.value })} placeholder="What was the space like to work in?" className="textarea textarea-bordered w-full" />
                <button className="btn btn-primary btn-sm" disabled={posting}>{posting && <span className="loading loading-spinner loading-xs" />} Post review</button>
              </form>
            )}
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="card-surface sticky top-24 p-6">
            <p className="font-display text-4xl font-extrabold">{money(studio.hourlyRate)}<span className="text-base font-medium text-base-content/60"> / hour</span></p>
            <p className="mt-1 text-sm text-base-content/70">{money(studio.securityDeposit)} refundable security deposit</p>
            <button onClick={book} className="btn btn-primary mt-5 w-full">Book Workspace Now</button>
            <button onClick={heart} className="btn btn-outline mt-3 w-full gap-2"><FiHeart fill={saved ? "currentColor" : "none"} className={saved ? "text-accent" : ""} /> {saved ? "Saved" : "Save to wishlist"}</button>
            {mine && <Link href={`/studios/edit/${studio._id}`} className="btn btn-ghost mt-3 w-full">Edit this listing</Link>}
            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-base-content/60"><FiShield className="mt-0.5 shrink-0" /> The host confirms every request. You are only charged for confirmed sessions.</p>
          </div>
        </aside>
      </div>
      <BookingModal open={open} onClose={() => setOpen(false)} studio={studio} />
    </div>
  );
}
