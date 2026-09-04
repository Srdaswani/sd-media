import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Instant publish.
 *
 * Galleries rebuild on their own every five minutes, which is fine day to day.
 * When he wants a gallery live the moment it finishes uploading, Cloudinary can
 * call this on upload (Settings → Webhooks) or he can just open the URL:
 *
 *   /api/revalidate?secret=…&path=/work/football
 *
 * The secret stops anyone else forcing rebuilds against the free-tier quota.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, message: "REVALIDATE_SECRET is not set on this deployment." },
      { status: 501 },
    );
  }
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, message: "Wrong or missing secret." },
      { status: 401 },
    );
  }

  const path = searchParams.get("path");
  const paths = path ? [path] : ["/", "/work", "/film"];
  paths.forEach((p) => revalidatePath(p));

  return NextResponse.json({ ok: true, revalidated: paths, at: Date.now() });
}

export async function POST(request: Request) {
  return GET(request);
}
