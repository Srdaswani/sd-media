import type { Capture, Photo } from "./types";
import { toneFor } from "./types";
export { transform } from "./url";

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME;
const KEY = process.env.CLOUDINARY_API_KEY;
const SECRET = process.env.CLOUDINARY_API_SECRET;
/** Everything lives under one root folder so the account stays tidy. */
const ROOT = process.env.CLOUDINARY_ROOT_FOLDER ?? "sd-media";

export const cloudinaryConfigured = Boolean(CLOUD && KEY && SECRET);

export function deliveryBase(): string {
  return `https://res.cloudinary.com/${CLOUD}/image/upload`;
}

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  tags?: string[];
  context?: { custom?: Record<string, string> };
  image_metadata?: Record<string, string>;
  colors?: [string, number][];
};

function normaliseCapture(m: Record<string, string> = {}): Capture {
  const get = (...keys: string[]) => {
    for (const k of keys) if (m[k]) return String(m[k]).trim();
    return undefined;
  };

  const make = get("Make");
  const model = get("Model");
  // "Canon" + "Canon EOS R6" should not read "Canon Canon EOS R6".
  const camera =
    model && make && !model.toLowerCase().startsWith(make.toLowerCase())
      ? `${make} ${model}`
      : model ?? make;

  const focalRaw = get("FocalLength", "FocalLengthIn35mmFilm");
  const focal = focalRaw ? `${parseFloat(focalRaw)}mm` : undefined;

  const fRaw = get("FNumber", "ApertureValue");
  const aperture = fRaw ? `f/${Number(parseFloat(fRaw).toFixed(1))}` : undefined;

  // EXIF gives shutter as a decimal; photographers read it as a fraction.
  const sRaw = get("ExposureTime", "ShutterSpeedValue");
  let shutter: string | undefined;
  if (sRaw) {
    const v = parseFloat(sRaw);
    if (Number.isFinite(v) && v > 0) {
      shutter = v >= 1 ? `${Number(v.toFixed(1))}s` : `1/${Math.round(1 / v)}`;
    } else if (sRaw.includes("/")) {
      shutter = sRaw;
    }
  }

  const isoRaw = get("ISO", "ISOSpeedRatings", "PhotographicSensitivity");
  const iso = isoRaw ? `ISO ${parseInt(isoRaw, 10)}` : undefined;

  return {
    camera,
    lens: get("LensModel", "Lens", "LensSpecification"),
    focal,
    aperture,
    shutter,
    iso,
    shotAt: get("DateTimeOriginal", "DateTime"),
  };
}

function toPhoto(r: CloudinaryResource, category: string): Photo {
  const custom = r.context?.custom ?? {};
  const capture = normaliseCapture(r.image_metadata);
  const leaf = r.public_id.split("/").pop() ?? r.public_id;

  return {
    id: r.public_id,
    src: r.secure_url,
    width: r.width,
    height: r.height,
    // Cloudinary's "Description" context field is the alt text if it's filled
    // in; otherwise we describe what we actually know rather than leaving it
    // empty or repeating the filename at a screen reader.
    alt:
      custom.alt ??
      custom.caption ??
      `${category} photograph by SD MEDIA` +
        (capture.shotAt ? `, ${capture.shotAt.slice(0, 10)}` : ""),
    tone: r.colors?.[0]?.[0] ?? custom.tone ?? toneFor(leaf),
    featured: (r.tags ?? []).includes("featured"),
    capture,
  };
}

async function search(expression: string, max = 200) {
  const auth = Buffer.from(`${KEY}:${SECRET}`).toString("base64");
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD}/resources/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression,
        max_results: Math.min(max, 500),
        sort_by: [{ created_at: "desc" }],
        with_field: ["image_metadata", "tags", "context"],
      }),
      // Rendered on the server and cached at Vercel's edge. A visitor in Manila
      // and a visitor in Cary both get the same pre-built HTML.
      next: { revalidate: 300 },
    },
  );

  if (!res.ok) {
    throw new Error(
      `Cloudinary responded ${res.status}. Check the three env vars in SETUP.md.`,
    );
  }
  return (await res.json()) as { resources: CloudinaryResource[] };
}

export async function photosIn(category: string): Promise<Photo[]> {
  const { resources } = await search(
    `asset_folder="${ROOT}/${category}" AND resource_type:image AND -tags=hidden`,
  );
  const photos = resources.map((r) => toPhoto(r, category));
  // Tagging a frame "featured" in Cloudinary pulls it to the front of the set.
  // That is the whole ordering system, and it needs no code change.
  return [...photos.filter((p) => p.featured), ...photos.filter((p) => !p.featured)];
}

export async function coverFor(category: string): Promise<Photo | null> {
  const photos = await photosIn(category);
  return photos[0] ?? null;
}

export async function countIn(category: string): Promise<number> {
  return (await photosIn(category)).length;
}
