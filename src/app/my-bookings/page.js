"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiClock, FiDownload, FiMapPin, FiUsers } from "react-icons/fi";
import PrivateRoute from "@/components/PrivateRoute";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import StudioImage from "@/components/StudioImage";
import { ConfirmModal } from "@/components/Modal";
import { PageSpinner } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { downloadInvoice } from "@/lib/invoice";
import { money } from "@/lib/constants";

function Bookings() {
  const [list, setList] = useState(null);
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/bookings/mine").then((d) => setList(d.bookings)).catch((e) => { toast.error(e.message); setList([]); });
  }, []);

  const cancel = async () => {
    setBusy(true);
    try {
      const { booking } = await api(`/bookings/${target._id}/status`, { method: "PATCH", body: { status: "Cancelled" } });
      setList((l) => l.map((b) => (b._id === booking._id ? booking : b)));
      toast.success("Your booking request was cancelled.");
      setTarget(null);
    } catch (e) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  const invoice = async (b) => {
    try { await downloadInvoice(b); toast.success("Invoice downloaded."); }
    catch { toast.error("We could not create the invoice. Please try again."); }
  };

  if (list === null) return <PageSpinner label="Loading your bookings" />;
  return (
    <div className="wrap page-pad">
      <h1 className="section-title">My bookings</h1>
      <p className="section-sub">Track every request, from pending to completed.</p>
      <div className="mt-8">
        {list.length === 0 ? (
          <EmptyState icon={FiCalendar} title="No bookings yet" text="Find a studio that fits your next shoot, session or workshop and send your first request." href="/studios" cta="Explore Studios" />
        ) : (
          <ul className="space-y-4">
            {list.map((b) => (
              <li key={b._id} className="card-surface flex flex-col gap-4 overflow-hidden p-4 sm:flex-row">
                <div className="h-40 w-full shrink-0 overflow-hidden rounded-lg bg-base-300 sm:h-32 sm:w-48"><StudioImage src={b.studioImage} alt="" /></div>
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link href={`/studios/${b.studioId}`} className="font-display text-xl font-bold hover:text-primary">{b.studioTitle}</Link>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-base-content/70">
                    <span className="inline-flex items-center gap-1.5"><FiCalendar /> {b.date}</span>
                    <span className="inline-flex items-center gap-1.5"><FiClock /> {b.startTime}–{b.endTime} ({b.hours} h)</span>
                    <span className="inline-flex items-center gap-1.5"><FiUsers /> {b.guests} {b.guests === 1 ? "person" : "people"}</span>
                    <span className="inline-flex items-center gap-1.5"><FiMapPin /> {b.studioLocation}</span>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                    <p className="font-display text-lg font-bold">{money(b.total)} <span className="text-sm font-medium text-base-content/60">incl. deposit</span></p>
                    <div className="flex gap-2">
                      {b.status === "Pending" && <button onClick={() => setTarget(b)} className="btn btn-outline btn-error btn-sm">Cancel Booking</button>}
                      {["Confirmed", "Completed"].includes(b.status) && <button onClick={() => invoice(b)} className="btn btn-outline btn-sm gap-1.5"><FiDownload /> Invoice PDF</button>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <ConfirmModal open={!!target} onClose={() => !busy && setTarget(null)} onConfirm={cancel} busy={busy} title="Cancel this booking?" message={`Your request for ${target?.studioTitle} on ${target?.date} will be withdrawn. You can always book another slot.`} confirmLabel="Cancel booking" />
    </div>
  );
}

export default function MyBookings() {
  return <PrivateRoute><Bookings /></PrivateRoute>;
}
