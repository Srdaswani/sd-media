"use client";

import { useState } from "react";
import s from "./ContactForm.module.css";

type State = "idle" | "sending" | "sent" | "error";

/**
 * Posts straight to Web3Forms from the browser rather than through a route on
 * this site's own server.
 *
 * Web3Forms' free plan is built to be called client-side: it identifies spam
 * partly by watching the requesting IP, so a flood of submissions arriving
 * from one server's IP (which is what a backend proxy looks like to them)
 * gets treated as abuse and rejected with "this method is not allowed."
 * Routing server-side is a paid feature there, with your server's IP
 * whitelisted specifically. Calling it directly from each visitor's own
 * browser is both the free path and the one their spam detection expects.
 *
 * The access key ends up visible in this page's JavaScript because of that.
 * That's fine and expected: Web3Forms designs the key to work like a public
 * form ID, not a secret. The one thing it lets someone do is submit this exact
 * form, which only ever delivers to this site's own inbox.
 */
export default function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);

    // Web3Forms' own honeypot: a checkbox named "botcheck", hidden with CSS.
    // A person never sees or checks it. A bot filling every field it can find
    // ticks it, and Web3Forms silently drops the submission on their end
    // before it reaches this inbox.
    if (data.get("botcheck")) {
      setState("sent");
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (name.length < 2) return setError("Add your name."), setState("error");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      return setError("That email address doesn't look right."), setState("error");
    if (message.length < 10)
      return setError("Tell me a bit more about the shoot."), setState("error");

    setState("sending");
    setError("");
    data.append(
      "subject",
      `SD MEDIA booking: ${data.get("sport") || "enquiry"}`,
    );
    data.append("from_name", "SD MEDIA website");
    data.append("replyto", email);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = (await res.json()) as { success: boolean; message?: string };

      if (json.success) {
        setState("sent");
      } else {
        setError(json.message ?? "That didn't send.");
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
      <input type="hidden" name="access_key"
             value={process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? ""} />

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
        <label htmlFor="cf-botcheck">Leave this unchecked</label>
        <input id="cf-botcheck" name="botcheck" type="checkbox" tabIndex={-1}
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
