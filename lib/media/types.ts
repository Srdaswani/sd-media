export type Capture = {
  camera?: string;
  lens?: string;
  focal?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  shotAt?: string;
};

export type Photo = {
  id: string;
  /** Base delivery URL without transformations. */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Flat colour painted behind the frame while it loads. Never grey. */
  tone: string;
  featured: boolean;
  capture: Capture;
};

export type Film = {
  id: string;
  title: string;
  /** YouTube video id. */
  videoId: string;
  poster: string;
  publishedAt: string;
  /** Category slug, or "film" for the general reel. */
  category: string;
};

/**
 * A frame that hasn't loaded yet is filled with a colour from the site's own
 * sky, chosen deterministically from the file's id so it never flickers between
 * renders. Grey skeletons read as unfinished; a warm tone reads as a lightbox
 * with the light already on. Costs nothing: no extra request, no LQIP payload.
 */
const SKY_TONES = [
  "#E9C79E",
  "#E3B98C",
  "#DDAC7C",
  "#D69E6E",
  "#C98F66",
  "#BE8467",
];

export function toneFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return SKY_TONES[h % SKY_TONES.length];
}
