"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import { api } from "@/lib/api";

export default function AddStudio() {
  const router = useRouter();
  const save = async (body) => {
    await api("/studios", { method: "POST", body });
    toast.success("Your studio is live.");
    router.push("/my-listings");
  };
  return (
    <PrivateRoute>
      <div className="wrap page-pad max-w-4xl">
        <h1 className="section-title">Add a new studio</h1>
        <p className="section-sub">List your space with clear photos, honest amenities and a fair hourly rate.</p>
        <div className="mt-8"><StudioForm onSubmit={save} submitLabel="Publish studio" /></div>
      </div>
    </PrivateRoute>
  );
}
