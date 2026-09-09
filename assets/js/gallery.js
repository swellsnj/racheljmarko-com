/*
  racheljmarko.com — live gallery, pulled from Google Drive

  HOW THIS WILL WORK (not wired up yet — see notice on the gallery page):
  1. Each of Rachel's 8 Drive folders (one per gallery category) gets its ID recorded below.
  2. A restricted Google API key (restricted to this domain, Drive API read-only scope)
     is added below. The 8 folders must be shared "Anyone with the link can view" for a
     client-side key like this to read them without a backend.
  3. On page load, this script calls the Drive API "files.list" endpoint for each folder
     (q=`'<folderId>' in parents and mimeType contains 'image/'`), and renders the images
     into the grid below, tagged by category so the tab filters work.
  4. Because it queries Drive directly on every page load, new files Rachel adds to a
     folder appear on the site the next time someone visits — no rebuild or re-upload step.

  TODO before this goes live:
  - [ ] Get an API key from a Google Cloud project (console.cloud.google.com), restricted
        to the Drive API and to HTTP referrer racheljmarko.com
  - [ ] Get the 8 folder IDs (from each folder's Drive URL) and their display names
  - [ ] Confirm the 8 folders are shared "Anyone with the link can view"
  - [ ] Fill in GALLERY_FOLDERS and API_KEY below and remove the placeholder message
*/

const API_KEY = ''; // TODO: fill in restricted Google API key
const GALLERY_FOLDERS = [
  // { id: 'GOOGLE_DRIVE_FOLDER_ID', label: 'Category name' },
];

async function loadGallery() {
  const grid = document.getElementById('gallery-grid');
  const tabs = document.getElementById('gallery-tabs');

  if (!API_KEY || GALLERY_FOLDERS.length === 0) {
    // Not configured yet — placeholder state, see notice on the page itself.
    return;
  }

  tabs.innerHTML = '<li><button class="active" data-cat="all">All</button></li>' +
    GALLERY_FOLDERS.map(f => `<li><button data-cat="${f.id}">${f.label}</button></li>`).join('');

  let allFiles = [];
  for (const folder of GALLERY_FOLDERS) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,thumbnailLink,webContentLink)&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    (data.files || []).forEach(f => allFiles.push({ ...f, category: folder.id, categoryLabel: folder.label }));
  }

  renderGrid(allFiles);

  tabs.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const cat = e.target.dataset.cat;
    renderGrid(cat === 'all' ? allFiles : allFiles.filter(f => f.category === cat));
  });

  function renderGrid(files) {
    grid.innerHTML = files.map(f => `
      <div class="tile">
        <img src="${f.thumbnailLink}" alt="${f.name}" loading="lazy" />
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
