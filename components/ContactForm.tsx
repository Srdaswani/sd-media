"use client";

import { useState } from "react";
import s from "./ContactForm.module.css";

type State = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (json.ok) {
        setState("sent");
      } else {
        setError(json.error ?? "That didn't send.");
        setState("error");
      }
    } catch {
      setError("That didn't send. Check your connection, or email me directly.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className={s.good}>
        <h2 className={s.goodTitle}>Got it</h2>
        <p className="lead">
          Your message is in my inbox. I answer the same day, usually within a
          few hours. If it's urgent, text me instead.
        </p>
      </div>
    );
  }

  return (
    <form className={s.form} onSubmit={submit} noValidate>
      <div className={s.pair}>
        <div className={s.field}>
          <label className={s.label} htmlFor="cf-name">
            Your name
          </label>
          <input className={s.input} id="cf-name" name="name" type="text"
                 autoComplete="name" required />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="cf-email">
            Email
          </label>
          <input className={s.input} id="cf-email" name="email" type="email"
                 autoComplete="email" required />
        </div>
      </div>

      <div className={s.pair}>
        <div className={s.field}>
          <label className={s.label} htmlFor="cf-sport">
            Sport
          </label>
          <input className={s.input} id="cf-sport" name="sport" type="text"
                 placeholder="Football, lacrosse, portraits…" />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="cf-date">
            Date of the game
          </label>
          <input className={s.input} id="cf-date" name="date" type="date" />
        </div>
      </div>

      <div className={s.field}>
        <label className={s.label} htmlFor="cf-message">
          Which field, and what you need
        </label>
        <textarea className={s.area} id="cf-message" name="message" rows={4}
                  required />
      </div>

      <div className={s.trap} aria-hidden="true">
        <label htmlFor="cf-website">Leave this empty</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1}
               autoComplete="off" />
      </div>

      <button className={s.submit} type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send it"}
      </button>

      <p className={s.note} role="status" aria-live="polite">
        {state === "error" ? (
          <span className={s.bad}>
            {error} You can reach me at {email}.
          </span>
        ) : (
          <span style={{ color: "var(--fg-muted)" }}>
            I reply the same day. No mailing list, no forwarding your address on.
          </span>
        )}
      </p>
    </form>
  );
}
