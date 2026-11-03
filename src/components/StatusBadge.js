const MAP = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};
export default function StatusBadge({ status }) {
  return <span className={`badge ${MAP[status] || "badge-ghost"} badge-outline gap-1.5 py-3 font-medium`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{status}</span>;
}
