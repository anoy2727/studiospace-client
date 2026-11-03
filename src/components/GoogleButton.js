"use client";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/lib/auth-context";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export default function GoogleButton({ onDone }) {
  const { googleLogin } = useAuth();
  const ref = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID) return;
    const init = () => {
      window.google?.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async ({ credential }) => {
          try {
            const user = await googleLogin(credential);
            toast.success(`Welcome, ${user.name.split(" ")[0]}!`);
            onDone?.();
          } catch (e) {
            toast.error(e.message);
          }
        },
      });
      if (ref.current) window.google.accounts.id.renderButton(ref.current, { theme: "outline", size: "large", width: 320, text: "continue_with", shape: "rectangular" });
    };
    if (window.google?.accounts) return init();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = init;
    document.body.appendChild(s);
    return () => s.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!CLIENT_ID) {
    return (
      <button type="button" onClick={() => toast.error("Google sign-in is not configured for this deployment yet.")} className="btn btn-outline w-full gap-2">
        <FcGoogle size={20} /> Continue with Google
      </button>
    );
  }
  return <div ref={ref} className="flex min-h-[44px] justify-center" />;
}
