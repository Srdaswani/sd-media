"use client";

import { useState } from "react";
import Link from "next/link";
import type { Photo } from "@/lib/media/types";
import { transform } from "@/lib/media/url";
import s from "./Index.module.css";

export type IndexEntry = {
  slug: string;
  name: string;
  blurb: string;
  count: number;
  cover: Photo | null;
};

export default function Index({ entries }: { entries: IndexEntry[] }) {
  const [active, setActive] = useState(0);
  const current = entries[active];

  const url = (p: Photo | null) =>
    p ? (p.src.includes("/image/upload/") ? transform(p.src, 1200) : p.src) : "";

  return (
    <div className={s.wrap}>
      <div>
        <ul className={s.list}>
          {entries.map((e, i) => (
            <li key={e.slug} className={s.row}>
              <Link
                href={`/work/${e.slug}`}
                className={s.entry}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                {e.cover && (
                  <img
                    className={s.thumb}
                    src={url(e.cover)}
                    alt=""
                    width={76}
                    height={52}
                    loading="lazy"
                    decoding="async"
                    style={{ backgroundColor: e.cover.tone }}
                  />
                )}
                <span className={s.name}>{e.name}</span>
                <span className={s.count}>
                  {e.count > 0 ? `${e.count} frames` : "coming"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className={`${s.blurbs} lead`}>{current?.blurb}</p>
      </div>

      <div className={s.preview} aria-hidden="true">
        {entries.map((e, i) =>
          e.cover ? (
            <img
              key={e.slug}
              className={`${s.previewImg} ${i === active ? s.previewOn : ""}`}
              src={url(e.cover)}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              style={{ backgroundColor: e.cover.tone }}
            />
          ) : null,
        )}
        {current && <span className={s.previewCap}>{current.name}</span>}
      </div>
    </div>
  );
}
