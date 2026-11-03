"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiUploadCloud } from "react-icons/fi";
import { useAuth } from "@/lib/auth-context";
import { AMENITY_OPTIONS, CATEGORIES } from "@/lib/constants";
import { uploadToImgbb } from "@/lib/imgbb";
import StudioImage from "@/components/StudioImage";

const empty = { title: "", category: "", hourlyRate: "", securityDeposit: "", maxCapacity: "", location: "", imageUrl: "", gallery: "", amenities: [], extra: "", overview: "" };

export default function StudioForm({ initial, onSubmit, submitLabel, hostName, hostEmail }) {
  const { user } = useAuth();
  const [f, setF] = useState(() => initial ? { ...empty, ...initial, gallery: (initial.gallery || []).filter((g) => g !== initial.imageUrl).join("\n"), extra: (initial.amenities || []).filter((a) => !AMENITY_OPTIONS.includes(a)).join(", "), amenities: (initial.amenities || []).filter((a) => AMENITY_OPTIONS.includes(a)) } : empty);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const toggle = (a) => setF({ ...f, amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] });

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToImgbb(file);
      setF((p) => ({ ...p, imageUrl: url }));
      toast.success("Image uploaded.");
    } catch (err) { toast.error(err.message); }
    finally { setUploading(false); e.target.value = ""; }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.category) return toast.error("Choose a category for your studio.");
    if (!f.imageUrl) return toast.error("Add a cover image URL or upload an image.");
    setBusy(true);
    try {
      await onSubmit({
        title: f.title, category: f.category, hourlyRate: Number(f.hourlyRate), securityDeposit: Number(f.securityDeposit || 0), maxCapacity: Number(f.maxCapacity),
        location: f.location, imageUrl: f.imageUrl,
        gallery: f.gallery.split("\n").map((s) => s.trim()).filter(Boolean),
        amenities: [...f.amenities, ...f.extra.split(",").map((s) => s.trim()).filter(Boolean)],
        overview: f.overview,
      });
    } catch (err) { toast.error(err.message); setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-8">
      <div className="card-surface grid gap-5 p-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className="field-label">Studio title</label>
          <input id="title" required minLength={3} value={f.title} onChange={set("title")} className="input input-bordered w-full" placeholder="e.g. North Light Cyc Studio" />
        </div>
        <div>
          <label htmlFor="category" className="field-label">Category</label>
          <select id="category" required value={f.category} onChange={set("category")} className="select select-bordered w-full">
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="location" className="field-label">Location / address</label>
          <input id="location" required value={f.location} onChange={set("location")} className="input input-bordered w-full" placeholder="Area and city" />
        </div>
        <div>
          <label htmlFor="rate" className="field-label">Hourly rate ($)</label>
          <input id="rate" type="number" min="1" step="0.5" required value={f.hourlyRate} onChange={set("hourlyRate")} className="input input-bordered w-full" />
        </div>
        <div>
          <label htmlFor="deposit" className="field-label">Security deposit ($)</label>
          <input id="deposit" type="number" min="0" required value={f.securityDeposit} onChange={set("securityDeposit")} className="input input-bordered w-full" />
        </div>
        <div>
          <label htmlFor="cap" className="field-label">Max capacity (people)</label>
          <input id="cap" type="number" min="1" required value={f.maxCapacity} onChange={set("maxCapacity")} className="input input-bordered w-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">Host name</label>
            <input readOnly value={hostName || user?.name || ""} className="input input-bordered w-full cursor-not-allowed bg-base-200" />
          </div>
          <div>
            <label className="field-label">Host email</label>
            <input readOnly value={hostEmail || user?.email || ""} className="input input-bordered w-full cursor-not-allowed bg-base-200" />
          </div>
        </div>
      </div>

      <div className="card-surface grid gap-5 p-6 md:grid-cols-2">
        <div>
          <label htmlFor="img" className="field-label">Cover image URL</label>
          <input id="img" type="url" value={f.imageUrl} onChange={set("imageUrl")} className="input input-bordered w-full" placeholder="https://…" />
          <label className="btn btn-outline btn-sm mt-3 gap-2">
            {uploading ? <span className="loading loading-spinner loading-xs" /> : <FiUploadCloud />} Upload from device
            <input type="file" accept="image/*" hidden onChange={upload} disabled={uploading} />
          </label>
          <label htmlFor="gallery" className="field-label mt-5">More gallery image URLs (one per line)</label>
          <textarea id="gallery" rows={3} value={f.gallery} onChange={set("gallery")} className="textarea textarea-bordered w-full" placeholder="Optional extra photos for the carousel" />
        </div>
        <div>
          <p className="field-label">Preview</p>
          <div className="aspect-[16/10] overflow-hidden rounded-box border border-base-300 bg-base-200">
            {f.imageUrl ? <StudioImage src={f.imageUrl} alt="Cover preview" /> : <div className="grid h-full place-items-center text-sm text-base-content/50">Your cover image appears here</div>}
          </div>
        </div>
      </div>

      <div className="card-surface space-y-5 p-6">
        <div>
          <p className="field-label">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((a) => (
              <button type="button" key={a} onClick={() => toggle(a)} aria-pressed={f.amenities.includes(a)} className={`btn btn-sm ${f.amenities.includes(a) ? "btn-primary" : "btn-outline"}`}>{a}</button>
            ))}
          </div>
          <input value={f.extra} onChange={set("extra")} className="input input-bordered mt-3 w-full" placeholder="Other amenities, separated by commas" aria-label="Other amenities" />
        </div>
        <div>
          <label htmlFor="overview" className="field-label">Detailed overview</label>
          <textarea id="overview" required minLength={20} rows={6} value={f.overview} onChange={set("overview")} className="textarea textarea-bordered w-full" placeholder="Describe the space, the light, the gear and what works best here (20+ characters)." />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary min-w-40" disabled={busy || uploading}>{busy && <span className="loading loading-spinner loading-sm" />} {submitLabel}</button>
      </div>
    </form>
  );
}
