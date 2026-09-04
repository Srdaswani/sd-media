import Link from "next/link";
import { site, visible } from "@/content/site.config";
import { getPhotos, transform } from "@/lib/media";
import type { Photo } from "@/lib/media";
import s from "./page.module.css";

export const revalidate = 300;

/** Newest frame from each of the first four sports, so the strip changes on
 *  its own every time he uploads. No "featured work" list to maintain. */
async function recent(): Promise<Photo[]> {
  const cats = visible().slice(0, 4);
  const sets = await Promise.all(cats.map((c) => getPhotos(c.slug)));
  return sets.map((set) => set[0]).filter((p): p is Photo => Boolean(p));
}

export default async function Home() {
  const frames = await recent();
  const url = (p: Photo) =>
    p.src.includes("/image/upload/") ? transform(p.src, 800) : p.src;

  return (
    <div className="shell">
      <section className={s.hero}>
        <img
          className={s.heroImg}
          src={site.portrait.src}
          srcSet={site.portrait.srcSet}
          sizes="100vw"
          alt={site.portrait.alt}
          width={site.portrait.width}
          height={site.portrait.height}
          fetchPriority="high"
          decoding="sync"
        />
        <div className={s.heroType}>
          <h1 className={`${s.heroLine} ${s.reveal}`}>Shot at the last light</h1>
          <p className={`${s.heroSub} ${s.reveal}`}>
            Sports photography and film for athletes and teams around{" "}
            {site.location}.
          </p>
        </div>
      </section>

      {frames.length > 0 && (
        <section className={s.strip}>
          <div className={s.stripHead}>
            <h2>Latest</h2>
            <Link href="/work" className={s.stripLink}>
              All work
            </Link>
          </div>
          <div className={s.stripGrid}>
            {frames.map((p) => (
              <Link
                key={p.id}
                href={`/work/${p.id.split("/").at(-2) ?? ""}`}
                className={s.stripCell}
              >
                <img
                  src={url(p)}
                  alt={p.alt}
                  width={800}
                  height={533}
                  loading="lazy"
                  decoding="async"
                  style={{
                    aspectRatio: "3 / 2",
                    objectFit: "cover",
                    backgroundColor: p.tone,
                    width: "100%",
                  }}
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={s.say}>
        <p className={s.sayKey}>What this is</p>
        <div className={s.sayBody}>
          <p>
            I shoot high school and club sport across the Triangle — the whole
            game, both sidelines, and the ten minutes afterwards that usually
            matter more than the score.
          </p>
          <p>
            Galleries go up within a couple of days. Every frame here was taken
            at a real game, and the capture settings are attached to each one if
            you want to see how it was made.
          </p>
        </div>
      </section>
    </div>
  );
}
