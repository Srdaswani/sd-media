import type { Metadata } from "next";
import { site } from "@/content/site.config";
import s from "../page.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Book SD MEDIA for a game, a season, or portraits in ${site.location}.`,
};

export default function Contact() {
  return (
    <div className="shell">
      <div className={s.pageHead}>
        <h1>Book a game</h1>
        <p className="lead">
          Tell me the sport, the date and the field. I will confirm the same day
          and send back what a gallery costs for that game.
        </p>
      </div>

      <div className={s.contact}>
        <div>
          <p className={s.contactKey}>Email</p>
          <p className={s.contactVal}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div>
          <p className={s.contactKey}>Instagram</p>
          <p className={s.contactVal}>
            <a
              href={`https://instagram.com/${site.instagram}`}
              rel="me noopener"
              target="_blank"
            >
              @{site.instagram}
            </a>
          </p>
        </div>
        <div>
          <p className={s.contactKey}>Based in</p>
          <p className={s.contactVal}>{site.location}</p>
        </div>
        <div>
          <p className={s.contactKey}>Travels for</p>
          <p className={s.contactVal}>The Triangle and eastern NC</p>
        </div>
      </div>
    </div>
  );
}
