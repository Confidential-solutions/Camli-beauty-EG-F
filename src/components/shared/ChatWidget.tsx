import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, Send, X } from "lucide-react";
import { useAccount } from "@/app/account";
import { useLocale } from "@/app/providers";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const { ex } = useAccount();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [msgs, open]);
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const history: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/public/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12), locale }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body)
        throw new Error((await res.text().catch(() => "")) || ex.chat.error);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => [...m.slice(0, -1), { role: "assistant", content: acc }]);
      }
      if (!acc) throw new Error(ex.chat.error);
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setMsgs((m) => [
        ...m.slice(0, -1),
        { role: "assistant", content: (err as Error).message || ex.chat.error },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label={ex.chat.open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 end-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "c"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 end-4 z-50 flex h-[32rem] max-h-[75vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-lift sm:end-6"
            role="dialog"
            aria-label={ex.chat.title}
          >
            <div className="flex items-center gap-3 bg-primary px-5 py-4 text-primary-foreground">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15 font-display text-xl">
                C
              </span>
              <div>
                <p className="font-display text-lg leading-tight">{ex.chat.title}</p>
                <p className="text-xs opacity-80">{ex.chat.subtitle}</p>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              <Bubble role="assistant" content={ex.chat.hello} />
              {msgs.map((m, i) => (
                <Bubble
                  key={i}
                  role={m.role}
                  content={m.content}
                  typing={busy && i === msgs.length - 1 && !m.content}
                />
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="flex items-center gap-2 border-t border-border p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={ex.chat.placeholder}
                maxLength={500}
                className="flex-1 rounded-full bg-secondary px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={ex.chat.send}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition disabled:opacity-40"
              >
                <Send className="h-4 w-4 rtl:-scale-x-100" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, content, typing }: Msg & { typing?: boolean }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${mine ? "rounded-ee-sm bg-primary text-primary-foreground" : "rounded-es-sm bg-secondary text-secondary-foreground"}`}
      >
        {typing ? (
          <span className="flex gap-1 py-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-current"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        ) : (
          content
        )}
      </div>
    </div>
  );
}
