"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiHeart } from "react-icons/fi";
import PrivateRoute from "@/components/PrivateRoute";
import StudioCard from "@/components/StudioCard";
import EmptyState from "@/components/EmptyState";
import { GridSkeleton } from "@/components/Skeletons";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

function Saved() {
  const { wishlist } = useAuth();
  const [studios, setStudios] = useState(null);
  useEffect(() => {
    api("/wishlist").then((d) => setStudios(d.studios)).catch((e) => { toast.error(e.message); setStudios([]); });
  }, []);
  const visible = studios?.filter((s) => wishlist.includes(String(s._id)));
  return (
    <div className="wrap page-pad">
      <h1 className="section-title">Saved studios</h1>
      <p className="section-sub">Your shortlist of favourite spaces.</p>
      <div className="mt-8">
        {!visible ? <GridSkeleton count={3} /> : visible.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{visible.map((s) => <StudioCard key={s._id} studio={s} />)}</div>
        ) : (
          <EmptyState icon={FiHeart} title="Nothing saved yet" text="Tap the heart on any studio card to keep it here for later." href="/studios" cta="Explore Studios" />
        )}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return <PrivateRoute><Saved /></PrivateRoute>;
}
