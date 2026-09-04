import type { Photo } from "@/lib/media/types";
import { transform, WIDTHS } from "@/lib/media/url";
import s from "./Frame.module.css";

type Props = {
  photo: Photo;
  /** What proportion of the viewport this frame occupies, per breakpoint. */
  sizes: string;
  /** The first frames on a page load eagerly; everything after them waits. */
  priority?: boolean;
  /** Crop to a uniform 3:2 cell, for the contact sheet. */
  crop?: boolean;
  className?: string;
};

export default function Frame({
  photo,
  sizes,
  priority = false,
  crop = false,
  className = "",
}: Props) {
  const remote = photo.src.includes("/image/upload/");

  return (
    <img
      src={remote ? transform(photo.src, 1200) : photo.src}
      srcSet={
        remote
          ? WIDTHS.map((w) => `${transform(photo.src, w)} ${w}w`).join(", ")
          : undefined
      }
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={photo.alt}
      className={`${s.frame} ${crop ? s.crop : ""} ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      style={
        {
          // Exact ratio is reserved before the bytes land, so nothing on the
          // page moves. The reserved space is filled with a colour drawn from
          // the site's own sky rather than a grey box — it reads as a frame
          // waiting on a lightbox, not as a broken image.
          "--ar": `${photo.width} / ${photo.height}`,
          "--tone": photo.tone,
        } as React.CSSProperties
      }
    />
  );
}
