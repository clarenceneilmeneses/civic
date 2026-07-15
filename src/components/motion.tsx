"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Scroll-reveal wrapper. The hidden state lives in CSS (`[data-reveal]` in
 * globals.css) so it paints correctly on the server render; this component only
 * flips `data-shown` once the element crosses into view, then stops observing.
 * Reduced-motion users and no-JS readers get the content immediately — see the
 * `[data-reveal]` rules and the <noscript> override in the root layout.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in ms. Keep under ~240 so a grid never feels slow. */
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "dl" | "ul";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia(REDUCED).matches) {
      el.dataset.shown = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = "true";
          io.unobserve(entry.target);
        }
      },
      {
        // Bottom -10%: fire just before the element is fully on screen, so the
        // motion finishes about when the reader's eye arrives.
        //
        // Top +100000px: everything above the viewport counts as intersecting.
        // Without it, a jump that skips an element entirely — an anchor link,
        // scroll restoration on refresh, a deep link like /#find-your-thing —
        // takes its ratio from 0 straight back to 0. That crosses no threshold,
        // so no callback is ever delivered and the content stays invisible for
        // good. Treating "already passed" as intersecting means the element is
        // revealed on the observer's first delivery instead.
        rootMargin: "100000px 0px -10% 0px",
        threshold: 0.08,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/**
 * Translates its children against the scroll, peaking at ±`amount` px as the
 * section crosses the viewport. The offset is driven off the *parent* box, so
 * the wrapper itself can be an overscanned layer (taller than the section it
 * sits in) without skewing the math.
 *
 * Deliberately not `background-attachment: fixed` — that is broken on iOS
 * Safari, which is the primary target here.
 */
export function Parallax({
  children,
  className,
  amount = 60,
}: {
  children: React.ReactNode;
  className?: string;
  /** Peak displacement in px. Must stay <= the layer's overscan. */
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const anchor = el?.parentElement;
    if (!el || !anchor) return;
    if (window.matchMedia(REDUCED).matches) return;

    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const rect = anchor.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // -1 when the section sits just below the fold, +1 just above it.
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const y = Math.max(-1, Math.min(1, progress)) * amount;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };

    // Only listen while the section is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) update();
      },
      { rootMargin: "10% 0px" }
    );

    io.observe(anchor);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [amount]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
