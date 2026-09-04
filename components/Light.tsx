"use client";

import { useEffect } from "react";

/**
 * The accent tracks the visitor's own clock.
 *
 * A sports photographer sells golden hour, so the site's light is not a fixed
 * swatch — it moves along the amber range the same way the sky in the portrait
 * does. Four discrete steps, no animation, roughly six degrees of hue between
 * the extremes. Most people will never consciously notice it; it is the
 * difference between a palette and a point of view.
 *
 * All values stay above the contrast ratios recorded in PROJECT.md.
 */
const LIGHT: Record<string, { ember: string; flare: string }> = {
  //           on apricot   on black
  dawn: { ember: "#a8431f", flare: "#e8813f" },
  day: { ember: "#a05018", flare: "#e79436" },
  golden: { ember: "#ab4413", flare: "#ec8630" },
  night: { ember: "#9e4a26", flare: "#dd8a4a" },
};

export default function Light() {
  useEffect(() => {
    const apply = () => {
      const h = new Date().getHours();
      const key = h < 8 ? "dawn" : h < 16 ? "day" : h < 20 ? "golden" : "night";
      const { ember, flare } = LIGHT[key];
      const root = document.documentElement;
      root.style.setProperty("--ember", ember);
      root.style.setProperty("--flare", flare);
      root.dataset.light = key;
    };
    apply();
    // Re-check hourly so a tab left open overnight is not stuck at noon.
    const t = setInterval(apply, 60 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  return null;
}
