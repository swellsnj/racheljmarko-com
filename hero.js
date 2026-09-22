/*
  racheljmarko.com — homepage hero art

  The left box (the pattern behind "Artist / Creator / Connector / Fabricator") is now a
  fixed image — assets/images/hero-pattern.jpg — set directly in style.css. No JS needed
  for that half any more.

  The right box ("hero-tile") is live: on every page load, this script pulls the full list
  of images across all of Rachel's gallery folders (same folders as assets/js/gallery.js)
  and picks one at random, so the homepage shows a different piece of her work each visit.

  NOTE: the folder list below is kept in sync by hand with GALLERY_FOLDERS in gallery.js.
  If Rachel adds/renames/removes a gallery folder, update both files.
*/

const HERO_API_KEY = 'AIzaSyBNW9gg1Ijz3W65u52BOIYVqjwUmUaV6kk';

const GALLERY_FOLDER_IDS = [
  '1Lvci9J5bjM0dfGoHERtTV7e707Q2QeMF', // Prints
  '1XIoFQoVXFVA7KxXofmpMxVrfXSKcQJQs', // Mandalas
  '16YfOZzKYlsHmADvw1dfTc6O2qRkyfQyM', // Surface Design
  '1lRGW5Ph4rFW5ETOBbf0fFU6-fqvxjNy-', // Murals
  '1p_yQfJmIacuIg5BXtcIwhioA-sygRYF8', // Typography
  '1MDZN5e-n1TYMyIe9JZQ-VI5uB6FQAh4P', // Builds
  '19VvoRgd5SiUc7Tln6hJB3KxvZFdtiJPA', // Misc
];

async function imagesIn(folderId) {
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,thumbnailLink)&pageSize=1000&key=${HERO_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.files || [];
}

function upsizeThumbnail(thumbnailLink) {
  // Drive's thumbnailLink is capped around 220px (e.g. "...=s220"); bump it up for hero use.
  return thumbnailLink.replace(/=s\d+$/, '=s800');
}

async function loadHeroTile() {
  const tileEl = document.getElementById('hero-tile');
  if (!HERO_API_KEY || !tileEl) return;

  const lists = await Promise.all(GALLERY_FOLDER_IDS.map(imagesIn));
  const allImages = lists.flat();
  if (allImages.length === 0) return;

  const pick = allImages[Math.floor(Math.random() * allImages.length)];
  const img = document.createElement('img');
  img.src = upsizeThumbnail(pick.thumbnailLink);
  img.alt = 'Rachel J. Marko artwork';
  img.loading = 'lazy';
  tileEl.appendChild(img);
}

document.addEventListener('DOMContentLoaded', loadHeroTile);
