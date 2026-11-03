import { FaStar } from "react-icons/fa6";

export function RatingBadge({ rating, count }) {
  if (!rating) return <span className="badge badge-ghost gap-1 py-3 text-xs">New</span>;
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs font-semibold text-secondary-content" title={count ? `${count} reviews` : undefined}>
      <FaStar size={11} /> {Number(rating).toFixed(1)}
    </span>
  );
}

export function StarRow({ value = 0, size = 16 }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => <FaStar key={n} size={size} className={n <= Math.round(value) ? "text-secondary" : "text-base-300"} />)}
    </span>
  );
}
