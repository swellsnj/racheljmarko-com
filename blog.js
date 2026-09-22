/*
  racheljmarko.com — blog, powered by a Google Form + Sheet on Rachel's own Google account

  HOW THIS WORKS:
  Rachel fills out a Google Form (Title, Story, optional Photo) from her phone or computer.
  Every submission lands as a new row in a linked Google Sheet, with Google auto-adding a
  Timestamp column. This script reads that Sheet directly — no API key needed for the Sheet
  itself, just "Anyone with the link can view" sharing — and renders it as blog posts. Same
  "add it once, it just appears on the site" idea as the gallery, so Rachel never touches
  GitHub, HTML, or Scott to post something new.

  Rachel controls everything from the Sheet itself:
    - Fix a typo: edit the Title/Story cell directly.
    - Remove a post permanently: delete its row.
    - Hide a post without deleting it: put "No" in the "Show on site?" column.

  ONE-TIME SETUP (on Rachel's Google account — see README.md for the full walkthrough):
    1. Create a Google Form: "Title" (short answer), "Story" (paragraph), "Photo" (file
       upload, optional).
    2. On the form's Responses tab, click the green Sheets icon to create a linked Sheet.
       Google auto-adds a "Timestamp" column as column A.
    3. Add one more column header in that Sheet, after the form's own columns:
       "Show on site?" — blank (or "Yes") publishes a row, "No" hides it.
    4. Share the Sheet: "Anyone with the link" → Viewer.
    5. Send Scott the Sheet's URL so the ID below can be filled in.

  STATUS: not yet connected — SHEET_ID is empty until the Form/Sheet above exist.
*/

const SHEET_ID = '14jO92w9kM7Qj8rwTM9lKYRmeiRAFtgYJLoRiPkca1QE';
const SHEET_GID = '1995855214';
const DRIVE_API_KEY = 'AIzaSyBNW9gg1Ijz3W65u52BOIYVqjwUmUaV6kk'; // same key as the gallery; only used to resolve post photo thumbnails

// Column order in the Sheet: Timestamp (auto), Title, Story, Photo, Show on site?
const COL = { TIMESTAMP: 0, TITLE: 1, STORY: 2, PHOTO: 3, SHOW: 4 };

function parseGvizDate(cellValue) {
  // Google's gviz JSON encodes dates like "Date(2026,8,14,10,30,0)" — month is already
  // 0-indexed, same as JS Date, so the pieces can be passed straight through.
  const m = /Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/.exec(cellValue || '');
  if (!m) return null;
  const [, y, mo, d, h, mi, s] = m.map((v) => (v === undefined ? 0 : Number(v)));
  return new Date(y, mo, d, h, mi, s);
}

function driveFileIdFromUrl(url) {
  const m = /[-\w]{25,}/.exec(url || '');
  return m ? m[0] : null;
}

async function resolveThumbnail(photoUrl) {
  const fileId = driveFileIdFromUrl(photoUrl);
  if (!fileId) return null;
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=thumbnailLink&key=${DRIVE_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  return data.thumbnailLink || null;
}

function formatDate(date) {
  return date
    ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '';
}

async function fetchPosts() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1));
  const rows = json.table.rows || [];

  return rows
    .map((row) => {
      const c = row.c || [];
      const cell = (i) => (c[i] ? c[i].v : '');
      const date = parseGvizDate(cell(COL.TIMESTAMP));
      const show = String(cell(COL.SHOW) || 'yes').toLowerCase();
      return {
        id: date ? String(date.getTime()) : null,
        date,
        title: cell(COL.TITLE) || 'Untitled',
        story: cell(COL.STORY) || '',
        photoUrl: cell(COL.PHOTO) || '',
        visible: show !== 'no',
      };
    })
    .filter((p) => p.visible && p.id !== null)
    .sort((a, b) => b.date - a.date);
}

async function renderGrid(posts) {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const cards = await Promise.all(
    posts.map(async (post) => {
      const thumb = post.photoUrl ? await resolveThumbnail(post.photoUrl) : null;
      const excerpt =
        post.story.length > 180 ? post.story.slice(0, 180).trim() + '…' : post.story;
      return `
        <article class="blog-card">
          <a class="blog-card-thumb" href="/blog/?post=${post.id}">
            ${thumb ? `<img src="${thumb}" alt="${post.title}" loading="lazy" />` : '[ post image ]'}
          </a>
          <div class="blog-card-body">
            <h2 class="post-title"><a href="/blog/?post=${post.id}">${post.title}</a></h2>
            <p class="post-date">${formatDate(post.date)}</p>
            <p class="post-excerpt">${excerpt}</p>
            <a class="post-readmore" href="/blog/?post=${post.id}">Read more →</a>
          </div>
        </article>
      `;
    })
  );

  grid.innerHTML = cards.join('');
}

async function renderSinglePost(posts, id) {
  const grid = document.getElementById('blog-grid');
  const view = document.getElementById('blog-post-view');
  const intro = document.getElementById('blog-intro');
  if (!view) return;

  if (intro) intro.hidden = true;
  if (grid) grid.hidden = true;
  view.hidden = false;

  const post = posts.find((p) => p.id === String(id));
  if (!post) {
    view.innerHTML =
      '<p><a href="/blog/">← Back to all posts</a></p><p>That post couldn’t be found — it may have been removed.</p>';
    return;
  }

  const thumb = post.photoUrl ? await resolveThumbnail(post.photoUrl) : null;
  document.title = `${post.title} — Rachel J. Marko`;

  view.innerHTML = `
    <p><a href="/blog/">← Back to all posts</a></p>
    <h1>${post.title}</h1>
    <p class="post-date">${formatDate(post.date)}</p>
    ${thumb ? `<img src="${thumb}" alt="${post.title}" />` : ''}
    <div class="essay"><p>${post.story.replace(/\n+/g, '</p><p>')}</p></div>
  `;
}

async function loadBlog() {
  if (!SHEET_ID) return;

  const notice = document.getElementById('blog-not-connected');
  if (notice) notice.hidden = true;

  const posts = await fetchPosts();
  const postId = new URLSearchParams(window.location.search).get('post');

  if (postId) {
    await renderSinglePost(posts, postId);
  } else {
    await renderGrid(posts);
  }
}

document.addEventListener('DOMContentLoaded', loadBlog);
