import type { Metadata } from "next";
import { site } from "@/content/site.config";
import s from "../page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `About SD MEDIA, sports photography and film in ${site.location}.`,
};

export default function About() {
  return (
    <div className="shell">
      <div className={s.pageHead}>
        <h1>About</h1>
      </div>

      <div className={s.aboutGrid}>
        <div>
          <p>
            I am a sports photographer working out of {site.location}. Most
            weeks that means two or three games — football under lights on
            Friday, lacrosse or soccer through the weekend, and whatever the
            spring season is running.
          </p>
          <p>
            I shoot from the sideline with long glass and I stay after the
            whistle. The photograph a family actually keeps is rarely the one
            from the play; it is usually the walk off the field.
          </p>
          <p>
            Galleries go up within a couple of days of a game and stay up. If
            you need a frame at print size, or you want the raw file, ask.
          </p>
        </div>

        {/* The self-portrait, shown at the size it deserves rather than as a
            circular avatar. It is a photograph, and it is the reason the rest
            of this site is the colour it is. */}
        <figure style={{ margin: 0 }}>
          <img
            src={site.portrait.src}
            srcSet={site.portrait.srcSet}
            sizes="(max-width: 48rem) 100vw, 45vw"
            alt={site.portrait.alt}
            width={site.portrait.width}
            height={site.portrait.height}
            loading="lazy"
            decoding="async"
            style={{ width: "100%", backgroundColor: "#dda771" }}
          />
          <figcaption className="dense" style={{ marginTop: "var(--s3)" }}>
            Self-portrait, golden hour. The colours on this site are sampled
            from this frame.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
