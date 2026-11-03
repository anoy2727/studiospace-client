"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiGrid, FiPlusCircle, FiList, FiCalendar, FiLogOut, FiMenu, FiX, FiHeart } from "react-icons/fi";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import Avatar from "@/components/Avatar";
import { useAuth } from "@/lib/auth-context";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setMenu(false);
    setDrawer(false);
  }, [pathname]);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setMenu(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const active = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const onLogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out.");
      router.push("/");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const items = [
    { href: "/dashboard", label: "Dashboard", icon: FiGrid },
    { href: "/add-studio", label: "Add New Studio", icon: FiPlusCircle },
    { href: "/my-listings", label: "My Studio Listings", icon: FiList },
    { href: "/my-bookings", label: "My Bookings", icon: FiCalendar },
    { href: "/wishlist", label: "Saved Studios", icon: FiHeart },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} data-active={active(l.href)} className={`nav-link rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${active(l.href) ? "text-primary" : "text-base-content/80"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {loading ? (
            <span className="skeleton h-9 w-9 rounded-full" aria-hidden />
          ) : user ? (
            <div className="relative" ref={ref}>
              <button onClick={() => setMenu((m) => !m)} onMouseEnter={() => setMenu(true)} className="flex items-center rounded-full ring-2 ring-transparent transition hover:ring-primary focus-visible:ring-primary" aria-haspopup="menu" aria-expanded={menu} aria-label="Open account menu" title={user.name}>
                <Avatar user={user} size={38} />
              </button>
              {menu && (
                <div onMouseLeave={() => setMenu(false)} className="absolute right-0 mt-2 w-64 overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-xl" role="menu">
                  <div className="border-b border-base-300 px-4 py-3">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-base-content/60">{user.email}</p>
                  </div>
                  <ul className="p-2">
                    {items.map(({ href, label, icon: Icon }) => (
                      <li key={href}>
                        <Link href={href} role="menuitem" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-base-200">
                          <Icon size={16} /> {label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button onClick={onLogout} role="menuitem" className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-error hover:bg-base-200">
                        <FiLogOut size={16} /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
          <button className="btn btn-ghost btn-circle btn-sm lg:hidden" onClick={() => setDrawer((d) => !d)} aria-label="Toggle navigation">
            {drawer ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {drawer && (
        <nav className="border-t border-base-300 bg-base-100 lg:hidden" aria-label="Mobile">
          <ul className="wrap flex flex-col py-3">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`block rounded-md px-3 py-2.5 text-sm font-medium ${active(l.href) ? "bg-primary/10 text-primary" : ""}`}>{l.label}</Link>
              </li>
            ))}
            {!user && !loading && (
              <li className="mt-2 flex gap-2">
                <Link href="/login" className="btn btn-outline btn-sm flex-1">Login</Link>
                <Link href="/register" className="btn btn-primary btn-sm flex-1">Register</Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
