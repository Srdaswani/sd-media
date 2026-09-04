import s from "./page.module.css";

/* Shown only if a page misses the edge cache. It says what is happening in
   plain words rather than pulsing a grey rectangle. */
export default function Loading() {
  return (
    <div className="shell">
      <p className="dense" style={{ paddingBlock: "var(--s8)" }}>
        Pulling the latest frames…
      </p>
    </div>
  );
}
