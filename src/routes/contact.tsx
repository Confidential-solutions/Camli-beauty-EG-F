import { seoHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useLocale } from "@/app/providers";
import { SOCIALS, STORE_URL } from "@/data/products";

export const Route = createFileRoute("/contact")({
  head: () =>
    seoHead({
      path: '/contact',
      title: 'Contact Camli Beauty Egypt — Orders & Skincare Help',
      description: 'Questions about a dilka, body butter or your order? Contact the Camli Beauty Egypt team for help with products and delivery.',
      keywords: ['contact Camli', 'customer service'],
    }),
  component: Contact,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function Contact() {
  const { t } = useLocale();
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const input = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er["name"] = t.contact.errName;
    if (!EMAIL_RE.test(f.email.trim())) er["email"] = t.contact.errEmail;
    if (f.message.trim().length < 10) er["message"] = t.contact.errMessage;
    setErrs(er);
    if (Object.keys(er).length) return;
    setSent(true);
    window.open(`${STORE_URL}/pages/contact`, "_blank", "noopener");
  };

  const field = (k: keyof typeof f, label: string, type = "text") => (
    <div>
      <label htmlFor={k} className="mb-2 block text-sm text-foreground">{label}</label>
      {k === "message" ? (
        <textarea id={k} rows={5} maxLength={1000} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={input} aria-invalid={!!errs[k]} />
      ) : (
        <input id={k} type={type} maxLength={120} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={input} aria-invalid={!!errs[k]} />
      )}
      {errs[k] && <p className="mt-1 text-sm text-destructive">{errs[k]}</p>}
    </div>
  );

  return (
    <div className="container-lux grid gap-16 py-16 md:grid-cols-2">
      <div>
        <h1 className="font-display text-5xl text-foreground">{t.contact.title}</h1>
        <p className="mt-4 text-muted-foreground">{t.contact.subtitle}</p>
        <p className="eyebrow mt-12">{t.contact.social}</p>
        <ul className="mt-4 space-y-2">
          {Object.entries(SOCIALS).map(([k, url]) => (
            <li key={k}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="font-display text-2xl capitalize text-foreground hover:text-primary">{k}</a>
            </li>
          ))}
        </ul>
      </div>
      <form noValidate onSubmit={submit} className="space-y-5">
        {field("name", t.contact.name)}
        {field("email", t.contact.email, "email")}
        {field("phone", t.contact.phone, "tel")}
        {field("message", t.contact.message)}
        <button className="w-full rounded-full bg-primary py-3.5 text-sm text-primary-foreground transition hover:opacity-90">{t.actions.send}</button>
        {sent && <p className="text-sm text-muted-foreground">{t.contact.handoff}</p>}
      </form>
    </div>
  );
}
