import { NextResponse } from "next/server";

/**
 * Contact form handler.
 *
 * Posts through Web3Forms (250 submissions a month on the free plan, no card).
 * Going through a route handler rather than posting straight from the browser
 * buys three things: the access key never ships to the client, the payload gets
 * validated before it costs a submission, and the honeypot is checked on the
 * server where a bot can't skip it.
 */

type Body = {
  name?: string;
  email?: string;
  sport?: string;
  date?: string;
  message?: string;
  /** Honeypot. Real people never see this field, so anything in it is a bot. */
  website?: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const key = process.env.WEB3FORMS_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "The form isn't connected yet. Email me directly." },
      { status: 501 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  // Silently accept and drop bot submissions. Returning an error would tell a
  // bot what tripped it.
  if (body.website) return NextResponse.json({ ok: true });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Add your name." }, { status: 400 });
  }
  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 },
    );
  }
  if (message.length < 10) {
    return NextResponse.json(
      { ok: false, error: "Tell me a bit more about the shoot." },
      { status: 400 },
    );
  }

  const sport = (body.sport ?? "").trim();
  const date = (body.date ?? "").trim();

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `SD MEDIA booking: ${sport || "enquiry"}${date ? ` on ${date}` : ""}`,
        from_name: "SD MEDIA website",
        replyto: email,
        name,
        email,
        sport: sport || "Not given",
        date: date || "Not given",
        message,
      }),
    });

    if (!res.ok) throw new Error(`Web3Forms responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "That didn't send. Email me directly instead." },
      { status: 502 },
    );
  }
}
