# Taking the sites live

Two sites, both finished and both sitting in folders. Neither needs a developer.
What follows is the whole job, in order, with the awkward bits flagged.

Allow about two hours for the first one and twenty minutes for the second.

---

## What you have

| Folder | Site | Pages |
|---|---|---|
| `tgmc-site` | The Good Management Company | 8 |
| `gmc-site` | The Good Maintenance Company | 11 |

Both are plain HTML and CSS. No framework, no build step, no database. Open
`index.html` in a browser and the site works.

---

## Before you start

Three things to have to hand:

1. **Domain login** — wherever `goodmanagement.co.uk` and `goodmaintenance.co.uk`
   are registered. You need to change DNS records.
2. **A card** — not for hosting, which is free, but Formspree's free tier caps at
   50 submissions a month. Fine to start.
3. **Two decisions**, below.

### Decision one: are the Maintenance prices plus VAT?

The site says "Hourly work from £75" and "Support packages from £25 per unit per
month." Prices shown to consumers must include VAT. A homeowner quoted £75 and
invoiced £90 is a complaint. Either change it to "£75 + VAT" or use the
VAT-inclusive figure.

Search `£75` and `£25` in `services.html` and `blocks.html`.

### Decision two: TGMC's company number and registered office

The Management site footer and privacy notice both carry `[TBC]` and
`[address to be confirmed]`. Once TGMC is registered these must be filled in —
UK company law requires the registered name, number, place of registration and
registered office on the website.

Search `[TBC]` across `tgmc-site`. It appears in every page footer and in
`privacy.html`.

**If TGMC is not yet registered, do not launch that site.** Launch Maintenance
first — its details are all real.

---

## Step 1 — Deploy (15 minutes per site)

Netlify is the simplest. Cloudflare Pages is equally good if you prefer.

1. Go to **netlify.com** and sign up (free, no card).
2. On the dashboard find **"Deploy manually"** or **"Add new site → Deploy manually"**.
3. **Drag the whole `gmc-site` folder onto the drop zone.** Not the files inside
   it — the folder.
4. Wait about thirty seconds. Netlify gives you a temporary address like
   `curious-otter-a1b2c3.netlify.app`.
5. Open it. The site is live on the internet.

Repeat for `tgmc-site` as a second site.

> **If the styling looks broken**, you dragged the files rather than the folder,
> or a file is missing. `gmc-styles.css` and `tgmc-styles.css` must sit alongside
> the HTML.

---

## Step 2 — Point the domain at it (30 minutes, then a wait)

In Netlify: **Site settings → Domain management → Add custom domain.** Enter
`goodmaintenance.co.uk`.

Netlify will show you DNS records. Go to wherever the domain is registered and
enter them. It is usually either:

- an **A record** for `@` pointing at an IP address Netlify gives you, and
- a **CNAME** for `www` pointing at your `.netlify.app` address.

DNS changes take anywhere from ten minutes to a few hours. The site will look
broken in between; this is normal.

HTTPS is automatic once DNS resolves. Do not pay anyone for an SSL certificate.

---

## Step 3 — Make the contact forms work (10 minutes per site)

**The forms currently do nothing.** They post to a placeholder. Until this is
done, enquiries vanish silently, which is worse than having no form.

1. Go to **formspree.io** and sign up.
2. Create a form. Set the destination to `team@goodmaintenance.co.uk`.
3. Formspree gives you an endpoint like `https://formspree.io/f/abcdwxyz`.
4. Open `contact.html`, find `action="ACTION_URL"`, replace `ACTION_URL` with
   that endpoint.
5. Re-upload the folder to Netlify (drag it again — it replaces the old one).
6. **Send yourself a test message and confirm it arrives.**

### Spam protection

Both forms contain a hidden field called `website`. People never see it; bots
fill it in. In Formspree, under the form's settings, add `website` as a
**honeypot field**. Any submission with it filled gets discarded.

Do this. A public form with no protection starts collecting rubbish within days.

Repeat for TGMC with `team@goodmanagement.co.uk`.

---

## Step 4 — The booking calendar (Maintenance only, 15 minutes)

The Maintenance contact page has a **"Book a visit"** button pointing nowhere.
The old Wix calendar does not come with us.

1. Sign up at **calendly.com** (free tier is fine).
2. Create an event type — "Site visit", 30 or 60 minutes.
3. Copy your Calendly link.
4. In `contact.html`, find `<a class="btn btn-quiet" href="#">Book a visit</a>`
   and replace the `#` with your link.

---

## Step 5 — Tell Google the sites exist (20 minutes)

1. **Google Search Console** (search.google.com/search-console) — add each site
   as a property, verify via the DNS record it gives you, then submit
   `sitemap.xml`.
2. **Google Business Profile** — for Maintenance this matters more than anything
   on the website itself. Verify the Chelsea address, add the service list,
   opening hours and photographs of communal work.

### The single highest-return thing

**Ask clients for Google reviews.** For a maintenance company, review count and
recency outrank almost everything on the site for local search. Twenty good
reviews would do more than every change made to these pages.

The South Kensington client is the obvious first ask.

---

## Step 6 — Check it on a phone

Before telling anyone, open both sites on a mobile:

- Does the logo fit the header without crowding?
- Do the cards stack into one column?
- Does the contact form submit?
- Do the navigation links all work?

---

## Known gaps — deliberate, not oversights

**Management site**
- Testimonials page is placeholder text pending real quotations. It is linked in
  the navigation — either get quotes before launch or remove that one nav item.
- Logo letterforms are Jost, not the typeface used on the Maintenance mark, which
  has never been identified.

**Maintenance site**
- Case study illustrations are in place; no photographs, by choice.
- The site says "references available on request" — have two clients lined up who
  have agreed before somebody asks.
- Instagram is not linked. A dormant account signals a dormant company; communal
  areas, porticos, scaffolding and stairwells are all photographable without
  touching client privacy.

---

## If something needs changing later

Every colour, size and spacing value lives at the top of the stylesheet
(`gmc-styles.css` / `tgmc-styles.css`) as a named variable. Change it there and
it changes across every page. Do not edit individual pages.

Text changes are ordinary HTML — open the file in any text editor, change the
words between the tags, re-upload the folder.

**One trap worth knowing.** Paragraphs are capped at 72 characters wide so long
text stays readable. A short line centred inside a `<p>` will therefore centre
within that narrower box rather than across the page, and look wrong. Use the
`.view-all` or `.price-line` class for centred single lines instead.

---

## Order of play

1. Fix the VAT wording
2. Deploy Maintenance
3. Point the domain
4. Wire the form, test it
5. Calendly
6. Search Console and Business Profile
7. Start asking for reviews
8. Then repeat for Management, once the company number exists
