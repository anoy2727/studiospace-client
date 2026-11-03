"use client";
import { useState } from "react";
import { FALLBACK_IMG } from "@/lib/constants";

export default function StudioImage({ src, alt, className = "" }) {
  const [bad, setBad] = useState(false);
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={bad || !src ? FALLBACK_IMG : src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`h-full w-full object-cover ${className}`} />;
}
