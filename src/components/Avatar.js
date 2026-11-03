"use client";
import { useState } from "react";

export default function Avatar({ user, size = 36 }) {
  const [bad, setBad] = useState(false);
  const initials = (user?.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (user?.photoURL && !bad) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.photoURL} alt={user.name} width={size} height={size} onError={() => setBad(true)} className="rounded-full object-cover" style={{ width: size, height: size }} referrerPolicy="no-referrer" />;
  }
  return (
    <span className="grid place-items-center rounded-full bg-primary font-semibold text-primary-content" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}
