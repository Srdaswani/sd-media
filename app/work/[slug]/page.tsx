import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { bySlug, visible, site } from "@/content/site.config";
import { getPhotos, transform } from "@/lib/media";
import Gallery from "@/components/Gallery";
import Surface from "@/components/Surface";

export const revalidate = 300;

/** Every gallery is pre-built at deploy time, so the first visitor to any
 *  sport gets HTML from the edge rather than waiting on an API call. */
export function generateStaticParams() {
  return visible().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = bySlug(slug);
  if (!cat) return {};

  const photos = await getPhotos(slug);
  const cover = photos[0];
  const image = cover
    ? cover.src.includes("/image/upload/")
      ? transform(cover.src, 1200)
      : `${site.url}${cover.src}`
    : `${site.url}${site.portrait.src}`;

  return {
    title: cat.name,
    description: cat.blurb,
    openGraph: {
      title: `${cat.name} — ${site.name}`,
      description: cat.blurb,
      images: [{ url: image, width: 1200, height: 800 }],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = bySlug(slug);
  if (!cat) notFound();

  const photos = await getPhotos(slug);

  return (
    <Surface tone="dark">
      <div className="shell">
        <Gallery photos={photos} title={cat.name} blurb={cat.blurb} />
      </div>
    </Surface>
  );
}
