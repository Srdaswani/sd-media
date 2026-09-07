import Link from "next/link";
import s from "./page.module.css";

/* Edge states are where generated sites give themselves away, so these are
   written rather than left as "Something went wrong. Please try again." */
export default function NotFound() {
  return (
    <div className="shell">
      <div className={s.state}>
        <h1 style={{ fontSize: "var(--step-3)", marginBottom: "var(--s4)" }}>
          Nothing at this address
        </h1>
        <p>
          There's no page at this address. It may have been a sport I've since
          renamed. The{" "}
          <Link href="/work" style={{ borderBottom: "1px solid var(--accent)" }}>
            work index
          </Link>{" "}
          lists everything that's live.
        </p>
      </div>
    </div>
  );
}
