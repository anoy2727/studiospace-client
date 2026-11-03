"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import { api } from "@/lib/api";
import { money } from "@/lib/constants";

const pad = (n) => String(n).padStart(2, "0");
const toTime = (min) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const START_SLOTS = Array.from({ length: 29 }, (_, i) => 8 * 60 + i * 30); // 08:00 .. 22:00

export default function BookingModal({ open, onClose, studio }) {
  const router = useRouter();
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const [form, setForm] = useState({ date: today, start: 600, hours: 2, guests: 1, note: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const maxHours = Math.min(12, Math.floor((24 * 60 - form.start) / 60));
  const hours = Math.min(form.hours, maxHours);
  const subtotal = hours * studio.hourlyRate;
  const total = subtotal + (studio.securityDeposit || 0);
  const set = (k) => (e) => { setError(""); setForm({ ...form, [k]: k === "note" || k === "date" ? e.target.value : Number(e.target.value) }); };
  const durations = useMemo(() => Array.from({ length: maxHours }, (_, i) => i + 1), [maxHours]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/bookings", {
        method: "POST",
        body: { studioId: String(studio._id), date: form.date, startTime: toTime(form.start), endTime: toTime(form.start + hours * 60), guests: form.guests, note: form.note },
      });
      toast.success("Booking request sent. The host will confirm shortly.");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      setError(err.message);
      toast.error(err.status === 409 ? "That slot is already booked." : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Book ${studio.title}`} wide>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="b-date" className="field-label">Date</label>
            <input id="b-date" type="date" min={today} required value={form.date} onChange={set("date")} className="input input-bordered w-full" />
          </div>
          <div>
            <label htmlFor="b-guests" className="field-label">People (max {studio.maxCapacity})</label>
            <input id="b-guests" type="number" min="1" max={studio.maxCapacity} required value={form.guests} onChange={set("guests")} className="input input-bordered w-full" />
          </div>
          <div>
            <label htmlFor="b-start" className="field-label">Start time</label>
            <select id="b-start" value={form.start} onChange={set("start")} className="select select-bordered w-full">
              {START_SLOTS.map((m) => <option key={m} value={m}>{toTime(m)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="b-hours" className="field-label">Duration</label>
            <select id="b-hours" value={hours} onChange={set("hours")} className="select select-bordered w-full">
              {durations.map((h) => <option key={h} value={h}>{h} {h === 1 ? "hour" : "hours"}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="b-note" className="field-label">Note for the host (optional)</label>
          <textarea id="b-note" rows={2} maxLength={500} value={form.note} onChange={set("note")} placeholder="Tell the host what you plan to shoot or record" className="textarea textarea-bordered w-full" />
        </div>

        <dl className="space-y-1.5 rounded-lg bg-base-200 p-4 text-sm">
          <div className="flex justify-between"><dt>{money(studio.hourlyRate)} × {hours} {hours === 1 ? "hour" : "hours"} ({toTime(form.start)}–{toTime(form.start + hours * 60)})</dt><dd>{money(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Refundable security deposit</dt><dd>{money(studio.securityDeposit)}</dd></div>
          <div className="flex justify-between border-t border-base-300 pt-2 font-display text-lg font-bold"><dt>Total</dt><dd>{money(total)}</dd></div>
        </dl>

        {error && <p role="alert" className="rounded-md bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Request booking</button>
        </div>
      </form>
    </Modal>
  );
}
