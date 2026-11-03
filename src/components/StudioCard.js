"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiHeart, FiMapPin } from "react-icons/fi";
import StudioImage from "@/components/StudioImage";
import { RatingBadge } from "@/components/Stars";
import { useAuth } from "@/lib/auth-context";

export default function StudioCard({ studio }) {
  const { user, wishlist, toggleWishlist } = useAuth();
  const router = useRouter();
  const id = String(studio._id);
  const saved = wishlist.includes(id);

  const onHeart = async () => {
    if (!user) {
      toast("Log in to save studios to your wishlist.", { icon: "🔒" });
      return router.push("/login?redirect=/studios");
    }
    try {
      const nowSaved = await toggleWishlist(id);
      toast.success(nowSaved ? "Saved to your wishlist." : "Removed from your wishlist.");
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <article className="card-surface flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <div className="relative h-52 shrink-0 overflow-hidden bg-base-300">
        <StudioImage src={studio.imageUrl} alt={studio.title} className="transition-transform duration-500 hover:scale-105" />
        <span className="badge badge-neutral absolute left-3 top-3 border-0 py-3">{studio.category}</span>
        <button onClick={onHeart} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"} className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-base-100/90 backdrop-blur transition hover:scale-110 ${saved ? "text-accent" : "text-base-content"}`}>
          <FiHeart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 min-h-[3.25rem] font-display text-lg font-bold leading-snug">{studio.title}</h3>
          <RatingBadge rating={studio.rating} count={studio.reviewCount} />
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-base-content/70"><FiMapPin size={14} className="shrink-0" /> <span className="truncate">{studio.location}</span></p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="font-display text-xl font-bold">${studio.hourlyRate}<span className="text-sm font-medium text-base-content/60"> / hr</span></p>
          <Link href={`/studios/${id}`} className="btn btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </article>
  );
}
