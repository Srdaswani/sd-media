"use client";

import s from "./page.module.css";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="shell">
      <div className={s.state}>
        <h1 style={{ fontSize: "var(--step-3)", marginBottom: "var(--s4)" }}>
          This gallery did not load
        </h1>
        <p>
          The photographs are stored off-site and that request failed. Nothing
          is lost — it is almost always a slow connection rather than a missing
          gallery.
        </p>
        <p style={{ marginTop: "var(--s4)" }}>
          <button
            onClick={reset}
            style={{
              borderBottom: "1px solid var(--accent)",
              color: "var(--accent)",
              fontWeight: 600,
            }}
          >
            Try loading it again
          </button>
        </p>
      </div>
    </div>
  );
}
