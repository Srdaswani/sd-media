"use client";

import { useState } from "react";
import type { Film } from "@/lib/media/types";
import s from "./Film.module.css";

/**
 * A YouTube embed pulls in roughly half a megabyte of third-party JavaScript
 * before anyone has pressed anything. On a page with eight films that is four
 * megabytes and several seconds, most of it on a phone at a field on cellular.
 *
 * So each film renders as its poster and a play control, and the real iframe is
 * only mounted once the visitor asks for it. `autoplay=1` means the click that
 * loads the player is also the click that starts the film — the visitor never
 * has to press play twice.
 */
function Item({ film }: { film: Film }) {
  const [playing, setPlaying] = useState(false);
  const date = new Date(film.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className={s.item}>
      <div className={s.stage}>
        {playing ? (
          <iframe
            className={s.embed}
            src={`https://www.youtube-nocookie.com/embed/${film.videoId}?autoplay=1&rel=0`}
            title={film.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            aria-label={`Play ${film.title}`}
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <img
              className={s.poster}
              src={film.poster}
              alt=""
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
            />
            <span className={s.play} aria-hidden="true">
              <svg width="15" height="17" viewBox="0 0 15 17" fill="currentColor">
                <path d="M0 0l15 8.5L0 17z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <h3 className={s.title}>{film.title}</h3>
      <p className={`${s.date} dense`}>{date}</p>
    </div>
  );
}

export default function FilmGrid({ films }: { films: Film[] }) {
  return (
    <div className={s.grid}>
      {films.map((f) => (
        <Item key={f.id} film={f} />
      ))}
    </div>
  );
}
