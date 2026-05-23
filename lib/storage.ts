import { put, list, del } from "@vercel/blob";
import { Project } from "./types";

const BLOB_FILENAME = "projects.json";

const SEED_DATA: Project[] = [
  { id: "rg-design-manual", name: "RG Design Manual", category: "Client Projects", date: "April 2025", description: "A branded design manual and interactive website for Rittinghaus & Godau — clients can view, explore, and download brand assets, typography guidelines, and color palettes in one place.", thumbnail: null, liveUrl: "https://frederic911.github.io/rg-design-manual/RG_Design_Manual_v0.1.html", githubUrl: null },
  { id: "slidehome", name: "SlideHome", category: "Startup Ops", date: "January 2025", description: "Presentation engagement SaaS that helps teams run more interactive, data-driven meetings. Real-time polling, Q&A, and analytics layered on top of existing slide decks.", thumbnail: null, liveUrl: "https://slidehome.io", githubUrl: null },
  { id: "jery-portfolio", name: "JERY Portfolio", category: "Hobby Builds", date: "November 2024", description: "A minimal portfolio site for the JERY creative agency — built as a personal project to explore clean layout systems and typography-driven design in a single-page format.", thumbnail: null, liveUrl: null, githubUrl: "https://github.com/frederic911/jery-portfolio" },
  { id: "gtm-playbook-builder", name: "GTM Playbook Builder", category: "Startup Ops", date: "September 2024", description: "An internal Notion-style tool for mapping out go-to-market motion — channels, messaging pillars, and conversion hypotheses laid out in a clean, interconnected grid.", thumbnail: null, liveUrl: null, githubUrl: null },
  { id: "pitch-deck-toolkit", name: "Pitch Deck Toolkit", category: "Hobby Builds", date: "July 2024", description: "A collection of reusable Slide templates and narrative frameworks for early-stage fundraising — built for personal use and shared with founders in the Munich startup community.", thumbnail: null, liveUrl: null, githubUrl: "https://github.com/frederic911/pitch-deck-toolkit" },
  { id: "munich-startup-map", name: "Munich Startup Map", category: "Hobby Builds", date: "May 2024", description: "An interactive map visualizing the Munich startup ecosystem — founders, investors, and co-working spaces as a community resource for the local scene.", thumbnail: null, liveUrl: null, githubUrl: "https://github.com/frederic911/munich-startup-map" },
];

async function findBlobUrl(): Promise<string | null> {
  const { blobs } = await list();
  const match = blobs.find((b) => b.pathname === BLOB_FILENAME);
  return match?.url ?? null;
}

export async function getProjects(): Promise<Project[]> {
  const url = await findBlobUrl();
  if (!url) {
    await saveProjects(SEED_DATA);
    return SEED_DATA;
  }
  const res = await fetch(url, { cache: "no-store" });
  return res.json();
}

export async function saveProjects(projects: Project[]): Promise<void> {
  const existing = await findBlobUrl();
  if (existing) {
    await del(existing);
  }
  await put(BLOB_FILENAME, JSON.stringify(projects, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}
