# AGENT.md — The Orbit

You are working on **The Orbit**, a personal project portfolio and log owned by Frederic. Read this entire file before doing anything.

---

## What this project is

A single-page portfolio site that lists personal projects — startup tools, hobby builds, and client work. It's a dark-themed, minimal UI inspired by Linear. The owner uses it to log and browse projects he's built.

## Current architecture

Right now this is a **single self-contained HTML file** (`index.html`). Everything — HTML, CSS, and JavaScript — lives in that one file. Project data is hardcoded in a `PROJECT_DATA` array inside a `<script>` tag.

There is no build step, no framework, no dependencies. You open the file in a browser and it works.

## Planned architecture (Next.js + Vercel)

This project is planned to be migrated to:

- **Next.js** — app router, deployed on Vercel
- **Vercel Blob** — stores `projects.json` (the project data) and uploaded thumbnail images
- **API routes** — `/api/projects` for CRUD operations (GET, POST, PUT, DELETE)
- **API key auth** — simple `X-API-Key` header check against an env var

The migration has NOT been done yet. If you are tasked with this migration, see the "Migration guide" section below.

---

## Rules

### Do NOT:
- Refactor or "clean up" existing working CSS or JS unless explicitly asked
- Change CSS variable names, class names, or IDs
- Add libraries, frameworks, or dependencies unless the task specifically requires it
- Change the data shape (field names in project objects) without updating ALL consumers: the rendering functions, the detail panel, and the API route
- Remove or rename existing files without being told to
- Add comments explaining what code does — the code is self-explanatory
- Create documentation files beyond what exists unless asked
- Run destructive git operations (force push, reset --hard, rebase)

### Do:
- Keep changes minimal and focused on what was asked
- Test that the page renders correctly after any edit
- Preserve the existing visual design (dark theme, accent color `#A49AF3`, Inter font, rounded cards, floating navbar)
- Follow existing code patterns — if the file uses `var` and string concatenation, match that style
- Verify bracket/quote matching after editing `PROJECT_DATA` or any JS string templates

---

## Project data shape

Each project in `PROJECT_DATA` has this shape:

```js
{
  name: "Project Name",          // string, required, max ~60 chars
  category: "Startup Ops",       // string, required, one of: "Startup Ops", "Hobby Builds", "Client Projects"
  date: "April 2025",            // string, required, format: "Month YYYY"
  description: "Description.",   // string, required, plain text, max ~200 chars
  thumbnail: null,               // string (URL) or null
  liveUrl: null,                 // string (URL) or null
  githubUrl: null                // string (URL) or null
}
```

### Category values (use exactly these strings):
- `Startup Ops` — internal tools, SaaS products, company-building
- `Hobby Builds` — personal side projects, creative experiments
- `Client Projects` — paid client work, deliverables

### Date format:
- Full month name + space + 4-digit year: `"March 2025"`
- Sorting is automatic — do NOT reorder the array manually

---

## File overview

| File | Purpose |
|------|---------|
| `index.html` | The entire site — HTML, CSS, JS in one file |
| `ADD_PROJECT_INSTRUCTIONS.md` | Step-by-step instructions for adding a project to `PROJECT_DATA` |
| `AGENT.md` | This file — context and rules for AI agents |
| `README.md` | Human-readable project overview |

---

## How to add a project (current architecture)

See `ADD_PROJECT_INSTRUCTIONS.md` for detailed steps. Summary:

1. Open `index.html`
2. Find the `PROJECT_DATA` array
3. Add a new object at the end of the array (before `];`)
4. Follow the data shape exactly
5. Verify bracket/quote matching
6. Save

The page auto-renders. No build step needed.

---

## How to edit or delete a project (current architecture)

### Edit:
1. Find the project object in `PROJECT_DATA` by its `name`
2. Modify the field values you need to change
3. Do not change the object structure
4. Save

### Delete:
1. Find the project object in `PROJECT_DATA` by its `name`
2. Remove the entire object (including the trailing comma if it's not the last item, or the leading comma if it is the last item)
3. Verify the array still has correct comma separation
4. Save

---

## Migration guide — Next.js + Vercel

When tasked with migrating this project, follow this plan:

### 1. Scaffold
```bash
npx create-next-app@latest . --typescript --tailwind=no --eslint --app --src-dir=no
```
Keep the existing `index.html` as reference. Don't delete it until migration is verified.

### 2. Storage
- Use **Vercel Blob** (`@vercel/blob`) to store `projects.json`
- Thumbnail images also go in Vercel Blob
- Do NOT use filesystem storage — Vercel serverless functions are stateless

### 3. API routes
Create `app/api/projects/route.ts`:
- `GET` — read `projects.json` from Blob, return it
- `POST` — add a project, write back to Blob
- `PUT` — edit a project by ID, write back to Blob
- `DELETE` — remove a project by ID, write back to Blob

Create `app/api/projects/[id]/thumbnail/route.ts`:
- `POST` — accept an image upload, store in Blob, update the project's `thumbnail` field

### 4. Auth
- Store an API key in Vercel env var `API_KEY`
- Check `X-API-Key` header on all mutating requests (POST, PUT, DELETE)
- GET can be public

### 5. Frontend
- Convert the HTML/CSS/JS from `index.html` into `app/page.tsx`
- Fetch projects from `/api/projects` on page load
- Keep all existing CSS (move to a CSS module or global stylesheet)
- Add edit/delete UI to cards (small icon buttons, modal or inline)

### 6. Data shape
Add an `id` field (UUID or nanoid) to each project object for the API. The rest of the shape stays the same.

### 7. Deploy
- Push to this repo
- Connect to Vercel
- Enable Blob storage in Vercel dashboard
- Set `API_KEY` env var

---

## Known limitations

- No persistence — project data is hardcoded in the HTML file. Refreshing the page after using the "+" button loses added projects.
- No edit/delete UI — currently you must edit the source code directly.
- No image upload — thumbnails show a dot-grid placeholder. The `thumbnail` field exists but all values are `null`.
- The "+" button in the navbar adds a dummy project to the in-memory array. It does not persist.
- The `ADD_PROJECT_INSTRUCTIONS.md` file references the old file path in Dropbox. After migration, update it to reference the repo path or remove it in favor of API-based management.

---

## Design details (for reference)

- **Theme**: Dark (#000 background), accent purple (#A49AF3)
- **Font**: Inter (Google Fonts), monospace for dates/labels
- **Cards**: Fixed height (180px), 16px gap, 14px border-radius, dot-grid placeholder thumbnails
- **Navbar**: Floating, sticky, rounded, glassmorphism blur, contains logo + filter buttons + add button
- **Detail panel**: Slide-in from right, 480px wide, shows full project info
- **Animations**: Minimal — 250ms opacity fade on filter change, hover lift on cards
