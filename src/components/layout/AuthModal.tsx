import { useEffect, useState, type FormEvent } from "react";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { OFFICIAL_SHOPIFY_LOGIN_URL, useAccount } from "@/app/account";
import { Logo } from "@/components/shared/Logo";

const field =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";

export function AuthModal() {
  const { authOpen, setAuthOpen, user, saveProfile, ex } = useAccount();
  const a = ex.auth;
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setErr(null);
  }, [authOpen, user]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setErr(a.errName);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr(a.errEmail);

    const ok = saveProfile(name.trim(), email.trim());
    if (!ok) return setErr(a.badCreds);
    setAuthOpen(false);
  };

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="max-w-md bg-background p-0">
        <div className="bg-glow px-5 pt-8 text-center sm:px-8">
          <Logo className="mx-auto h-8" />
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>{a.welcomeBack}</span>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5 pb-6 pt-2 sm:px-8" noValidate>
          <div className="text-center">
            <DialogTitle className="font-display text-2xl text-foreground">
              {user ? a.welcomeBack : a.joinUs}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              {a.subtitleUp}
            </DialogDescription>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{a.name}</label>
            <input
              className={field}
              placeholder={a.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={80}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {a.email}
            </label>
            <input
              className={field}
              type="email"
              placeholder={a.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              maxLength={120}
            />
          </div>

          {err && (
            <p role="alert" className="text-xs text-destructive">
              {err}
            </p>
          )}

          <button
            type="submit"
            className="btn-lux shadow-glow w-full bg-primary py-3 text-primary-foreground"
          >
            {a.submitUp}
          </button>

          <div className="border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">{a.officialShopifyDesc}</p>
            <a
              href={OFFICIAL_SHOPIFY_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <span>{a.officialShopifyLink}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
