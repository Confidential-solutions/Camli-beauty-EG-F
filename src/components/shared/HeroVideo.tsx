import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { brandMedia } from "@/data/brand";

interface Props {
  eyebrow: string;
  title1: string;
  title2: string;
  body: string;
  shopThis: string;
  shopAll: string;
}

export function HeroVideo({ eyebrow, title1, title2, body, shopThis, shopAll }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      setPlaying(false);
      return;
    }
    v.play().catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative -mt-px h-[calc(100svh-6rem)] min-h-[560px] w-full overflow-hidden bg-image-bg">
      <video
        ref={ref}
        src={brandMedia.video}
        poster={brandMedia.videoPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="bg-hero-scrim pointer-events-none absolute inset-0" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-hero-ink">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs uppercase tracking-[0.32em]"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="mt-5 font-display text-5xl leading-[1.1] md:text-7xl"
        >
          {title1} <em className="not-italic">{title2}</em>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="mt-5 max-w-xl text-sm leading-relaxed md:text-base"
        >
          {body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex flex-wrap justify-center gap-4 md:mt-16 md:gap-5"
        >
          <Link to="/products/$handle" params={{ handle: "nayra-hibiscus-dilka" }} className="btn-hero">
            {shopThis}
          </Link>
          <Link to="/shop" className="btn-hero">
            {shopAll}
          </Link>
        </motion.div>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-6 end-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-hero-ink-foreground/70 text-hero-ink backdrop-blur transition hover:bg-hero-ink-foreground"
      >
        {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
      </button>
    </section>
  );
}
