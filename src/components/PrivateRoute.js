"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { PageSpinner } from "@/components/Skeletons";

/**
 * Waits for the cookie-based session check before deciding. A logged-in user
 * who reloads a private route therefore stays on that route instead of being sent to /login.
 */
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [loading, user, router, pathname]);

  if (loading || !user) return <PageSpinner label="Checking your session" />;
  return children;
}
