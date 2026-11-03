"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import EmptyState from "@/components/EmptyState";
import { PageSpinner } from "@/components/Skeletons";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";

function Editor() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [studio, setStudio] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api(`/studios/${id}`).then((d) => setStudio(d.studio)).catch(() => setMissing(true));
  }, [id]);

  if (missing) return <div className="wrap page-pad"><EmptyState title="Studio not found" text="This listing no longer exists." href="/my-listings" cta="Back to my listings" /></div>;
  if (!studio) return <PageSpinner label="Loading listing" />;
  if (studio.ownerEmail !== user.email) return <div className="wrap page-pad"><EmptyState title="You cannot edit this listing" text="Only the host who created a studio can change it." href="/studios" cta="Explore Studios" /></div>;

  const save = async (body) => {
    await api(`/studios/${id}`, { method: "PUT", body });
    toast.success("Listing updated.");
    router.push("/my-listings");
  };
  return (
    <div className="wrap page-pad max-w-4xl">
      <h1 className="section-title">Update studio</h1>
      <p className="section-sub">Changes go live as soon as you save.</p>
      <div className="mt-8"><StudioForm initial={studio} onSubmit={save} submitLabel="Save changes" hostName={studio.ownerName} hostEmail={studio.ownerEmail} /></div>
    </div>
  );
}

export default function EditStudio() {
  return <PrivateRoute><Editor /></PrivateRoute>;
}
