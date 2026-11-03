"use client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth-context";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: "10px", background: "var(--fallback-b1,oklch(var(--b1)))", color: "var(--fallback-bc,oklch(var(--bc)))", border: "1px solid var(--fallback-b3,oklch(var(--b3)))" } }} />
    </AuthProvider>
  );
}
