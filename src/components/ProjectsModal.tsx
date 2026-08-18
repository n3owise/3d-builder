import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  fetchUserProjects,
  createCloudProject,
  updateCloudProject,
  deleteCloudProject,
} from "../services/projectService";
import type { CloudProject, SavedProject } from "../types";
import { Icon } from "../icons";
import { CELL_SIZE } from "../layout";

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDocument: SavedProject;
  currentCloudProjectId: string | null;
  onLoadProject: (cloudProject: CloudProject) => void;
  onSaveSuccess: (cloudProject: CloudProject) => void;
  onNotice: (message: string) => void;
  onOpenAuth: () => void;
}

export function ProjectsModal({
  isOpen,
  onClose,
  currentDocument,
  currentCloudProjectId,
  onLoadProject,
  onSaveSuccess,
  onNotice,
  onOpenAuth,
}: ProjectsModalProps) {
  const { user, isConfigured } = useAuth();
  const [projects, setProjects] = useState<CloudProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveName, setSaveName] = useState(currentDocument.name || "My Modular Room");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const loadProjects = async () => {
    if (!user || !isConfigured) return;
    setLoading(true);
    const { data, error } = await fetchUserProjects();
    setLoading(false);
    if (error) {
      onNotice(`Error fetching projects: ${error}`);
    } else if (data) {
      setProjects(data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSaveName(currentDocument.name || "My Modular Room");
      loadProjects();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!saveName.trim()) return;

    setSaving(true);
    const docToSave: SavedProject = {
      ...currentDocument,
      name: saveName.trim(),
    };
    const { data, error } = await createCloudProject(saveName.trim(), docToSave);
    setSaving(false);

    if (error) {
      onNotice(`Failed to save: ${error}`);
    } else if (data) {
      onNotice(`Project "${data.name}" saved to cloud!`);
      onSaveSuccess(data);
      loadProjects();
    }
  };

  const handleOverwrite = async (id: string, name: string) => {
    setSaving(true);
    const docToSave: SavedProject = {
      ...currentDocument,
      name,
    };
    const { data, error } = await updateCloudProject(id, name, docToSave);
    setSaving(false);

    if (error) {
      onNotice(`Failed to update project: ${error}`);
    } else if (data) {
      onNotice(`Project "${data.name}" updated in cloud!`);
      onSaveSuccess(data);
      loadProjects();
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    const { error } = await deleteCloudProject(id);
    if (error) {
      onNotice(`Failed to delete project: ${error}`);
    } else {
      onNotice(`Project "${name}" deleted.`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    const { data, error } = await updateCloudProject(id, editName.trim(), target.document);
    if (error) {
      onNotice(`Failed to rename: ${error}`);
    } else if (data) {
      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
      setEditingId(null);
      onNotice("Project renamed.");
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-large" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-group">
            <span className="modal-tag">CLOUD PROJECTS</span>
            <h3>Cloud Project Manager</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>

        {!user ? (
          <div className="modal-body auth-prompt">
            <div className="auth-prompt-card">
              <Icon name="cloud" />
              <h4>Sign in to save and manage cloud projects</h4>
              <p>
                Create an account or sign in to sync your room layouts across multiple browsers and devices.
              </p>
              <button type="button" className="submit-btn primary" onClick={() => { onClose(); onOpenAuth(); }}>
                Sign In / Register
              </button>
            </div>
          </div>
        ) : (
          <div className="modal-body projects-modal-body">
            {/* Quick Save current layout */}
            <div className="save-current-panel">
              <div className="save-current-header">
                <div>
                  <strong>Save Current Assembly</strong>
                  <p>
                    {currentDocument.cells.length} tiles (
                    {currentDocument.cells.length * CELL_SIZE * CELL_SIZE} m²)
                  </p>
                </div>
                {currentCloudProjectId && (
                  <button
                    type="button"
                    className="update-btn"
                    disabled={saving}
                    onClick={() => {
                      const currentP = projects.find((p) => p.id === currentCloudProjectId);
                      handleOverwrite(currentCloudProjectId, currentP?.name || saveName);
                    }}
                  >
                    <Icon name="cloud" />
                    {saving ? "Updating..." : "Update Current Cloud File"}
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveNew} className="save-new-form">
                <input
                  type="text"
                  placeholder="New project name..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  maxLength={64}
                  required
                />
                <button type="submit" className="save-new-btn" disabled={saving}>
                  <Icon name="plus" />
                  {saving ? "Saving..." : "Save as New"}
                </button>
              </form>
            </div>

            {/* List of existing saved projects */}
            <div className="projects-list-header">
              <h4>Saved in Cloud ({projects.length})</h4>
              <div className="search-box">
                <input
                  type="search"
                  placeholder="Filter projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="projects-loading">
                <Icon name="cube" />
                <span>Loading your projects from cloud...</span>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="projects-empty">
                <p>
                  {searchQuery
                    ? "No projects matched your filter."
                    : "No cloud projects saved yet. Save your current layout above!"}
                </p>
              </div>
            ) : (
              <div className="projects-grid">
                {filteredProjects.map((p) => {
                  const cellCount = Array.isArray(p.document?.cells) ? p.document.cells.length : 0;
                  const isCurrent = p.id === currentCloudProjectId;

                  return (
                    <article key={p.id} className={`project-item-card ${isCurrent ? "is-active" : ""}`}>
                      <div className="project-card-top">
                        {editingId === p.id ? (
                          <div className="inline-rename-form">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleRename(p.id);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                            />
                            <button type="button" onClick={() => handleRename(p.id)}>
                              <Icon name="check" />
                            </button>
                          </div>
                        ) : (
                          <div className="project-title-row">
                            <h5>{p.name}</h5>
                            {isCurrent && <span className="active-badge">Active</span>}
                          </div>
                        )}
                        <span className="project-date">{formatDate(p.updated_at)}</span>
                      </div>

                      <div className="project-card-stats">
                        <span>
                          <strong>{cellCount}</strong> tiles
                        </span>
                        <span>
                          <strong>{cellCount * CELL_SIZE * CELL_SIZE}</strong> m²
                        </span>
                      </div>

                      <div className="project-card-actions">
                        <button
                          type="button"
                          className="load-btn primary"
                          onClick={() => {
                            onLoadProject(p);
                            onClose();
                          }}
                        >
                          <Icon name="cube" /> Load Assembly
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn"
                          title="Rename"
                          onClick={() => {
                            setEditingId(p.id);
                            setEditName(p.name);
                          }}
                        >
                          <Icon name="brush" />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn danger"
                          title="Delete"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Icon name="clear" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
