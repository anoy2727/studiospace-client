"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  // Restore the session from the HTTPOnly cookie on every full page load.
  const refresh = useCallback(async () => {
    try {
      const { user } = await api("/auth/me");
      setUser(user);
      if (user) {
        const { ids } = await api("/wishlist/ids");
        setWishlist(ids);
      } else setWishlist([]);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email, password) => {
    const { user } = await api("/auth/login", { method: "POST", body: { email, password } });
    setUser(user);
    await refresh();
    return user;
  };
  const googleLogin = async (credential) => {
    const { user } = await api("/auth/google", { method: "POST", body: { credential } });
    setUser(user);
    await refresh();
    return user;
  };
  const register = (data) => api("/auth/register", { method: "POST", body: data });
  const logout = async () => {
    await api("/auth/logout", { method: "POST" });
    setUser(null);
    setWishlist([]);
  };

  const toggleWishlist = async (id) => {
    const saved = wishlist.includes(id);
    setWishlist((w) => (saved ? w.filter((x) => x !== id) : [...w, id])); // optimistic
    try {
      await api(`/wishlist/${id}`, { method: saved ? "DELETE" : "POST" });
      return !saved;
    } catch (e) {
      setWishlist((w) => (saved ? [...w, id] : w.filter((x) => x !== id)));
      throw e;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, googleLogin, register, logout, wishlist, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
}
