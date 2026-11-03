"use client";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("studiolight");
  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "studiolight");
  }, []);
  const toggle = () => {
    const next = theme === "studiodark" ? "studiolight" : "studiodark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("studio-theme", next); } catch {}
    setTheme(next);
  };
  const dark = theme === "studiodark";
  return (
    <button onClick={toggle} className="btn btn-ghost btn-circle btn-sm" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>
      {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
}
