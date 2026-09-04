/**
 * Pure URL construction, importable from client components.
 *
 * Kept apart from index.ts on purpose: that module reads the filesystem for the
 * fallback manifest, and pulling it into a "use client" component would drag
 * node:fs into the browser bundle. This file has no imports at all.
 */

/**
 * `f_auto` serves AVIF to browsers that take it and WebP to the rest; `q_auto`
 * picks a quality per image instead of applying one blunt number to all of
 * them. Together they are what stops a 6000px original reaching a phone.
 */
export function transform(src: string, width: number, extra = ""): string {
  if (!src.includes("/image/upload/")) return src;
  const t = ["f_auto", "q_auto", `w_${width}`, "c_limit", extra]
    .filter(Boolean)
    .join(",");
  return src.replace("/image/upload/", `/image/upload/${t}/`);
}

/** The widths a phone, tablet and desktop actually need. Nothing above 2400. */
export const WIDTHS = [400, 800, 1200, 1600, 2400];

export function srcSetFor(src: string): string | undefined {
  if (!src.includes("/image/upload/")) return undefined;
  return WIDTHS.map((w) => `${transform(src, w)} ${w}w`).join(", ");
}
