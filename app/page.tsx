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
                style={
                  { "--ar-num": (p.width / p.height).toFixed(4) } as React.CSSProperties
                }
              >
                <img
                  src={url(p)}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  style={{ backgroundColor: p.tone }}
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
            I shoot high school and club sports around the Triangle. The whole
            game, both sidelines, and the ten minutes after the whistle that
            usually matter more than the score did.
          </p>
          <p>
            Galleries go up within a couple of days of a game. Every frame here
            came off a real sideline, and the camera settings sit on each one if
            you want to see how it was shot.
          </p>
        </div>
      </section>
    </div>
  );
}
