// Thin fetch wrapper. All calls go to /api/* which Next.js proxies to the Express server,
// so the HTTPOnly JWT cookie is sent automatically and is never readable from JavaScript.
export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
    cache: "no-store",
  });
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (!res.ok) {
    const err = new Error(data?.message || "Something went wrong. Please try again.");
    err.status = res.status;
    throw err;
  }
  return data;
}
