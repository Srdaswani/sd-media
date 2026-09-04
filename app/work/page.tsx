import type { Metadata } from "next";
import { visible } from "@/content/site.config";
import { getPhotos } from "@/lib/media";
import Index, { type IndexEntry } from "@/components/Index";
import s from "../page.module.css";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Work",
  description:
    "Football, lacrosse, soccer, basketball, volleyball and portrait galleries.",
};

export default async function WorkIndex() {
  const cats = visible();
  const entries: IndexEntry[] = await Promise.all(
    cats.map(async (c) => {
      const photos = await getPhotos(c.slug);
      return {
        slug: c.slug,
        name: c.name,
        blurb: c.blurb,
        count: photos.length,
        cover: photos[0] ?? null,
      };
    }),
  );

  return (
    <div className="shell">
      <div className={s.pageHead}>
        <h1>Work</h1>
      </div>
      <Index entries={entries} />
    </div>
  );
}
