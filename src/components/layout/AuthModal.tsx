import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useAccount } from "@/app/account";
import { Logo } from "@/components/shared/Logo";

const field =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30";

export function AuthModal() {
  const { authOpen, setAuthOpen, authMode, setAuthMode, login, register, ex } = useAccount();
  const a = ex.auth;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const isUp = authMode === "register";

  useEffect(() => setErr(null), [authMode, authOpen]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (isUp && name.trim().length < 2) return setErr(a.errName);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr(a.errEmail);
    if (pass.length < 6) return setErr(a.errPass);
    const ok = isUp ? register(name.trim(), email.trim(), pass) : login(email.trim(), pass);
    if (!ok) return setErr(isUp ? a.exists : a.badCreds);
    setAuthOpen(false);
    setPass("");
  };

  return (
    <Dialog open={authOpen} onOpenChange={setAuthOpen}>
      <DialogContent className="max-w-md bg-background p-0">
        <div className="bg-glow px-5 pt-8 text-center sm:px-8">
          <Logo className="mx-auto h-8" />
          <div className="mx-auto mt-6 grid w-full grid-cols-2 rounded-full bg-secondary p-1 text-sm">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAuthMode(m)}
                className="relative rounded-full py-2 text-foreground"
              >
                {authMode === m && (
                  <motion.span layoutId="auth-pill" className="absolute inset-0 rounded-full bg-background shadow-soft" />
                )}
                <span className="relative">{m === "login" ? a.signIn : a.register}</span>
              </button>
            ))}
          </div>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.form
            key={authMode}
            onSubmit={submit}
            initial={{ opacity: 0, x: isUp ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isUp ? -24 : 24 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 px-5 pb-8 pt-4 sm:px-8"
            noValidate
          >
            <div className="text-center">
              <DialogTitle className="font-display text-3xl text-foreground">{isUp ? a.joinUs : a.welcomeBack}</DialogTitle>
              <DialogDescription className="mt-1 text-sm text-muted-foreground">{isUp ? a.subtitleUp : a.subtitleIn}</DialogDescription>
            </div>
            {isUp && <input className={field} placeholder={a.name} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} />}
            <input className={field} type="email" placeholder={a.email} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={120} />
            <input className={field} type="password" placeholder={a.password} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete={isUp ? "new-password" : "current-password"} maxLength={100} />
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <button type="submit" className="btn-lux shadow-glow w-full bg-primary py-3 text-primary-foreground">
              {isUp ? a.submitUp : a.submitIn}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              {isUp ? a.haveAccount : a.noAccount}{" "}
              <button type="button" onClick={() => setAuthMode(isUp ? "login" : "register")} className="text-primary underline-offset-4 hover:underline">
                {isUp ? a.switchIn : a.switchUp}
              </button>
            </p>
          </motion.form>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
