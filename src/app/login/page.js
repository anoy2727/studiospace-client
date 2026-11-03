"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthShell from "@/components/AuthShell";
import GoogleButton from "@/components/GoogleButton";
import { PageSpinner } from "@/components/Skeletons";
import { useAuth } from "@/lib/auth-context";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect");
  const dest = redirect && redirect.startsWith("/") ? redirect : "/";
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      router.replace(dest);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Log in to StudioSpace" subtitle="Pick up where you left off: bookings, listings and saved studios." aside={{ title: "Your next session is one login away.", text: "Manage bookings, confirm requests from creators and keep your favourite studios close.", points: ["Instant booking requests", "Host dashboard with earnings", "Downloadable PDF invoices"] }}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input id="email" type="email" required autoComplete="email" className="input input-bordered w-full" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="field-label">Password</label>
            <button type="button" onClick={() => toast("Password reset is not available in this release.", { icon: "ℹ️" })} className="mb-1.5 text-xs font-medium text-primary hover:underline">Forgot password?</button>
          </div>
          <div className="relative">
            <input id="password" type={show ? "text" : "password"} required autoComplete="current-password" className="input input-bordered w-full pr-11" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60">{show ? <FiEyeOff /> : <FiEye />}</button>
          </div>
        </div>
        {error && <p role="alert" className="rounded-md bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Login</button>
      </form>
      <div className="divider my-5 text-xs">or</div>
      <GoogleButton onDone={() => router.replace(dest)} />
      <p className="mt-6 text-center text-sm text-base-content/70">New to StudioSpace? <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link></p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<PageSpinner />}><LoginForm /></Suspense>;
}
