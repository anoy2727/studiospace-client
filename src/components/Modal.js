"use client";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";

/** Custom modal dialog (replaces window.alert / window.confirm everywhere). */
export default function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close dialog" tabIndex={-1} />
      <div className={`relative max-h-[92vh] w-full overflow-y-auto rounded-box border border-base-300 bg-base-100 p-6 shadow-2xl ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-bold">{title}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm" aria-label="Close"><FiX size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = "Confirm", busy = false, danger = true }) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-base-content/75 leading-relaxed">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className="btn btn-ghost" onClick={onClose} disabled={busy}>Keep it</button>
        <button className={`btn ${danger ? "btn-error" : "btn-primary"}`} onClick={onConfirm} disabled={busy}>
          {busy && <span className="loading loading-spinner loading-xs" />} {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
