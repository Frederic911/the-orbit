"use client";

import { useEffect, useState, useCallback } from "react";

interface Project {
  id: string;
  name: string;
  category: string;
  date: string;
  description: string;
  thumbnail: string | null;
  liveUrl: string | null;
  githubUrl: string | null;
}

const CATEGORIES = ["Startup Ops", "Hobby Builds", "Client Projects"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function sortProjects(data: Project[]): Project[] {
  return [...data].sort((a, b) => {
    const [am, ay] = [a.date.split(" ")[0], parseInt(a.date.split(" ")[1])];
    const [bm, by] = [b.date.split(" ")[0], parseInt(b.date.split(" ")[1])];
    return (by * 12 + MONTHS.indexOf(bm)) - (ay * 12 + MONTHS.indexOf(am));
  });
}

const LinkIcon = () => (
  <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 8.5l3-3M8 2.5h3v3" /><rect x="1" y="1" width="11" height="11" rx="2" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 13 13" fill="currentColor">
    <path d="M6.5 0C2.9 0 0 2.9 0 6.5c0 2.9 1.9 5.3 4.5 6.2.3.1.4-.1.4-.3v-1c-1.8.4-2.2-.9-2.2-.9-.3-.7-.7-.9-.7-.9-.6-.4 0-.4 0-.4.6 0 .9.6.9.6.6 1 1.5.7 1.9.5.1-.4.2-.7.4-.9-1.4-.2-2.9-.7-2.9-3.1 0-.7.2-1.3.6-1.7-.1-.2-.3-.8.1-1.7 0 0 .5-.2 1.6.6.5-.1 1-.2 1.5-.2s1 .1 1.5.2c1.1-.7 1.6-.6 1.6-.6.4.9.2 1.5.1 1.7.4.4.6 1 .6 1.7 0 2.4-1.5 2.9-2.9 3.1.2.2.4.6.4 1.2v1.8c0 .2.1.4.4.3C11.1 11.8 13 9.4 13 6.5 13 2.9 10.1 0 6.5 0z" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.5 1.5l3 3L5 14H2v-3z" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4h12M5.3 4V2.7a1 1 0 011-1h3.4a1 1 0 011 1V4M6 7v5M10 7v5" /><path d="M3.3 4l.8 9.3a1 1 0 001 .9h5.8a1 1 0 001-.9L12.7 4" />
  </svg>
);

function EditModal({
  project,
  onSave,
  onDelete,
  onClose,
}: {
  project: Project | null;
  onSave: (data: Partial<Project> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
}) {
  const isNew = !project;
  const [name, setName] = useState(project?.name ?? "");
  const [category, setCategory] = useState(project?.category ?? "Hobby Builds");
  const [date, setDate] = useState(project?.date ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isNew ? "Add Project" : "Edit Project"}</h2>
        <div className="modal-field">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
        </div>
        <div className="modal-field">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="modal-field">
          <label>Date</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="May 2025" />
        </div>
        <div className="modal-field">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." />
        </div>
        <div className="modal-field">
          <label>Live URL</label>
          <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="modal-field">
          <label>GitHub URL</label>
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
        </div>
        <div className="modal-actions">
          {!isNew && onDelete && (
            <button className="modal-btn delete" onClick={() => onDelete(project!.id)} style={{ marginRight: "auto" }}>
              Delete
            </button>
          )}
          <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
          <button
            className="modal-btn save"
            onClick={() =>
              onSave({
                ...(project ? { id: project.id } : {}),
                name,
                category,
                date,
                description,
                liveUrl: liveUrl || null,
                githubUrl: githubUrl || null,
              })
            }
          >
            {isNew ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState("all");
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [editProject, setEditProject] = useState<Project | null | "new">(null);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetailProject(null);
        setEditProject(null);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const filtered = sortProjects(
    filter === "all" ? projects : projects.filter((p) => p.category === filter)
  );

  const handleSave = async (data: Partial<Project> & { id?: string }) => {
    if (data.id) {
      await fetch(`/api/projects/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-api-key": "local" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": "local" },
        body: JSON.stringify(data),
      });
    }
    setEditProject(null);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
      headers: { "x-api-key": "local" },
    });
    setEditProject(null);
    setDetailProject(null);
    fetchProjects();
  };

  return (
    <>
      <header id="topbar">
        <div className="topbar-inner">
          <div className="topbar-left">
            <span className="topbar-logo">The Orbit</span>
          </div>
          <div className="topbar-center">
            <div className="filter-group">
              {["all", ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn${filter === cat ? " active" : ""}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat === "all" ? "All" : cat}
                </button>
              ))}
            </div>
          </div>
          <div className="topbar-right">
            <button
              className="add-btn"
              title="Add project"
              onClick={() => setEditProject("new")}
            >
              +
            </button>
          </div>
        </div>
      </header>

      <section id="projects">
        <div className="projects-list">
          {loading ? (
            <div className="empty-state">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No projects in this category yet.</div>
          ) : (
            filtered.map((project) => (
              <article
                key={project.id}
                className="project-card"
                onClick={() => setDetailProject(project)}
              >
                <div className="project-card-inner">
                  <div className="project-thumb">
                    {project.thumbnail ? (
                      <img src={project.thumbnail} alt={`${project.name} screenshot`} loading="lazy" />
                    ) : (
                      <div className="project-thumb-placeholder">
                        <div className="dot-grid" />
                      </div>
                    )}
                  </div>
                  <div className="project-body">
                    <div className="project-links">
                      {project.liveUrl && (
                        <a className="project-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <LinkIcon /> Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a className="project-link" href={project.githubUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                          <GitHubIcon /> GitHub
                        </a>
                      )}
                    </div>
                    <div className="project-top">
                      <h2 className="project-name">{project.name}</h2>
                      <span className="project-date">{project.date}</span>
                      <p className="project-description">{project.description}</p>
                    </div>
                    <div className="project-actions">
                      <button
                        className="action-btn"
                        title="Edit"
                        onClick={(e) => { e.stopPropagation(); setEditProject(project); }}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <div
        id="detail-overlay"
        className={detailProject ? "open" : ""}
        onClick={() => setDetailProject(null)}
      />
      <aside id="detail-panel" className={detailProject ? "open" : ""} role="dialog">
        {detailProject && (
          <>
            <div className="detail-close">
              <span className="detail-cat-tag">{detailProject.category}</span>
              <button className="detail-close-btn" onClick={() => setDetailProject(null)}>
                &#x2715;
              </button>
            </div>
            <div className="detail-content">
              <div className="detail-thumb">
                {detailProject.thumbnail ? (
                  <img src={detailProject.thumbnail} alt={`${detailProject.name} screenshot`} />
                ) : (
                  <div className="detail-thumb-placeholder">
                    <div className="dot-grid" />
                  </div>
                )}
              </div>
              <h2 className="detail-title">{detailProject.name}</h2>
              <p className="detail-date">{detailProject.date}</p>
              <p className="detail-description">{detailProject.description}</p>
              <div className="detail-links">
                {detailProject.liveUrl && (
                  <a className="detail-link" href={detailProject.liveUrl} target="_blank" rel="noopener noreferrer">
                    <LinkIcon /> View Live
                  </a>
                )}
                {detailProject.githubUrl && (
                  <a className="detail-link" href={detailProject.githubUrl} target="_blank" rel="noopener noreferrer">
                    <GitHubIcon /> GitHub
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </aside>

      {editProject !== null && (
        <EditModal
          project={editProject === "new" ? null : editProject}
          onSave={handleSave}
          onDelete={editProject !== "new" ? handleDelete : undefined}
          onClose={() => setEditProject(null)}
        />
      )}
    </>
  );
}
