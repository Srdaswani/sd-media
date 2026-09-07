import type { Metadata } from "next";
import { site } from "@/content/site.config";
import s from "../page.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `About ${site.owner} of SD MEDIA, sports photography and film in ${site.location}.`,
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
            I'm {site.owner}. I shoot sports out of {site.location}, mostly high
            school and club. In a normal week that's two or three games. Football
            on Friday, then whatever the weekend holds.
          </p>
          <p>
            I work the sideline with long glass and I stay past the whistle. The
            photo a family actually prints is almost never the one from the play.
            It's the walk off the field, or the look on the bench with four
            minutes left.
          </p>
          <p>
            Galleries go up a couple of days after a game and they stay up. If
            you want a frame at print size, or you want the raw file, just ask.
          </p>
        </div>

        {/* The self-portrait at the size it deserves, not cropped into a
            circular avatar. It's a photograph, and it's the reason the rest of
            this site is the colour it is. */}
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
            Self-portrait, golden hour. Every colour on this site was pulled out
            of this frame.
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
