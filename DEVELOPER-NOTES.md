# The Good Management Company — developer notes

Static HTML and one stylesheet. No build step, no framework, no dependencies.
Everything renders as-is if you open `index.html` in a browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | Home — intro, hero, illustration, FAQ, recent posts |
| `insights.html` | Blog index with search and category filters |
| `article.html` | Article template (leasehold reforms) |
| `article-service-charges.html` | Second article |
| `testimonials.html` | **Placeholder text** — awaiting real quotations |
| `contact.html` | Contact form |
| `privacy.html` | Privacy notice |
| `404.html` | Not-found page |
| `tgmc-styles.css` | All styling. Single source of truth — edit values here, not in pages |
| `crescent.jpg` | Homepage illustration |
| `favicon.svg` | Favicon |
| `sitemap.xml`, `robots.txt` | Search engine files |

---

## Must be done before launch

### 1. The contact form does nothing
`contact.html` has `action="ACTION_URL"`. Replace with a real endpoint routing
to **team@goodmanagement.co.uk** — Formspree, Basin, Netlify Forms, or a
platform handler.

A hidden honeypot field named `website` is already in the markup. Configure the
endpoint to **discard any submission where that field is not empty**. That
stops most bots without a CAPTCHA.

Test that a real submission arrives before going live.

### 2. Placeholders in the footer and privacy notice
Both carry `[TBC]` for the company number and `[address to be confirmed]` for
the registered office. UK company law requires the registered name, number,
place of registration and registered office to appear on the website. Replace
before launch — appears in the footer of every page and in `privacy.html`.

### 3. Search scales to about 50 posts
`insights.html` filters the DOM with a short inline script. Fine now. Past
roughly fifty posts, replace with a generated index — [Pagefind](https://pagefind.app)
is the least effort and needs no server.

### 4. Domain references
`sitemap.xml`, `robots.txt` and the JSON-LD assume `https://goodmanagement.co.uk`.
Update if the domain differs.

---

## After launch

- Submit `sitemap.xml` via Google Search Console
- Create and verify the Google Business Profile
- Add analytics **only** after updating `privacy.html` — it currently states
  that no tracking cookies are set
- Compress `crescent.jpg` to WebP with a JPEG fallback

---

## Conventions worth keeping

- **Two navies.** `#111C30` for the logo and dark panels only. `#1F3A70` for
  headings, buttons and links. Applying the logo navy to display type makes it
  read as black.
- **Headings are weight 400**, never bold — bold geometric fights the light
  wordmark.
- **The logo is outlined paths, not text.** Do not substitute a font version.
  Five variants supplied: primary, reverse, stacked, reverse stacked, navy panel.
  Below 700px use the stacked file rather than scaling the wide one down.
- **Prose is capped at 72 characters.** A `<p>` with `text-align:center`
  centres inside that narrower box, not the page — use `.view-all` for centred
  single lines.
- **One image per page maximum.** No stock photography.
- Full rules in `TGMC_Style_Rules.pdf`.

---

## Known gaps, deliberately left

- Testimonials page is placeholder copy
- Logo letterforms are Jost (SIL OFL), not the parent company's typeface, which
  has not yet been identified. If it proves to be Futura, regenerate from a
  licensed copy.
