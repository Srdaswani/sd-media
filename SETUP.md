# Setting this up

Four steps. Step 1 gets the site live. Steps 2 and 3 connect your photos and
videos. Step 4 is the routine you'll actually use week to week.

Everything here is free and stays free. There is no card on file anywhere.

---

## 1. Get it online (10 minutes)

1. Make a free account at **github.com** and create a new repository called
   `sd-media`. Leave it empty — no README, no gitignore.
2. On the repo page, click **uploading an existing file**, and drag in
   everything from this folder *except* `node_modules` and `.next` if you see
   them. Commit.
3. Make a free account at **vercel.com** and sign in with GitHub.
4. Click **Add New → Project**, pick `sd-media`, and click **Deploy**. Don't
   change any settings — Vercel recognises Next.js on its own.

About two minutes later you have a live URL. The site works right now: the
homepage, your portrait, all six galleries, and honest "no frames here yet"
messages where the photos will go.

**Your galleries are empty until step 2. That's expected.**

---

## 2. Connect your photos (15 minutes, once)

1. Sign up free at **cloudinary.com**.
2. In the Media Library, make a folder called `sd-media`. Inside it, make one
   folder per sport, named exactly as in the left column:

   | Folder | Shows up as |
   |---|---|
   | `football` | Football |
   | `lacrosse` | Lacrosse |
   | `soccer` | Soccer |
   | `basketball` | Basketball |
   | `volleyball` | Volleyball |
   | `portraits` | Portraits |

   The folder name has to match, lowercase, no spaces. That's the whole link
   between Cloudinary and the site.
3. Go to **Dashboard → Programmable Media → API Keys** and copy your
   **Cloud name**, **API Key** and **API Secret**.
4. In Vercel: **Settings → Environment Variables**. Add these three:

   ```
   CLOUDINARY_CLOUD_NAME    your cloud name
   CLOUDINARY_API_KEY       your api key
   CLOUDINARY_API_SECRET    your api secret
   ```

   Then **Deployments → ⋯ → Redeploy**.

Done. From now on, uploading a photo to a folder puts it on the site.

**Upload the full-size file straight off the card.** Don't resize anything
first. Cloudinary makes the small versions automatically and sends each visitor
the size their screen needs — a phone gets about 40 KB, a desktop gets more.
Resizing by hand would only make them worse.

### Two words worth knowing

Both are **tags** in Cloudinary, added from the media library:

- `featured` — pins that photo to the front of its gallery and makes it the
  cover on the index page. Use it for your best frame from a game.
- `hidden` — pulls a photo off the site without deleting it.

That's the entire ordering system. You never touch code to rearrange a gallery.

---

## 3. Connect your videos (15 minutes, once)

Video goes on YouTube rather than Cloudinary, deliberately: Cloudinary's free
plan only allows 1 GB of video traffic a month, and a handful of visitors would
use that up in an afternoon. YouTube is unlimited and adjusts quality to
whatever connection someone's phone is on.

1. Upload your films to YouTube. **Unlisted** is fine if you don't want them
   public — unlisted videos still play perfectly when embedded.
2. Make a playlist and add them to it. Copy the playlist ID from the URL — it's
   the part after `list=`.
3. Get a free API key: **console.cloud.google.com** → new project → APIs &
   Services → Library → enable **YouTube Data API v3** → Credentials → Create
   Credentials → API key.
4. In Vercel, add:

   ```
   YOUTUBE_API_KEY        your key
   YOUTUBE_PLAYLIST_ID    your playlist id
   ```

   Redeploy.

Adding a video to that playlist now publishes it to the Film page.

Want a separate playlist per sport? Put its ID on that sport in
`content/site.config.ts` and its films appear alongside the rest.

---

## 4. Your routine after a game

1. Cull and edit as you normally would.
2. Drag the finished files into the right Cloudinary folder.
3. Wait about five minutes.

That's it. The gallery updates itself, the count on the index page updates
itself, the newest frame becomes the cover, and the homepage "Latest" strip
picks it up.

**If you want it live immediately**, add a `REVALIDATE_SECRET` in Vercel (any
long random string), then visit:

```
https://your-site.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/work/football
```

The page rebuilds on the spot.

---

## Adding a new sport

Open `content/site.config.ts` on GitHub, click the pencil, and copy an existing
block:

```ts
{
  slug: "wrestling",
  name: "Wrestling",
  blurb: "One sentence about how you shoot it.",
},
```

Commit. Make a Cloudinary folder called `wrestling`. Upload. The sport appears
in the navigation, on the index, and gets its own page and social card.

To hide a sport for now, add `draft: true` to its block.

---

## Things to change before you tell anyone about it

In `content/site.config.ts`:

- `email` and `instagram` — currently placeholders
- `url` — set to your real address once you have one

In `app/about/page.tsx`, the three paragraphs are written in a voice I guessed
at. Replace them with your own. Nobody can tell a photographer's story for them,
and this is the page where a parent decides whether to book you.

---

## Staying inside the free tiers

Cloudinary's free plan gives you 25 credits a month, where one credit is 1 GB
stored or 1 GB delivered. A portfolio like this uses a fraction of that: the
photos are sent as AVIF at the size each screen needs, so a visitor browsing a
whole gallery costs a few megabytes, not hundreds.

The two things that would actually cost you money, both avoided here:

- **Video on Cloudinary.** Capped at 1 GB a month. It's on YouTube instead.
- **Vercel's image optimiser.** Metered on the free plan. The site bypasses it
  entirely and lets Cloudinary do the resizing, which is uncapped in practice
  at this scale.

Cloudinary emails you at 90% of quota and never bills you without asking. If
you ever get that email, the fix is deleting old originals you've already
backed up elsewhere.

---

## If something looks wrong

**A gallery says "no frames here yet" but you uploaded photos.** The folder name
probably doesn't match the slug — check for a capital letter or a space. It's
`sd-media/football`, not `SD-Media/Football`.

**Everything says "no frames".** The three Cloudinary variables are missing or
mistyped in Vercel, or you added them and haven't redeployed yet.

**The Film page says it isn't connected.** The YouTube key or playlist ID is
missing. Note the API key needs YouTube Data API v3 actually *enabled*, not just
created.

**A photo is sideways.** Its rotation is in the EXIF and your export dropped it.
Re-export with rotation applied.
