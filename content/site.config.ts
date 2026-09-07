/**
 * The only file you edit by hand.
 *
 * To add a sport: add three lines below, then make a Cloudinary folder with the
 * same `slug` under `sd-media/`. Photos you drop in that folder appear on the
 * site within five minutes. You never touch code again after this.
 *
 * To reorder the index: move the entries around. Order here is order on screen.
 * To hide a sport temporarily: set `draft: true`.
 */

export type Category = {
  /** URL and Cloudinary folder name. Lowercase, no spaces. */
  slug: string;
  /** How it reads on screen. */
  name: string;
  /** One line under the name on the index. Keep it concrete. */
  blurb: string;
  /** YouTube playlist ID for this sport's films. Leave empty for none. */
  playlist?: string;
  /** Hide from the site without deleting the entry. */
  draft?: boolean;
};

export const site = {
  name: "SD MEDIA",
  owner: "Sameer Daswani",
  /** Shown in the browser tab and on social cards. */
  tagline: "Sports photography and film",
  location: "Cary, North Carolina",
  email: "sameer.daswani.09@gmail.com",
  instagram: "media.by.sd",
  /** Used for absolute URLs in social cards and the sitemap. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sd-media.vercel.app",
  /**
   * The self-portrait. Lives in /public so it is never a network round-trip to a
   * third party on first paint. This is the largest element on the landing page
   * and it decides the site's speed score.
   */
  portrait: {
    src: "/portrait.jpg",
    /** Pre-generated widths. The 24-megapixel original is 5 MB; a phone gets
     *  the 640px version at 19 KB and never sees the difference. */
    srcSet:
      "/portrait-640.jpg 640w, /portrait-1024.jpg 1024w, " +
      "/portrait-1600.jpg 1600w, /portrait-2200.jpg 2200w",
    width: 1600,
    height: 1067,
    alt:
      "Sameer Daswani in silhouette against an orange sunset sky, " +
      "raising a camera to his eye.",
  },
} as const;

export const categories: Category[] = [
  {
    slug: "football",
    name: "Football",
    blurb: "Friday nights under the lights.",
  },
  {
    slug: "lacrosse",
    name: "Lacrosse",
    blurb: "Fast hands and long shadows on spring turf.",
  },
  {
    slug: "soccer",
    name: "Soccer",
    blurb: "Ninety minutes, worked from both touchlines.",
  },
  {
    slug: "basketball",
    name: "Basketball",
    blurb: "Gym light is hard light. That's the whole appeal.",
  },
  {
    slug: "volleyball",
    name: "Volleyball",
    blurb: "That half second at the top of a jump.",
  },
  {
    slug: "portraits",
    name: "Portraits",
    blurb: "Senior nights, signing days, and headshots that hold up.",
  },
];

export const visible = () => categories.filter((c) => !c.draft);

export const bySlug = (slug: string) =>
  categories.find((c) => c.slug === slug && !c.draft);
