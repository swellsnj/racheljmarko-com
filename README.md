# racheljmarko.com

Source for Rachel J. Marko's artist website. Plain HTML/CSS/JS, hosted on GitHub Pages —
no build step, same pattern as thegreenwoodtavern.com and samsbargrill.com.

## Structure

- `/index.html` — landing page: real bio copy is in, contact form still needs Formspree
- `/gallery/index.html` — gallery, live and pulling real images from Rachel's Drive folders
- `/blog/index.html` — blog listing; posts live in `/blog/posts/*.html`
- `/assets/css/style.css` — shared styles (placeholder palette, swap for Rachel's brand)
- `/assets/js/gallery.js` — Drive API integration for the gallery, live (real folder IDs,
  API key, and the 6 category descriptions Rachel wrote)

## Status — TODO before this is fully done

- [x] Real bio copy for the landing page
- [ ] Portrait/studio photo for the landing page
- [ ] Formspree account + form ID wired into the contact form (`index.html`)
- [x] Google Cloud project + restricted API key for the Drive gallery
- [x] The 6 Drive folder IDs + labels, folders shared "anyone with the link can view" —
      confirm with Rachel whether 2 more categories are still coming (originally scoped as 8)
- [ ] Brand direction — colors, fonts, logo (currently placeholder neutral palette in style.css)
- [ ] First real blog post
- [x] GitHub Pages enabled and live
- [x] Domain cutover: racheljmarko.com DNS points here, CNAME file in place, SSL provisioning
- [ ] Google Workspace mailbox on the domain, then update the contact form's destination

## Adding a blog post

Copy `/blog/posts/welcome.html`, edit the title/date/body, save under a new filename in
`/blog/posts/`, then add a matching `<li>` entry to `/blog/index.html`. No build step.
