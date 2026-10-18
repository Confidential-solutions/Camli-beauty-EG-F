import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { extras } from "@/i18n/extras";
import { useLocale } from "@/app/providers";

/* Demo account + notifications, stored in this browser only. */
export interface User {
  name: string;
  email: string;
  createdAt: string;
}
interface StoredUser extends User {
  password: string;
}
export interface Notice {
  id: string;
  title: string;
  body?: string | undefined;
  at: number;
  read: boolean;
}

interface AccountCtx {
  user: User | null;
  authOpen: boolean;
  authMode: "login" | "register";
  openAuth: (mode?: "login" | "register") => void;
  setAuthOpen: (o: boolean) => void;
  setAuthMode: (m: "login" | "register") => void;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateName: (name: string) => void;
  notices: Notice[];
  unread: number;
  notify: (title: string, body?: string) => void;
  markAllRead: () => void;
  clearNotices: () => void;
  ex: (typeof extras)["en"];
}
const Ctx = createContext<AccountCtx | null>(null);

const USERS = "camli-users";
const SESSION = "camli-session";
const NOTICES = "camli-notices";

function readUsers(): StoredUser[] {
  try {
    const v = JSON.parse(localStorage.getItem(USERS) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const ex = extras[locale];
  const [user, setUser] = useState<User | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [notices, setNotices] = useState<Notice[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem(SESSION);
    const u = readUsers().find((x) => x.email === email);
    if (u) setUser({ name: u.name, email: u.email, createdAt: u.createdAt });
    try {
      const n = JSON.parse(localStorage.getItem(NOTICES) || "null");
      if (Array.isArray(n)) setNotices(n);
      else {
        const now = Date.now();
        setNotices([
          { id: "welcome", title: ex.notif.welcome, body: ex.notif.welcomeBody, at: now, read: false },
          { id: "ship", title: ex.notif.ship, body: ex.notif.shipBody, at: now - 3600_000, read: false },
        ]);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(NOTICES, JSON.stringify(notices.slice(0, 30)));
  }, [notices, ready]);

  const notify = useCallback((title: string, body?: string) => {
    setNotices((p) => [{ id: crypto.randomUUID(), title, body, at: Date.now(), read: false }, ...p]);
  }, []);

  const login = useCallback(
    (email: string, password: string) => {
      const u = readUsers().find((x) => x.email === email.toLowerCase() && x.password === password);
      if (!u) return false;
      localStorage.setItem(SESSION, u.email);
      setUser({ name: u.name, email: u.email, createdAt: u.createdAt });
      toast.success(ex.auth.signedIn, { description: u.name });
      return true;
    },
    [ex],
  );

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const users = readUsers();
      const e = email.toLowerCase();
      if (users.some((x) => x.email === e)) return false;
      const u: StoredUser = { name, email: e, password, createdAt: new Date().toISOString() };
      localStorage.setItem(USERS, JSON.stringify([...users, u]));
      localStorage.setItem(SESSION, e);
      setUser({ name, email: e, createdAt: u.createdAt });
      toast.success(ex.auth.registered, { description: name });
      notify(ex.notif.welcome, ex.notif.welcomeBody);
      return true;
    },
    [ex, notify],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION);
    setUser(null);
    toast(ex.auth.signedOut);
  }, [ex]);

  const updateName = useCallback((name: string) => {
    setUser((u) => {
      if (!u) return u;
      const users = readUsers().map((x) => (x.email === u.email ? { ...x, name } : x));
      localStorage.setItem(USERS, JSON.stringify(users));
      return { ...u, name };
    });
  }, []);

  const value = useMemo<AccountCtx>(
    () => ({
      user,
      authOpen,
      authMode,
      setAuthOpen,
      setAuthMode,
      openAuth: (m = "login") => {
        setAuthMode(m);
        setAuthOpen(true);
      },
      login,
      register,
      logout,
      updateName,
      notices,
      unread: notices.filter((n) => !n.read).length,
      notify,
      markAllRead: () => setNotices((p) => p.map((n) => ({ ...n, read: true }))),
      clearNotices: () => setNotices([]),
      ex,
    }),
    [user, authOpen, authMode, login, register, logout, updateName, notices, notify, ex],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAccount must be used within AccountProvider");
  return v;
}
