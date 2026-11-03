import Link from "next/link";
import { FiAperture } from "react-icons/fi";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" aria-label="StudioSpace home" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-content">
        <FiAperture size={22} />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">StudioSpace</span>
    </Link>
  );
}
