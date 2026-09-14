/*
  racheljmarko.com — homepage hero art

  Rather than a static placeholder image, the hero band pulls two real images straight
  from Rachel's Drive (same API key/approach as gallery.js): one becomes the muted pattern
  behind the "Artist / Creator / Connector / Fabricator" text box, the other is the
  standalone tile beside it. Whichever image happens to be first in each folder is used,
  so this updates automatically as Rachel reorganizes her Drive — no manual picture pick.

  TODO: once Rachel has specific hero photos she'd rather feature, swap these two folder
  IDs for a small dedicated "Hero" Drive folder, or hardcode two specific file IDs instead.
*/

const HERO_API_KEY = 'AIzaSyBNW9gg1Ijz3W65u52BOIYVqjwUmUaV6kk';
const HERO_PATTERN_FOLDER = '1XIoFQoVXFVA7KxXofmpMxVrfXSKcQJQs'; // Mandala
const HERO_TILE_FOLDER = '1MDZN5e-n1TYMyIe9JZQ-VI5uB6FQAh4P'; // Builds

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
  const tileEl = document.getElementById('hero-tile');
  if (!HERO_API_KEY || (!patternEl && !tileEl)) return;

  const [pattern, tile] = await Promise.all([
    firstImageIn(HERO_PATTERN_FOLDER),
    firstImageIn(HERO_TILE_FOLDER),
  ]);

  if (pattern && patternEl) {
    patternEl.style.backgroundImage = `url('${upsizeThumbnail(pattern.thumbnailLink)}')`;
  }
  if (tile && tileEl) {
    const img = document.createElement('img');
    img.src = upsizeThumbnail(tile.thumbnailLink);
    img.alt = 'Rachel J. Marko artwork';
    img.loading = 'lazy';
    tileEl.appendChild(img);
  }
}

document.addEventListener('DOMContentLoaded', loadHero);
