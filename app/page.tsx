"use client";

import { useEffect, useState, useCallback, useRef } from "react";

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

function parseMonth(dateStr: string): string {
  const parts = dateStr.split(" ");
  return MONTHS.includes(parts[0]) ? parts[0] : MONTHS[new Date().getMonth()];
}

function parseYear(dateStr: string): string {
  const parts = dateStr.split(" ");
  const y = parseInt(parts[1]);
  return isNaN(y) ? String(new Date().getFullYear()) : String(y);
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

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

const SwapIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3 3-3 3M1 5h14M4 14l-3-3 3-3M15 11H1" />
  </svg>
);

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => String(currentYear - 5 + i));

function EditModal({
  project,
  onSave,
  onDelete,
  onClose,
  onThumbnailChange,
}: {
  project: Project | null;
  onSave: (data: Partial<Project> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  onClose: () => void;
  onThumbnailChange?: () => void;
}) {
  const isNew = !project;
  const [name, setName] = useState(project?.name ?? "");
  const [category, setCategory] = useState(project?.category ?? "Hobby Builds");
  const [month, setMonth] = useState(project ? parseMonth(project.date) : MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(project ? parseYear(project.date) : String(currentYear));
  const [description, setDescription] = useState(project?.description ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(project?.thumbnail ?? null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const handleFileUpload = async (file: File) => {
    if (!project?.id) {
      setError("Save the project first, then add a thumbnail");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be under 4MB");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`/api/projects/${project.id}/thumbnail`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setThumbnailUrl(data.thumbnail);
        onThumbnailChange?.();
      } else {
        console.error("Upload failed:", res.status, data);
        setError(data.error || `Upload failed (${res.status})`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Network error — check your connection");
    }
    setUploading(false);
  };

  const handleRemoveThumbnail = async () => {
    if (!project?.id) return;
    setUploading(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/thumbnail`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setThumbnailUrl(null);
        onThumbnailChange?.();
      }
    } catch {
      setError("Failed to remove thumbnail");
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setError("");
    onSave({
      ...(project ? { id: project.id } : {}),
      name: name.trim(),
      category,
      date: `${month} ${year}`,
      description: description.trim(),
      thumbnail: thumbnailUrl,
      liveUrl: liveUrl.trim() || null,
      githubUrl: githubUrl.trim() || null,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isNew ? "Add Project" : "Edit Project"}</h2>
        {error && <p className="modal-error">{error}</p>}

        {!isNew && (
          <div className="modal-field">
            <label>Thumbnail</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />
            {thumbnailUrl ? (
              <div className="thumb-preview">
                <img src={thumbnailUrl} alt="Thumbnail" />
                <div className="thumb-overlay">
                  <button
                    className="thumb-action-btn"
                    title="Replace image"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <SwapIcon />
                  </button>
                  <button
                    className="thumb-action-btn delete"
                    title="Remove image"
                    onClick={handleRemoveThumbnail}
                    disabled={uploading}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`thumb-dropzone${dragOver ? " drag-over" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <UploadIcon />
                <span>{uploading ? "Uploading..." : "Click or drag image here"}</span>
                <span className="thumb-hint">JPG, PNG, or WebP — max 4MB — displayed at 16:9</span>
              </div>
            )}
          </div>
        )}
        {isNew && (
          <p className="thumb-new-hint">Save the project first, then you can add a thumbnail.</p>
        )}

        <div className="modal-field">
          <label>Name <span className="required">*</span></label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
        </div>
        <div className="modal-field">
          <label>Category <span className="required">*</span></label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="modal-field">
          <label>Date <span className="required">*</span></label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ flex: 1 }}>
              {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(e.target.value)} style={{ width: "100px" }}>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              {!YEARS.includes(year) && <option value={year}>{year}</option>}
            </select>
          </div>
        </div>
        <div className="modal-field">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description (optional)" />
        </div>
        <div className="modal-field">
          <label>Live URL</label>
          <input value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://... (optional)" />
        </div>
        <div className="modal-field">
          <label>GitHub URL</label>
          <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/... (optional)" />
        </div>
        <div className="modal-actions">
          {!isNew && onDelete && (
            <button className="modal-btn delete" onClick={() => onDelete(project!.id)} style={{ marginRight: "auto" }}>
              Delete
            </button>
          )}
          <button className="modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn save" onClick={handleSubmit}>
            {isNew ? "Add" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon"><TrashIcon /></div>
        <h3>Delete project?</h3>
        <p>&ldquo;{name}&rdquo; will be permanently removed.</p>
        <div className="confirm-actions">
          <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-btn delete-confirm" onClick={onConfirm}>Delete</button>
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
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
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
        setDeleteTarget(null);
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
    try {
      if (data.id) {
        const res = await fetch(`/api/projects/${data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) console.error("Save failed:", await res.text());
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) console.error("Create failed:", await res.text());
      }
    } catch (err) {
      console.error("Save error:", err);
    }
    setEditProject(null);
    setDetailProject(null);
    await fetchProjects();
  };

  const requestDelete = (project: Project) => {
    setDeleteTarget(project);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) console.error("Delete failed:", await res.text());
    } catch (err) {
      console.error("Delete error:", err);
    }
    setDeleteTarget(null);
    setEditProject(null);
    setDetailProject(null);
    await fetchProjects();
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
              <div className="detail-actions">
                <button
                  className="action-btn"
                  title="Edit"
                  onClick={() => setEditProject(detailProject)}
                >
                  <EditIcon />
                </button>
                <button
                  className="action-btn delete"
                  title="Delete"
                  onClick={() => requestDelete(detailProject)}
                >
                  <TrashIcon />
                </button>
                <button className="detail-close-btn" onClick={() => setDetailProject(null)}>
                  &#x2715;
                </button>
              </div>
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
          key={editProject === "new" ? "new" : editProject.id}
          project={editProject === "new" ? null : editProject}
          onSave={handleSave}
          onDelete={editProject !== "new" ? (id: string) => {
            const p = projects.find(pr => pr.id === id);
            if (p) requestDelete(p);
          } : undefined}
          onClose={() => setEditProject(null)}
          onThumbnailChange={fetchProjects}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </>
  );
}
