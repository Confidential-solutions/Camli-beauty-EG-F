import { Link } from "@tanstack/react-router";
import { Bell, LogOut, User as UserIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAccount } from "@/app/account";
import { useLocale } from "@/app/providers";

const iconBtn =
  "relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-secondary sm:h-10 sm:w-10";

function ago(at: number, locale: string) {
  const s = Math.round((at - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (Math.abs(s) < 60) return rtf.format(s, "second");
  if (Math.abs(s) < 3600) return rtf.format(Math.round(s / 60), "minute");
  if (Math.abs(s) < 86400) return rtf.format(Math.round(s / 3600), "hour");
  return rtf.format(Math.round(s / 86400), "day");
}

export function NotificationBell() {
  const { notices, unread, markAllRead, clearNotices, ex } = useAccount();
  const { locale } = useLocale();
  return (
    <Popover>
      <PopoverTrigger className={iconBtn} aria-label={`${ex.notif.title} (${unread})`}>
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute end-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-primary-foreground">
            <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-40" />
            <span className="relative">{unread}</span>
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 bg-popover p-0">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
          <p className="min-w-0 font-display text-lg text-foreground">{ex.notif.title}</p>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-xs text-primary hover:underline">
              {ex.notif.markAll}
            </button>
          )}
        </div>
        <ul className="max-h-80 overflow-y-auto">
          {notices.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">
              {ex.notif.empty}
            </li>
          )}
          {notices.map((n) => (
            <li key={n.id} className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-transparent" : "bg-primary"}`}
              />
              <div className="min-w-0">
                <p className="text-sm text-foreground">{n.title}</p>
                {n.body && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                )}
                <p className="mt-1 text-[11px] text-muted-foreground">{ago(n.at, locale)}</p>
              </div>
            </li>
          ))}
        </ul>
        {notices.length > 0 && (
          <button
            onClick={clearNotices}
            className="w-full border-t border-border py-2 text-xs text-muted-foreground hover:text-foreground"
          >
            {ex.notif.clear}
          </button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function AccountButton() {
  const { user, openAuth, logout, ex } = useAccount();
  if (!user)
    return (
      <button className={iconBtn} onClick={() => openAuth("login")} aria-label={ex.auth.signIn}>
        <UserIcon className="h-5 w-5" />
      </button>
    );
  const initials = user.name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Popover>
      <PopoverTrigger className={iconBtn} aria-label={ex.profileNav}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {initials}
        </span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-60 bg-popover p-2">
        <div className="px-3 py-2">
          <p className="truncate text-sm text-foreground">{user.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <Link
          to="/profile"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary"
        >
          <UserIcon className="h-4 w-4" /> {ex.profile.title}
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" /> {ex.profile.signOut}
        </button>
      </PopoverContent>
    </Popover>
  );
}
