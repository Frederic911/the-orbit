# HOW TO ADD A NEW PROJECT — THE ORBIT PORTFOLIO

## Overview
You are editing `index.html` — a single self-contained HTML file. It is a personal portfolio website with a Linear-inspired dark aesthetic. Your ONLY task is to add ONE new project to the `PROJECT_DATA` array. Do NOT touch anything else.

---

## WHAT YOU MUST NOT TOUCH
- Any HTML, CSS, or JavaScript outside the `PROJECT_DATA` array
- The `<style>` block
- The `<script>` block structure
- Any class names, IDs, or selectors
- Any animations, transitions, or CSS variables
- The hero section, nav, filter bar, sort bar, detail panel, or add button
- Any existing project objects in the array

Breaking these rules will break the site. You have been warned.

---

## FILE LOCATION
```
index.html
```

---

## STEP 1 — READ THE FILE
Before doing anything else, read the entire file. Search for `PROJECT_DATA` to locate the array. Each object in the array represents one project.

---

## STEP 2 — LOCATE THE ARRAY
Look for this exact marker inside the `<script>` tag:
```js
const PROJECT_DATA = [
  // existing projects here
];
```

The array contains objects like this (one per line, separated by commas):

```js
{
  name: "Project Name",
  category: "Client Projects",
  date: "April 2025",
  description: "One or two sentences describing the project.",
  thumbnail: null,
  liveUrl: null,
  githubUrl: null
}
```

---

## STEP 3 — UNDERSTAND EACH FIELD

| Field        | Required | What to put                                                                 |
|--------------|----------|------------------------------------------------------------------------------|
| `name`       | Yes      | The display name of the project. Max ~60 chars.                              |
| `category`   | Yes      | Must be exactly ONE of: `Startup Ops`, `Hobby Builds`, or `Client Projects`  |
| `date`       | Yes      | Format: `Month YYYY` (e.g., `May 2025`). Full month name, space, 4-digit year |
| `description`| Yes      | 1–2 sentences. No HTML. No Markdown. Plain text only. Max ~200 chars.       |
| `thumbnail`  | No       | Full URL to an image (e.g., `https://...`). Use `null` for the gray placeholder. |
| `liveUrl`    | No       | Full URL to the live site (e.g., `https://...`). Use `null` if no live URL. |
| `githubUrl`  | No       | Full URL to the GitHub repo. Use `null` if no GitHub URL.                   |

---

## STEP 4 — WRITE THE NEW PROJECT OBJECT

Write the new object following the exact template below. Replace the placeholder values only. Keep all quotes, commas, and brackets exactly as shown.

```js
{
  name: "Your Project Name",
  category: "Startup Ops",
  date: "May 2026",
  description: "Brief description of what this project is and what it does.",
  thumbnail: null,
  liveUrl: null,
  githubUrl: null
}
```

### Category rules — use EXACTLY one of these three strings:
- `Startup Ops` — internal tools, SaaS products, company-building experiments
- `Hobby Builds` — personal side projects, creative experiments, fun stuff
- `Client Projects` — paid client work, deliverables for others

### Date rules:
- Always use full month name: `January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`
- Always use 4-digit year: e.g., `2024`, `2025`, `2026`
- Example: `"March 2025"`
- The projects are sorted by date automatically (newest/oldest toggle). Do NOT re-order the array manually.

---

## STEP 5 — INSERT THE OBJECT INTO THE ARRAY

### If adding to an EMPTY array (no existing projects):
```js
const PROJECT_DATA = [
  {
    name: "Your Project Name",
    category: "Startup Ops",
    date: "May 2026",
    description: "Brief description of what this project is and what it does.",
    thumbnail: null,
    liveUrl: null,
    githubUrl: null
  }
];
```

### If adding to an ARRAY THAT ALREADY HAS PROJECTS:
Find the LAST object in the array (it ends with a closing brace `}` followed by `];`). Insert a comma `,` after that closing brace, then paste your new object before the `];`.

Example — inserting "My New Project" between the last project and the closing `];`:

```js
  {
    name: "Existing Project",
    category: "Client Projects",
    date: "March 2025",
    description: "Existing project description.",
    thumbnail: null,
    liveUrl: "https://example.com",
    githubUrl: null
  },
  {                          // <-- comma + new project
    name: "My New Project",
    category: "Startup Ops",
    date: "May 2026",
    description: "Brief description of my new project.",
    thumbnail: null,
    liveUrl: null,
    githubUrl: null
  }
];
```

Note the comma after the previous project's closing brace `},` — that comma is required between objects.

---

## STEP 6 — VERIFY YOUR EDIT

After saving, do a quick sanity check:
1. The array still starts with `const PROJECT_DATA = [` and ends with `];`
2. Every opening brace `{` has a matching closing brace `}`
3. Every opening bracket `[` has a matching closing bracket `]`
4. Every string value is wrapped in matching quotes (use `"` throughout)
5. Each object in the array is separated by a comma
6. The last object has NO comma after it (before the `]`)

### Quick validation: count your brackets
In the PROJECT_DATA section, the count of `{` should equal `}`, `[` should equal `]`, and `"` should be even. If counts are off, you have a syntax error.

---

## STEP 7 — SAVE THE FILE

Save to:
```
index.html
```

---

## WHAT HAPPENS AUTOMATICALLY
After saving, the page will automatically show the new project:
- It appears in the correct filtered list based on its category
- It can be sorted by date (newest/oldest)
- Clicking the card opens the detail panel
- All styling, animations, and layout are unchanged

You do NOT need to restart a server, run a build, or touch anything else.

---

## COMPLETE EXAMPLE — ADDING A BRAND NEW PROJECT

Here is a full before/after showing how to add "Q1 Pipeline Tracker" to an existing list.

### BEFORE (existing array with 2 projects):
```js
const PROJECT_DATA = [
  {
    name: "RG Design Manual",
    category: "Client Projects",
    date: "April 2025",
    description: "A branded design manual and interactive website for Rittinghaus & Godau.",
    thumbnail: null,
    liveUrl: "https://frederic911.github.io/rg-design-manual/RG_Design_Manual_v0.1.html",
    githubUrl: null
  },
  {
    name: "SlideHome",
    category: "Startup Ops",
    date: "January 2025",
    description: "Presentation engagement SaaS for interactive meetings.",
    thumbnail: null,
    liveUrl: "https://slidehome.io",
    githubUrl: null
  }
];
```

### AFTER (same array, new project added):
```js
const PROJECT_DATA = [
  {
    name: "RG Design Manual",
    category: "Client Projects",
    date: "April 2025",
    description: "A branded design manual and interactive website for Rittinghaus & Godau.",
    thumbnail: null,
    liveUrl: "https://frederic911.github.io/rg-design-manual/RG_Design_Manual_v0.1.html",
    githubUrl: null
  },
  {
    name: "SlideHome",
    category: "Startup Ops",
    date: "January 2025",
    description: "Presentation engagement SaaS for interactive meetings.",
    thumbnail: null,
    liveUrl: "https://slidehome.io",
    githubUrl: null
  },
  {
    name: "Q1 Pipeline Tracker",
    category: "Startup Ops",
    date: "May 2026",
    description: "Internal CRM tracker for monitoring Q1 sales pipeline and deal velocity.",
    thumbnail: null,
    liveUrl: null,
    githubUrl: null
  }
];
```

---

## ERROR CHECKLIST — If the page breaks after your edit:

| Symptom | Cause | Fix |
|---------|-------|-----|
| Page blank or JS error in console | Syntax error in PROJECT_DATA — likely a missing comma, unclosed brace, or unmatched quote | Review bracket counts in PROJECT_DATA section |
| New project not showing | Browser cached old version | Hard refresh (Cmd+Shift+R on Mac) |
| Filter shows wrong count | Array edited outside PROJECT_DATA | Only touch PROJECT_DATA |
| Detail panel broken | HTML edited inside the script | Do NOT touch anything outside PROJECT_DATA |
| Styles broken | CSS edited | Do NOT touch any HTML, CSS, or JS outside PROJECT_DATA |

---

## REAL EXAMPLE FROM THE LIVE FILE

Here is one complete project entry from the live file exactly as it appears:

```js
{
  name: "RG Design Manual",
  category: "Client Projects",
  date: "April 2025",
  description: "A branded design manual and interactive website for Rittinghaus & Godau — clients can view, explore, and download brand assets, typography guidelines, and color palettes in one place.",
  thumbnail: null,
  liveUrl: "https://frederic911.github.io/rg-design-manual/RG_Design_Manual_v0.1.html",
  githubUrl: null
}
```

And the full array as it currently exists in the file:

```js
const PROJECT_DATA = [
  {
    name: "RG Design Manual",
    category: "Client Projects",
    date: "April 2025",
    description: "A branded design manual and interactive website for Rittinghaus & Godau — clients can view, explore, and download brand assets, typography guidelines, and color palettes in one place.",
    thumbnail: null,
    liveUrl: "https://frederic911.github.io/rg-design-manual/RG_Design_Manual_v0.1.html",
    githubUrl: null
  },
  {
    name: "SlideHome",
    category: "Startup Ops",
    date: "January 2025",
    description: "Presentation engagement SaaS that helps teams run more interactive, data-driven meetings. Real-time polling, Q&A, and analytics layered on top of existing slide decks.",
    thumbnail: null,
    liveUrl: "https://slidehome.io",
    githubUrl: null
  },
  {
    name: "JERY Portfolio",
    category: "Hobby Builds",
    date: "November 2024",
    description: "A minimal portfolio site for the JERY creative agency — built as a personal project to explore clean layout systems and typography-driven design in a single-page format.",
    thumbnail: null,
    liveUrl: null,
    githubUrl: "https://github.com/frederic911/jery-portfolio"
  },
  {
    name: "GTM Playbook Builder",
    category: "Startup Ops",
    date: "September 2024",
    description: "An internal Notion-style tool for mapping out go-to-market motion — channels, messaging pillars, and conversion hypotheses laid out in a clean, interconnected grid.",
    thumbnail: null,
    liveUrl: null,
    githubUrl: null
  },
  {
    name: "Pitch Deck Toolkit",
    category: "Hobby Builds",
    date: "July 2024",
    description: "A collection of reusable Slide templates and narrative frameworks for early-stage fundraising — built for personal use and shared with founders in the Munich startup community.",
    thumbnail: null,
    liveUrl: null,
    githubUrl: "https://github.com/frederic911/pitch-deck-toolkit"
  },
  {
    name: "Munich Startup Map",
    category: "Hobby Builds",
    date: "May 2024",
    description: "An interactive map visualizing the Munich startup ecosystem — founders, investors, and co-working spaces as a community resource for the local scene.",
    thumbnail: null,
    liveUrl: null,
    githubUrl: "https://github.com/frederic911/munich-startup-map"
  }
];
```

---

## FINAL REMINDER

> **You are editing a single HTML file. You can only add one object to `PROJECT_DATA`. Do not touch anything else. Do not touch anything else. Do not touch anything else.**

If you follow these instructions exactly, the page will update automatically with zero errors.