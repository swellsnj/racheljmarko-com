# racheljmarko.com

Source for Rachel J. Marko's artist website. Plain HTML/CSS/JS, hosted on GitHub Pages —
no build step, same pattern as thegreenwoodtavern.com and samsbargrill.com.

## Structure

- `/index.html` — landing page: bio + contact form
- `/gallery/index.html` — gallery, pulls live from Google Drive (not wired up yet)
- `/blog/index.html` — blog listing; posts live in `/blog/posts/*.html`
- `/assets/css/style.css` — shared styles (placeholder palette, swap for Rachel's brand)
- `/assets/js/gallery.js` — Drive API integration for the gallery (not wired up yet)

## Status: scaffold only — TODO before this is a real, live site

- [ ] Real bio copy + portrait photo for the landing page
- [ ] Formspree account + form ID wired into the contact form (`index.html`)
- [ ] Google Cloud project + restricted API key for the Drive gallery
- [ ] The 8 Drive folder IDs + labels, and confirmation they're shared "anyone with the link can view"
- [ ] Brand direction — colors, fonts, logo (currently placeholder neutral palette in style.css)
- [ ] First real blog post
- [ ] Enable GitHub Pages: repo Settings → Pages → Source: Deploy from branch → `main` / `(root)`
- [ ] Domain cutover: point racheljmarko.com DNS at GitHub Pages, add a CNAME file once ready
- [ ] Google Workspace mailbox on the domain, then update the contact form's destination

## Adding a blog post

Copy `/blog/posts/welcome.html`, edit the title/date/body, save under a new filename in
`/blog/posts/`, then add a matching `<li>` entry to `/blog/index.html`. No build step.
