# racheljmarko.com

Source for Rachel J. Marko's artist website. Plain HTML/CSS/JS, hosted on GitHub Pages —
no build step, same pattern as thegreenwoodtavern.com and samsbargrill.com.

## Structure

- `/index.html` — landing page: real bio copy, live hero art, contact form live via Formspree
- `/gallery/index.html` — gallery, live and pulling real images from Rachel's Drive folders
- `/blog/index.html` — blog listing (card grid); posts live in `/blog/posts/*.html`
- `/assets/css/style.css` — shared styles, matching Rachel's Canva mockup (palette + fonts)
- `/assets/js/gallery.js` — Drive API integration for the gallery, live (real folder IDs,
  API key, and the 6 category descriptions Rachel wrote)
- `/assets/js/hero.js` — pulls two live images from Drive for the homepage hero band

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

## Status — TODO before this is fully done

- [x] Real bio copy for the landing page
- [ ] Portrait/studio photo for the landing page
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
- [ ] Rachel's real Facebook / TikTok / Instagram links — homepage icons are placeholders
      (`href="#"`) for now, see the `social-links` block in `index.html`
- [ ] First real blog post
- [x] GitHub Pages enabled and live
- [x] Domain cutover: racheljmarko.com DNS points here, CNAME file in place, SSL provisioning
- [ ] Google Workspace mailbox on the domain, then update the contact form's destination

## Adding a blog post

Copy `/blog/posts/welcome.html`, edit the title/date/body, save under a new filename in
`/blog/posts/`, then add a matching `<article class="blog-card">` entry to `/blog/index.html`
(copy the existing one — thumbnail link, title, date, "Read more" link). No build step.
