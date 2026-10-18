import { createFileRoute } from "@tanstack/react-router";
import { products, lowestPrice, isAvailable } from "@/data/products";

const MODEL = "openai/gpt-6-astra";

function catalog(locale: "en" | "ar") {
  return products
    .map(
      (p) =>
        `- ${p.title[locale]} (${p.category}) — from ${lowestPrice(p)} EGP${isAvailable(p) ? "" : " [sold out]"}: ${p.tagline[locale]}. ${p.description[locale].slice(0, 300)} Benefits: ${p.benefits.map((b) => b[locale]).join("; ")}. Link: /products/${p.handle}`,
    )
    .join("\n");
}

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Chat is not configured.", { status: 500 });
        let body: { messages?: { role: string; content: string }[]; locale?: string };
        try {
          body = await request.json();
        } catch {
          return new Response("Bad request", { status: 400 });
        }
        const locale = body.locale === "ar" ? "ar" : "en";
        const msgs = (body.messages ?? [])
          .filter(
            (m) =>
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string" &&
              m.content,
          )
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
        if (!msgs.length) return new Response("Bad request", { status: 400 });

        const instructions = `You are the Camli Beauty Egypt advisor, a warm skincare guide for heritage Sudanese beauty rituals. Answer only about Camli products, rituals, skincare usage, shipping (free delivery across Egypt above 1,500 EGP). Reply in the user's language (default ${locale === "ar" ? "Arabic" : "English"}). Keep answers short (under 120 words), plain text, no markdown tables. Never invent products.\n\nProducts:\n${catalog(locale)}`;

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "fetch",
          },
          body: JSON.stringify({
            model: MODEL,
            instructions,
            input: msgs,
            stream: true,
            store: false,
            reasoning: { effort: "low" },
          }),
          signal: request.signal,
        });

        if (!upstream.ok || !upstream.body) {
          const msg =
            upstream.status === 429
              ? locale === "ar"
                ? "الطلبات كثيرة، حاولي بعد قليل."
                : "Too many requests, please try again shortly."
              : upstream.status === 402
                ? locale === "ar"
                  ? "رصيد الذكاء الاصطناعي انتهى."
                  : "AI credits are used up for now."
                : locale === "ar"
                  ? "تعذّر الرد الآن."
                  : "Sorry, I couldn't answer right now.";
          return new Response(msg, { status: upstream.status });
        }

        const reader = upstream.body.getReader();
        const dec = new TextDecoder();
        const enc = new TextEncoder();
        const stream = new ReadableStream<Uint8Array>({
          async start(ctrl) {
            let buf = "";
            try {
              for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += dec.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";
                for (const line of lines) {
                  if (!line.startsWith("data:")) continue;
                  const data = line.slice(5).trim();
                  if (!data || data === "[DONE]") continue;
                  try {
                    const ev = JSON.parse(data);
                    if (ev.type === "response.output_text.delta" && ev.delta)
                      ctrl.enqueue(enc.encode(ev.delta));
                  } catch {
                    /* partial */
                  }
                }
              }
            } catch {
              /* aborted */
            }
            ctrl.close();
          },
          cancel() {
            reader.cancel().catch(() => {});
          },
        });
        const headers = new Headers({
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
        });
        upstream.headers.forEach((v, k) => {
          if (k.toLowerCase().startsWith("x-lovable-aig-")) headers.set(k, v);
        });
        return new Response(stream, { headers });
      },
    },
  },
});
