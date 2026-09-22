/*
  racheljmarko.com — homepage hero art

  The hero band pulls one real image straight from Rachel's Drive (same API key/approach
  as gallery.js) for the muted pattern behind the "Artist / Creator / Connector / Fabricator"
  text box. Whichever image happens to be first in the folder is used, so this updates
  automatically as Rachel reorganizes her Drive — no manual picture pick.

  (There used to be a second "tile" image here pulled from the Builds folder, but it kept
  surfacing a photo of the family dog instead of Rachel's art, so it's been removed.)
*/

const HERO_API_KEY = 'AIzaSyBNW9gg1Ijz3W65u52BOIYVqjwUmUaV6kk';
const HERO_PATTERN_FOLDER = '1XIoFQoVXFVA7KxXofmpMxVrfXSKcQJQs'; // Mandala

async function firstImageIn(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,thumbnailLink)&pageSize=1&key=${HERO_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.files || [])[0] || null;
}

function upsizeThumbnail(thumbnailLink) {
  // Drive's thumbnailLink is capped around 220px (e.g. "...=s220"); bump it up for hero use.
  return thumbnailLink.replace(/=s\d+$/, '=s800');
}

async function loadHero() {
  const patternEl = document.getElementById('hero-pattern');
  if (!HERO_API_KEY || !patternEl) return;

  const pattern = await firstImageIn(HERO_PATTERN_FOLDER);
  if (pattern) {
    patternEl.style.backgroundImage = `url('${upsizeThumbnail(pattern.thumbnailLink)}')`;
  }
}

document.addEventListener('DOMContentLoaded', loadHero);
