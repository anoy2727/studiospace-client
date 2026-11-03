"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiCheck, FiEye, FiEyeOff } from "react-icons/fi";
import AuthShell from "@/components/AuthShell";
import GoogleButton from "@/components/GoogleButton";
import { useAuth } from "@/lib/auth-context";
import { PASSWORD_RULES } from "@/lib/constants";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const failing = PASSWORD_RULES.filter((r) => !r.test(form.password));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (failing.length) {
      const msg = `Password is missing: ${failing.map((f) => f.text.toLowerCase()).join(", ")}.`;
      setError(msg);
      return toast.error(msg);
    }
    setBusy(true);
    try {
      await register(form);
      toast.success("Account created. Log in to start booking.");
      router.push("/login");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Book studios as a creator or list your own space as a host." aside={{ title: "Book it. Host it. Shoot it.", text: "One account lets you reserve spaces and rent out your own studio hours.", points: ["Free to join", "Hosts keep full control of their calendar", "Verified accounts on both sides"] }}>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="field-label">Full name</label>
          <input id="name" required className="input input-bordered w-full" placeholder="Your name" value={form.name} onChange={set("name")} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input id="email" type="email" required className="input input-bordered w-full" placeholder="you@example.com" value={form.email} onChange={set("email")} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="photo" className="field-label">Photo URL</label>
          <input id="photo" type="url" className="input input-bordered w-full" placeholder="https://example.com/me.jpg" value={form.photoURL} onChange={set("photoURL")} />
        </div>
        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <div className="relative">
            <input id="password" type={show ? "text" : "password"} required className="input input-bordered w-full pr-11" placeholder="Create a password" value={form.password} onChange={set("password")} autoComplete="new-password" />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60">{show ? <FiEyeOff /> : <FiEye />}</button>
          </div>
          <ul className="mt-2 grid gap-1 text-xs">
            {PASSWORD_RULES.map((r) => {
              const ok = r.test(form.password);
              return <li key={r.text} className={`flex items-center gap-2 ${ok ? "text-success" : "text-base-content/60"}`}><FiCheck size={13} className={ok ? "" : "opacity-30"} />{r.text}</li>;
            })}
          </ul>
        </div>
        {error && <p role="alert" className="rounded-md bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />} Register</button>
      </form>
      <div className="divider my-5 text-xs">or</div>
      <GoogleButton onDone={() => router.replace("/")} />
      <p className="mt-6 text-center text-sm text-base-content/70">Already have an account? <Link href="/login" className="font-semibold text-primary hover:underline">Login</Link></p>
    </AuthShell>
  );
}
