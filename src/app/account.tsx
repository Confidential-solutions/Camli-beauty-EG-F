import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { extras } from "@/i18n/extras";
import { useLocale } from "@/app/providers";

export const OFFICIAL_SHOPIFY_ACCOUNT_URL = "https://www.camlibeautyeg.com/account";
export const OFFICIAL_SHOPIFY_LOGIN_URL = "https://www.camlibeautyeg.com/account/login";

/* Guest profile + notifications stored safely in this browser only. No passwords ever stored. */
export interface User {
  name: string;
  email: string;
  createdAt: string;
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
  saveProfile: (name: string, email: string) => boolean;
  login: (email: string, _optionalPass?: string) => boolean;
  register: (name: string, email: string, _optionalPass?: string) => boolean;
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

const PROFILE_KEY = "camli-guest-profile";
const LEGACY_USERS_KEY = "camli-users";
const SESSION_KEY = "camli-session";
const NOTICES_KEY = "camli-notices";

function readProfile(): User | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.email === "string" && typeof parsed.name === "string") {
        return {
          name: parsed.name,
          email: parsed.email,
          createdAt: parsed.createdAt || new Date().toISOString(),
        };
      }
    }

    // Security migration: sanitize legacy users key if present
    const legacyRaw = localStorage.getItem(LEGACY_USERS_KEY);
    if (legacyRaw) {
      // Remove any plaintext passwords from storage immediately
      localStorage.removeItem(LEGACY_USERS_KEY);
      const parsedLegacy = JSON.parse(legacyRaw);
      if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
        const first = parsedLegacy[0];
        if (first && first.email && first.name) {
          const sanitized: User = {
            name: String(first.name),
            email: String(first.email),
            createdAt: first.createdAt || new Date().toISOString(),
          };
          localStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));
          return sanitized;
        }
      }
    }
    return null;
  } catch {
    return null;
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
    // Sanitize any residual passwords stored under legacy keys
    try {
      localStorage.removeItem(LEGACY_USERS_KEY);
    } catch {
      /* ignore */
    }

    const saved = readProfile();
    const sessionEmail = localStorage.getItem(SESSION_KEY);
    if (saved && (!sessionEmail || sessionEmail.toLowerCase() === saved.email.toLowerCase())) {
      setUser(saved);
    }

    try {
      const n = JSON.parse(localStorage.getItem(NOTICES_KEY) || "null");
      if (Array.isArray(n)) {
        setNotices(n);
      } else {
        const now = Date.now();
        setNotices([
          {
            id: "welcome",
            title: ex.notif.welcome,
            body: ex.notif.welcomeBody,
            at: now,
            read: false,
          },
          {
            id: "ship",
            title: ex.notif.ship,
            body: ex.notif.shipBody,
            at: now - 3600_000,
            read: false,
          },
        ]);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) {
      localStorage.setItem(NOTICES_KEY, JSON.stringify(notices.slice(0, 30)));
    }
  }, [notices, ready]);

  const notify = useCallback((title: string, body?: string) => {
    setNotices((p) => [
      { id: crypto.randomUUID(), title, body, at: Date.now(), read: false },
      ...p,
    ]);
  }, []);

  const saveProfile = useCallback(
    (name: string, email: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name.trim();
      if (!cleanEmail || !cleanName) return false;

      const newUser: User = {
        name: cleanName,
        email: cleanEmail,
        createdAt: user?.createdAt || new Date().toISOString(),
      };

      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(newUser));
        localStorage.setItem(SESSION_KEY, cleanEmail);
      } catch {
        /* storage may be restricted */
      }

      setUser(newUser);
      toast.success(ex.auth.registered, { description: cleanName });
      notify(ex.notif.welcome, ex.notif.welcomeBody);
      return true;
    },
    [user?.createdAt, ex, notify],
  );

  const login = useCallback(
    (email: string) => {
      const cleanEmail = email.trim().toLowerCase();
      const existing = readProfile();
      if (existing && existing.email.toLowerCase() === cleanEmail) {
        localStorage.setItem(SESSION_KEY, cleanEmail);
        setUser(existing);
        toast.success(ex.auth.signedIn, { description: existing.name });
        return true;
      }
      return false;
    },
    [ex],
  );

  const register = useCallback(
    (name: string, email: string) => saveProfile(name, email),
    [saveProfile],
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
    setUser(null);
    toast(ex.auth.signedOut);
  }, [ex]);

  const updateName = useCallback((name: string) => {
    setUser((u) => {
      if (!u) return u;
      const updated = { ...u, name: name.trim() };
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
      return updated;
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
      saveProfile,
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
    [
      user,
      authOpen,
      authMode,
      saveProfile,
      login,
      register,
      logout,
      updateName,
      notices,
      notify,
      ex,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAccount() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAccount must be used within AccountProvider");
  return v;
}
