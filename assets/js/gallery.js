/*
  racheljmarko.com — live gallery, pulled from Google Drive

  HOW THIS WORKS:
  On page load, this script calls the Drive API "files.list" endpoint for each of Rachel's
  category folders and renders the images into the grid below, tagged by category so the tab
  filters work. Because it queries Drive directly on every page load, new files Rachel adds to
  a folder appear on the site the next time someone visits — no rebuild or re-upload step.

  STATUS: live. Folder IDs, labels, and API key are all real. The 6 folders are shared
  "anyone with the link can view."

  TODO: confirm with Rachel whether 2 more categories are still coming (originally scoped
  as 8, only 6 exist in Drive right now) and add them below if so.
*/

const API_KEY = 'AIzaSyBNW9gg1Ijz3W65u52BOIYVqjwUmUaV6kk';

const GALLERY_FOLDERS = [
  {
    id: '1XIoFQoVXFVA7KxXofmpMxVrfXSKcQJQs',
    label: 'Mandala',
    description: 'I went through a phase. It was pretty long, but certainly something I had to go through. The mandala work was basically a meditation for me. I even taught mandala drawing classes for a while. These repetitive drawings gave me something to concentrate on when I needed it. I have screenprinted my mandalas as well as sold them on merchandise.',
  },
  {
    id: '19VvoRgd5SiUc7Tln6hJB3KxvZFdtiJPA',
    label: 'Misc',
    description: '',
  },
  {
    id: '1lRGW5Ph4rFW5ETOBbf0fFU6-fqvxjNy-',
    label: 'Murals',
    description: 'This is something that I have always done. I get really excited over a blank wall. I really wish I had more pictures of my mural work. A bunch of it was from pre cell phone times. If I ever find any printed photos I will share.',
  },
  {
    id: '1MDZN5e-n1TYMyIe9JZQ-VI5uB6FQAh4P',
    label: 'Builds',
    description: 'I have been building since I could pick up tools. This has always been a love for me. I grew up learning how to use power tools and I have always been more comfortable using them than computers. I didn’t know that the profession of “fabricating” existed until more recently. I think if I knew about this when I was younger this is probably the direction I would have gone in. I just really like solving visual problems.',
  },
  {
    id: '1p_yQfJmIacuIg5BXtcIwhioA-sygRYF8',
    label: 'Typography',
    description: '',
  },
  {
    id: '16YfOZzKYlsHmADvw1dfTc6O2qRkyfQyM',
    label: 'Prints & Surface Design',
    description: 'I mostly only wear solid colors but I have always been attracted to textile and surface design. I often don’t plan ahead the designs I am making, but figure it out as I go. Everything on here is hand drawn and or printed. There are a few designs that I begrudgingly scanned into the computer and colored. I prefer to use the least technology possible.',
  },
];

async function loadGallery() {
  const grid = document.getElementById('gallery-grid');
  const tabs = document.getElementById('gallery-tabs');
  const description = document.getElementById('gallery-description');

  if (!API_KEY) {
    return;
  }

  tabs.innerHTML = '<li><button class="active" data-cat="all">All</button></li>' +
    GALLERY_FOLDERS.map(f => `<li><button data-cat="${f.id}">${f.label}</button></li>`).join('');

  let allFiles = [];
  for (const folder of GALLERY_FOLDERS) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,thumbnailLink)&pageSize=1000&key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    (data.files || []).forEach(f => allFiles.push({ ...f, category: folder.id }));
  }

  renderGrid(allFiles);
  updateDescription('all');

  tabs.addEventListener('click', (e) => {
    if (e.target.tagName !== 'BUTTON') return;
    tabs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    const cat = e.target.dataset.cat;
    renderGrid(cat === 'all' ? allFiles : allFiles.filter(f => f.category === cat));
    updateDescription(cat);
  });

  function updateDescription(cat) {
    const folder = GALLERY_FOLDERS.find(f => f.id === cat);
    if (folder && folder.description) {
      description.textContent = folder.description;
      description.hidden = false;
    } else {
      description.textContent = '';
      description.hidden = true;
    }
  }

  function renderGrid(files) {
    grid.innerHTML = files.map(f => `
      <a class="tile" href="https://drive.google.com/file/d/${f.id}/view" target="_blank" rel="noopener">
        <img src="${f.thumbnailLink}" alt="${f.name}" loading="lazy" />
      </a>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', loadGallery);
