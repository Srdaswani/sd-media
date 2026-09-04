"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/media/types";
import { transform } from "@/lib/media/url";
import Frame from "./Frame";
import s from "./Gallery.module.css";

type View = "set" | "sheet";

/* Icons are drawn here rather than pulled from a package: two glyphs do not
   justify a dependency, and a bespoke pair sits better with the type. */
const IconSet = () => (
  <svg className={s.glyph} viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">
    <rect x="0" y="0" width="12" height="5" />
    <rect x="0" y="7" width="7" height="5" />
    <rect x="9" y="7" width="3" height="5" />
  </svg>
);

const IconSheet = () => (
  <svg className={s.glyph} viewBox="0 0 12 12" aria-hidden="true" fill="currentColor">
    {[0, 4.5, 9].map((y) =>
      [0, 4.5, 9].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" />),
    )}
  </svg>
);

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none"
       stroke="currentColor" strokeWidth="1.4">
    <path d={dir === "left" ? "M11.5 3 5.5 9l6 6" : "M6.5 3l6 6-6 6"} />
  </svg>
);

const Cross = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none"
       stroke="currentColor" strokeWidth="1.4">
    <path d="M2 2l10 10M12 2L2 12" />
  </svg>
);

const pad = (n: number) => String(n).padStart(3, "0");

/* ------------------------------------------------------------- lightbox -- */

function Lightbox({
  photos,
  index,
  onClose,
  onMove,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onMove: (next: number) => void;
}) {
  const photo = photos[index];
  const touchX = useRef<number | null>(null);
  const returnFocus = useRef<Element | null>(null);

  useEffect(() => {
    returnFocus.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(Math.min(index + 1, photos.length - 1));
      if (e.key === "ArrowLeft") onMove(Math.max(index - 1, 0));
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (returnFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [index, photos.length, onClose, onMove]);

  const fields: [string, string | undefined][] = [
    ["Camera", photo.capture.camera],
    ["Lens", photo.capture.lens],
    ["Focal length", photo.capture.focal],
    ["Aperture", photo.capture.aperture],
    ["Shutter", photo.capture.shutter],
    ["Sensitivity", photo.capture.iso],
  ];
  const known = fields.filter(([, v]) => Boolean(v));
  const remote = photo.src.includes("/image/upload/");

  return (
    <div
      className={s.box}
      role="dialog"
      aria-modal="true"
      aria-label={`Frame ${index + 1} of ${photos.length}`}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 44) {
          onMove(
            dx < 0
              ? Math.min(index + 1, photos.length - 1)
              : Math.max(index - 1, 0),
          );
        }
        touchX.current = null;
      }}
    >
      <div className={s.boxBar}>
        <span className={s.boxCount}>
          <span className={s.counterNow}>{pad(index + 1)}</span>
          <span className={s.counterTotal}>/{pad(photos.length)}</span>
        </span>
        <button className={s.close} onClick={onClose} aria-label="Close (Esc)" autoFocus>
          <Cross />
        </button>
      </div>

      <div className={s.boxStage}>
        <img
          key={photo.id}
          src={remote ? transform(photo.src, 2400) : photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          decoding="async"
        />
        <button
          className={`${s.arrow} ${s.prev}`}
          onClick={() => onMove(index - 1)}
          disabled={index === 0}
          aria-label="Previous frame"
        >
          <Chevron dir="left" />
        </button>
        <button
          className={`${s.arrow} ${s.next}`}
          onClick={() => onMove(index + 1)}
          disabled={index === photos.length - 1}
          aria-label="Next frame"
        >
          <Chevron dir="right" />
        </button>
      </div>

      {known.length > 0 ? (
        <dl className={s.capture}>
          {known.map(([k, v]) => (
            <div className={s.captureItem} key={k}>
              <dt className={s.captureKey}>{k}</dt>
              <dd className={s.captureVal}>{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className={`${s.captureNone} dense`}>
          This frame was exported without its capture data.
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------- gallery -- */

export default function Gallery({
  photos,
  title,
  blurb,
}: {
  photos: Photo[];
  title: string;
  blurb: string;
}) {
  const [view, setView] = useState<View>("set");
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  // The chosen view follows the visitor from sport to sport for the session.
  // Someone who wants contact sheets wants them everywhere.
  useEffect(() => {
    const saved = sessionStorage.getItem("sd:view");
    if (saved === "sheet" || saved === "set") setView(saved);
  }, []);

  const choose = useCallback((next: View) => {
    setView(next);
    sessionStorage.setItem("sd:view", next);
  }, []);

  // Frame counter.
  //
  // Counts how many frames sit above the middle of the viewport, measured from
  // their real position on screen. An earlier version used each cell's index in
  // the DOM, which read "022/030" at the top of the page because the layout did
  // not run in DOM order. Measuring position is immune to whatever the grid
  // does, in either view, at any width.
  //
  // Reads are batched into one animation frame so a fast scroll cannot queue up
  // a layout thrash.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let queued = false;
    const measure = () => {
      queued = false;
      const cells = grid.children;
      const line = window.innerHeight / 2;
      let n = 0;
      for (let i = 0; i < cells.length; i++) {
        if ((cells[i] as HTMLElement).getBoundingClientRect().top <= line) n++;
        else break;
      }
      setSeen(Math.min(Math.max(n, 1), photos.length));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [view, photos.length]);

  if (photos.length === 0) {
    return (
      <div className={s.state}>
        <h2 className={s.stateTitle}>No frames here yet</h2>
        <p className={s.stateBody}>
          {title} is set up and live — it is waiting on photographs. Drop them
          into the <code>{title.toLowerCase()}</code> folder in Cloudinary and
          they will show up here within five minutes.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={s.head}>
        <div>
          <h1 className={s.title}>{title}</h1>
          <p className={`${s.meta} dense`}>
            {photos.length} {photos.length === 1 ? "frame" : "frames"} · {blurb}
          </p>
        </div>

        <div className={s.toggle} role="group" aria-label="Choose how to view this set">
          <button
            className={`${s.mode} ${view === "set" ? s.modeOn : ""}`}
            onClick={() => choose("set")}
            aria-pressed={view === "set"}
          >
            <IconSet />
            Set
          </button>
          <button
            className={`${s.mode} ${view === "sheet" ? s.modeOn : ""}`}
            onClick={() => choose("sheet")}
            aria-pressed={view === "sheet"}
          >
            <IconSheet />
            Contact sheet
          </button>
        </div>
      </div>

      <div ref={gridRef} className={view === "set" ? s.set : s.sheet}>
        {photos.map((p, i) => (
          <button
            key={p.id}
            className={s.cell}
            onClick={() => setOpen(i)}
            aria-label={`Open frame ${i + 1}: ${p.alt}`}
            style={
              { "--ar-num": (p.width / p.height).toFixed(4) } as React.CSSProperties
            }
          >
            <Frame
              photo={p}
              crop={view === "sheet"}
              priority={i < 6}
              sizes={
                view === "sheet"
                  ? "(max-width: 40rem) 33vw, (max-width: 60rem) 25vw, 190px"
                  : "(max-width: 40rem) 100vw, (max-width: 60rem) 50vw, 33vw"
              }
            />
            {view === "sheet" && <span className={s.cellNo}>{pad(i + 1)}</span>}
          </button>
        ))}
        {/* Soak up the final row so a short last line keeps its scale. */}
        {view === "set" &&
          Array.from({ length: 3 }, (_, i) => (
            <i key={`tail-${i}`} className={s.tail} aria-hidden="true" />
          ))}
      </div>

      <div className={s.counter} aria-hidden="true">
        <span className={s.counterNow}>{pad(Math.min(seen, photos.length))}</span>
        <span className={s.counterTotal}>/{pad(photos.length)}</span>
      </div>

      {open !== null && (
        <Lightbox
          photos={photos}
          index={open}
          onClose={() => setOpen(null)}
          onMove={(n) => setOpen(Math.max(0, Math.min(n, photos.length - 1)))}
        />
      )}
    </>
  );
}
