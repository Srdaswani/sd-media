import type { Metadata } from "next";
import { getFilms, sourcesConfigured } from "@/lib/media";
import { visible } from "@/content/site.config";
import FilmGrid from "@/components/Film";
import Surface from "@/components/Surface";
import s from "../page.module.css";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Film",
  description: "Highlight edits and game films for athletes and teams.",
};

export default async function FilmPage() {
  const general = process.env.YOUTUBE_PLAYLIST_ID;
  const lists = [
    ...(general ? [{ id: general, cat: "film" }] : []),
    ...visible()
      .filter((c) => c.playlist)
      .map((c) => ({ id: c.playlist as string, cat: c.slug })),
  ];

  const films = (
    await Promise.all(lists.map((l) => getFilms(l.id, l.cat)))
  ).flat();

  return (
    <Surface tone="dark">
      <div className="shell">
        <div className={s.pageHead}>
          <h1>Film</h1>
          <p className="lead">
            Highlight edits for recruiting, and full-game films for coaching
            staff. Everything streams from YouTube, so it plays on any phone
            without eating a data plan.
          </p>
        </div>

        {films.length > 0 ? (
          <FilmGrid films={films} />
        ) : (
          <div className={s.state}>
            <h2>{sourcesConfigured.films ? "No films posted yet" : "Film is not connected yet"}</h2>
            <p>
              {sourcesConfigured.films
                ? "Add a video to the YouTube playlist and it will appear here within five minutes."
                : "Add YOUTUBE_API_KEY and YOUTUBE_PLAYLIST_ID in Vercel, following step 3 of SETUP.md, and this page fills itself."}
            </p>
          </div>
        )}
      </div>
    </Surface>
  );
}
