"use client";

import { motion } from "framer-motion";
import { FolderOpen, ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

interface ProjectEntry {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  link?: string;
}

interface ProjectsTabProps {
  projects: ProjectEntry[];
  isLoading?: boolean;
  isOwnProfile?: boolean;
  onAddProject?: () => void;
  onRemoveProject?: (id: string) => void;
}

export default function ProjectsTab({ projects, isLoading, isOwnProfile, onAddProject, onRemoveProject }: ProjectsTabProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-64 bg-neutral-100 animate-pulse rounded-lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl">Projects</h2>
        {isOwnProfile && (
          <button
            onClick={onAddProject}
            className="flex items-center gap-2 px-4 py-2 border-2 border-ink rounded-full text-sm font-bold hover:bg-ink hover:text-white transition-colors"
          >
            ADD <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {(!projects || projects.length === 0) ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="font-display text-lg text-ink mb-2">No projects yet</h3>
          <p className="text-neutral-500 text-sm mb-6">
            Showcase your work and side projects
          </p>
          {isOwnProfile && (
            <button
              onClick={onAddProject}
              className="btn-neo btn-primary text-sm"
            >
              Add Project
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-paper-light rounded-xl border border-ink/10 overflow-hidden hover:shadow-neo transition-shadow group"
            >
              {/* Project Image */}
              {project.imageUrl && (
                <div className="aspect-video bg-neutral-100 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Project Details */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-ink">{project.title}</h3>
                    <p className="text-neutral-600 text-sm mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-neutral-500" />
                      </a>
                    )}
                    {isOwnProfile && onRemoveProject && (
                      <button
                        onClick={() => onRemoveProject(project.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-paper border border-ink/10 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}


