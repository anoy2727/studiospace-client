"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCalendar, FiDollarSign, FiHome, FiInbox } from "react-icons/fi";
import PrivateRoute from "@/components/PrivateRoute";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { PageSpinner } from "@/components/Skeletons";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { money } from "@/lib/constants";

function Dashboard() {
  const { user } = useAuth();
  const [sum, setSum] = useState(null);
  const [reqs, setReqs] = useState(null);
  const [busyId, setBusyId] = useState("");

  const load = () => {
    api("/bookings/summary").then(setSum).catch((e) => toast.error(e.message));
    api("/bookings/requests").then((d) => setReqs(d.bookings)).catch(() => setReqs([]));
  };
  useEffect(load, []);

  const act = async (b, status) => {
    setBusyId(b._id + status);
    try {
      await api(`/bookings/${b._id}/status`, { method: "PATCH", body: { status } });
      toast.success(status === "Confirmed" ? "Booking confirmed. The slot is now locked." : `Booking marked ${status.toLowerCase()}.`);
      load();
    } catch (e) { toast.error(e.message); }
    finally { setBusyId(""); }
  };

  if (!sum || !reqs) return <PageSpinner label="Loading dashboard" />;
  const stats = [
    { icon: FiHome, label: "Active listings", value: sum.listings },
    { icon: FiInbox, label: "Pending requests", value: sum.pendingRequests },
    { icon: FiCalendar, label: "Upcoming sessions", value: sum.upcoming },
    { icon: FiDollarSign, label: "Earned from sessions", value: money(sum.earned) },
  ];

  return (
    <div className="wrap page-pad">
      <h1 className="section-title">Welcome back, {user.name.split(" ")[0]}</h1>
      <p className="section-sub">Your hosting activity and booking requests at a glance.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card-surface h-full p-5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><s.icon size={20} /></span>
            <p className="mt-4 font-display text-3xl font-extrabold">{s.value}</p>
            <p className="text-sm text-base-content/70">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/add-studio" className="btn btn-primary btn-sm">Add New Studio</Link>
        <Link href="/my-listings" className="btn btn-outline btn-sm">My Studio Listings</Link>
        <Link href="/my-bookings" className="btn btn-outline btn-sm">My Bookings ({sum.bookingsMade})</Link>
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold">Booking requests for your studios</h2>
      <div className="mt-4">
        {reqs.length === 0 ? (
          <EmptyState icon={FiInbox} title="No requests yet" text="When a creator books one of your studios, the request lands here for you to confirm." href="/my-listings" cta="View my listings" />
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="table">
              <thead><tr><th>Studio</th><th>Guest</th><th>When</th><th>Total</th><th>Status</th><th className="text-right">Action</th></tr></thead>
              <tbody>
                {reqs.map((b) => (
                  <tr key={b._id}>
                    <td className="font-semibold">{b.studioTitle}</td>
                    <td><p>{b.userName}</p><p className="text-xs text-base-content/60">{b.userEmail}</p></td>
                    <td>{b.date}<p className="text-xs text-base-content/60">{b.startTime}–{b.endTime}</p></td>
                    <td>{money(b.total)}</td>
                    <td><StatusBadge status={b.status} /></td>
                    <td>
                      <div className="flex justify-end gap-2">
                        {b.status === "Pending" && <>
                          <button disabled={!!busyId} onClick={() => act(b, "Confirmed")} className="btn btn-success btn-sm">{busyId === b._id + "Confirmed" && <span className="loading loading-spinner loading-xs" />} Confirm</button>
                          <button disabled={!!busyId} onClick={() => act(b, "Cancelled")} className="btn btn-outline btn-error btn-sm">Decline</button>
                        </>}
                        {b.status === "Confirmed" && <>
                          <button disabled={!!busyId} onClick={() => act(b, "Completed")} className="btn btn-outline btn-sm">Mark completed</button>
                          <button disabled={!!busyId} onClick={() => act(b, "Cancelled")} className="btn btn-outline btn-error btn-sm">Cancel</button>
                        </>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <PrivateRoute><Dashboard /></PrivateRoute>;
}
