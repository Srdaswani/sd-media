import { promises as fs } from "node:fs";
import path from "node:path";
import type { Film, Photo } from "./types";
import { toneFor } from "./types";
import * as cloud from "./cloudinary";

export type { Photo, Film, Capture } from "./types";
export { transform, srcSetFor } from "./url";

/* ------------------------------------------------------------------ photos */

/**
 * Two sources, one interface. Cloudinary when it's configured, a checked-in
 * manifest when it isn't — so the site builds, deploys and looks finished
 * before anyone has signed up for anything. It also means one vendor outage,
 * or one change to somebody's free tier, is a config change and not a rewrite.
 */
type Manifest = Record<
  string,
  { file: string; width: number; height: number; alt: string }[]
>;

let manifestCache: Manifest | null = null;

async function manifest(): Promise<Manifest> {
  if (manifestCache) return manifestCache;
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "content", "manifest.json"),
      "utf8",
    );
    manifestCache = JSON.parse(raw) as Manifest;
  } catch {
    manifestCache = {};
  }
  return manifestCache;
}

async function localPhotos(category: string): Promise<Photo[]> {
  const m = await manifest();
  return (m[category] ?? []).map((f) => ({
    id: `${category}/${f.file}`,
    src: `/photos/${category}/${f.file}`,
    width: f.width,
    height: f.height,
    alt: f.alt,
    tone: toneFor(f.file),
    featured: false,
    capture: {},
  }));
}

export async function getPhotos(category: string): Promise<Photo[]> {
  if (!cloud.cloudinaryConfigured) return localPhotos(category);
  try {
    return await cloud.photosIn(category);
  } catch (err) {
    // A failed API call must not blank the page. Serve whatever is checked in
    // and let the error surface in the server log, not in the visitor's face.
    console.error(`[media] Cloudinary read failed for "${category}":`, err);
    return localPhotos(category);
  }
}

export async function getCover(category: string): Promise<Photo | null> {
  return (await getPhotos(category))[0] ?? null;
}

/* ------------------------------------------------------------------- films */

const YT_KEY = process.env.YOUTUBE_API_KEY;

/**
 * Video lives on YouTube rather than Cloudinary on purpose: Cloudinary's free
 * tier allows 1GB of *video* bandwidth a month, which a handful of visitors
 * would burn through in an afternoon. YouTube is unmetered and adaptive, so a
 * phone on cellular at a field gets a stream it can actually play.
 */
export async function getFilms(playlistId?: string, category = "film"): Promise<Film[]> {
  if (!YT_KEY || !playlistId) return [];
  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("playlistId", playlistId);
    url.searchParams.set("key", YT_KEY);

    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`YouTube responded ${res.status}`);
    const data = (await res.json()) as {
      items?: {
        snippet: {
          title: string;
          publishedAt: string;
          resourceId: { videoId: string };
          thumbnails: Record<string, { url: string }>;
        };
      }[];
    };

    return (data.items ?? [])
      .filter((i) => i.snippet.title !== "Private video")
      .map((i) => ({
        id: i.snippet.resourceId.videoId,
        title: i.snippet.title,
        videoId: i.snippet.resourceId.videoId,
        poster:
          i.snippet.thumbnails.maxres?.url ??
          i.snippet.thumbnails.standard?.url ??
          i.snippet.thumbnails.high?.url ??
          `https://i.ytimg.com/vi/${i.snippet.resourceId.videoId}/hqdefault.jpg`,
        publishedAt: i.snippet.publishedAt,
        category,
      }));
  } catch (err) {
    console.error("[media] YouTube read failed:", err);
    return [];
  }
}

export const sourcesConfigured = {
  photos: cloud.cloudinaryConfigured,
  films: Boolean(YT_KEY),
};
