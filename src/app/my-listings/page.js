"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiHome, FiTrash2 } from "react-icons/fi";
import PrivateRoute from "@/components/PrivateRoute";
import EmptyState from "@/components/EmptyState";
import StudioImage from "@/components/StudioImage";
import { RatingBadge } from "@/components/Stars";
import { ConfirmModal } from "@/components/Modal";
import { GridSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { money } from "@/lib/constants";

function Listings() {
  const [studios, setStudios] = useState(null);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/studios/mine/list").then((d) => setStudios(d.studios)).catch((e) => { toast.error(e.message); setStudios([]); });
  }, []);

  const remove = async () => {
    setBusy(true);
    try {
      await api(`/studios/${target._id}`, { method: "DELETE" });
      setStudios((s) => s.filter((x) => x._id !== target._id));
      toast.success(`“${target.title}” was deleted.`);
      setTarget(null);
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="wrap page-pad">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">My studio listings</h1>
          <p className="section-sub">Edit pricing, update photos or remove spaces you no longer rent out.</p>
        </div>
        <Link href="/add-studio" className="btn btn-primary">Add New Studio</Link>
      </div>
      <div className="mt-8">
        {studios === null ? <GridSkeleton count={3} /> : studios.length === 0 ? (
          <EmptyState icon={FiHome} title="You have not listed a studio yet" text="Add your first space and start receiving booking requests from creators." href="/add-studio" cta="Add New Studio" />
        ) : (
          <>
            <div className="card-surface hidden overflow-x-auto md:block">
              <table className="table">
                <thead><tr><th>Studio</th><th>Category</th><th>Rate</th><th>Rating</th><th className="text-right">Actions</th></tr></thead>
                <tbody>
                  {studios.map((s) => (
                    <tr key={s._id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-20 shrink-0 overflow-hidden rounded-md bg-base-300"><StudioImage src={s.imageUrl} alt="" /></div>
                          <div className="min-w-0"><Link href={`/studios/${s._id}`} className="font-semibold hover:text-primary">{s.title}</Link><p className="truncate text-xs text-base-content/60">{s.location}</p></div>
                        </div>
                      </td>
                      <td>{s.category}</td>
                      <td>{money(s.hourlyRate)} / hr</td>
                      <td><RatingBadge rating={s.rating} count={s.reviewCount} /></td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <Link href={`/studios/edit/${s._id}`} className="btn btn-outline btn-sm gap-1"><FiEdit2 size={14} /> Update</Link>
                          <button onClick={() => setTarget(s)} className="btn btn-outline btn-error btn-sm gap-1"><FiTrash2 size={14} /> Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-4 md:hidden">
              {studios.map((s) => (
                <div key={s._id} className="card-surface overflow-hidden">
                  <div className="h-40 bg-base-300"><StudioImage src={s.imageUrl} alt={s.title} /></div>
                  <div className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-2"><h3 className="font-display text-lg font-bold">{s.title}</h3><RatingBadge rating={s.rating} /></div>
                    <p className="text-sm text-base-content/70">{s.category} · {money(s.hourlyRate)} / hr</p>
                    <div className="flex gap-2 pt-2">
                      <Link href={`/studios/edit/${s._id}`} className="btn btn-outline btn-sm flex-1">Update</Link>
                      <button onClick={() => setTarget(s)} className="btn btn-outline btn-error btn-sm flex-1">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <ConfirmModal open={!!target} onClose={() => !busy && setTarget(null)} onConfirm={remove} busy={busy} title="Delete this studio?" message={`“${target?.title}” and its reviews will be removed permanently. Creators will no longer be able to book it.`} confirmLabel="Delete studio" />
    </div>
  );
}

export default function MyListings() {
  return <PrivateRoute><Listings /></PrivateRoute>;
}
