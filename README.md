# racheljmarko.com

Source for Rachel J. Marko's artist website. Plain HTML/CSS/JS, hosted on GitHub Pages —
no build step, same pattern as thegreenwoodtavern.com and samsbargrill.com.

## Structure

- `/index.html` — landing page: real bio copy, live hero art, contact form live via Formspree
- `/gallery/index.html` — gallery, live and pulling real images from Rachel's Drive folders
- `/blog/index.html` — blog, powered by a Google Form + Sheet on Rachel's own account (not
  yet connected — see "Setting up the blog" below)
- `/assets/css/style.css` — shared styles, matching Rachel's Canva mockup (palette + fonts)
- `/assets/js/gallery.js` — Drive API integration for the gallery, live (real folder IDs,
  API key, and the 6 category descriptions Rachel wrote)
- `/assets/js/hero.js` — pulls two live images from Drive for the homepage hero band
- `/assets/js/blog.js` — reads Rachel's Google Sheet and renders blog posts + single-post pages
- `/blog/posts/welcome.html` — leftover from the old copy-a-file blogging approach, no longer
  used now that the blog is Sheet-powered; harmless to leave in place or delete later

## Brand direction — from Rachel's Canva mockup

- Landing/blog background: `#dad0c2`. Gallery background: `#f1eeee` (see `body.gallery-page`
  in style.css).
- Headline font in the mockup is **Papercutting**, body font is **PP Telegraf** — both turned
  out to be paid fonts with no free commercial webfont license (Papercutting's free copy is
  personal-use-only; PP Telegraf requires a purchased license from Pangram Pangram). Scott
  opted to use free look-alikes instead:
  - Headline: **Luckiest Guy** (Google Fonts) — bold, hand-cut/sticker feel similar to Papercutting.
  - Body: **General Sans** (Fontshare) — clean geometric sans similar to PP Telegraf.
  - If the real fonts get licensed later, swap the `<link>` tags in each page's `<head>` and
    the `--font-heading` / `--font-body` values in `style.css`.

## Setting up the blog (one-time, on Rachel's Google account)

The blog works like the gallery: Rachel doesn't touch code or GitHub, ever. She fills out a
Google Form and the post appears on the site. She edits or deletes a post later by editing
the underlying Google Sheet directly — a lot like editing a spreadsheet, not a website.

1. In Rachel's Google account, create a Google Form with three questions, in this order:
   - **Title** — Short answer
   - **Story** — Paragraph
   - **Photo** — File upload (mark it optional)
2. On the form's **Responses** tab, click the green Sheets icon ("Create Spreadsheet") to
   generate a linked Sheet. Google automatically adds a **Timestamp** column as column A —
   that's what gives each post its date, no manual entry needed.
3. In that Sheet, add one more column header in the next empty column: **Show on site?**
   Leave a post's cell blank (or "Yes") to publish it; type "No" to hide it without deleting
   anything.
4. Share the Sheet the same way the Drive gallery folders are shared: the Share button →
   "Anyone with the link" → Viewer.
5. Copy the Sheet's URL and send it to Scott. The long string in that URL between `/d/` and
   `/edit` is the Sheet ID that goes into `SHEET_ID` at the top of `assets/js/blog.js`.

Once that's wired in, every new Form submission just shows up on `/blog/` automatically —
no upload, no rebuild. Rachel manages her own posts entirely from the Sheet:
- **Fix a typo:** edit the Title or Story cell.
- **Remove a post for good:** delete its row.
- **Temporarily hide a post:** set "Show on site?" to "No" for that row.

## Status — TODO before this is fully done

- [x] Real bio copy for the landing page
- [ ] Portrait/studio photo for the landing page — once it's in, also remove the
      "Under construction" notice from `index.html`
- [x] Formspree account + form ID wired into the contact form (`index.html`) —
      destination is rachel.j.marko@gmail.com for now
- [x] Google Cloud project + restricted API key for the Drive gallery
- [x] The 6 Drive folder IDs + labels, folders shared "anyone with the link can view"
- [x] Brand direction — colors + fonts applied from Rachel's mockup (see above); no logo yet
- [ ] Gallery categories don't fully match the mockup yet — it lists 8 (Prints, Mandalas,
      Surface Design, Murals, Typography, Builds, Misc, Merch), Drive only has 6 folders.
      "Prints & Surface Design" is still combined, and there's no "Merch" folder. If Rachel
      wants them split out as in the mockup, she needs to create/share those Drive folders
      and send over the new folder IDs.
- [x] Rachel's real Facebook / TikTok / Instagram links wired into the homepage icons
- [ ] Blog: Rachel needs to create the Google Form + Sheet (see "Setting up the blog" above)
      and send Scott the Sheet ID/URL to finish wiring `assets/js/blog.js`
- [x] GitHub Pages enabled and live
- [x] Domain cutover: racheljmarko.com DNS points here, CNAME file in place, SSL provisioning
- [ ] Google Workspace mailbox on the domain, then update the contact form's destination
