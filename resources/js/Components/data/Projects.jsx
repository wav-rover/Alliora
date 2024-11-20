'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Badge } from "@/Components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { ArrowUpRight, Users, Star, BarChart, Pencil, Trash2, MoreHorizontal } from 'lucide-react'

export default function Component({tasks, projects = [], onProjectModified = () => {}, adminTeams = [] }) {
  const [editingProject, setEditingProject] = useState(null);
  const [editedProject, setEditedProject] = useState({});

  if (projects.length === 0) {
    return <div className="text-center text-gray-500">No projects available</div>;
  }

  const handleEditClick = (project) => {
    setEditingProject(project.id);
    setEditedProject(project);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editingProject !== null) {
      await onProjectModified('edit', editedProject);
      setEditingProject(null);
    }
  };

  const handleDelete = async (projectId) => {
    await onProjectModified('delete', { id: projectId });
  };

  const isAdminOfProjectTeam = (project) => {
    return adminTeams.some((team) => team.id === project.team_id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-5">
      {projects.map((project) => {
        // Calcul de la progression du projet
        const tasks = project.tasks || [];
        const totalTasks = tasks.length;
        const completedTasks = tasks.reduce((acc, task) => {
          if (task.status === 'pending') return acc;
          if (task.status === 'in progress') return acc + 0.5;
          if (task.status === 'finished') return acc + 1;
          return acc;
        }, 0);
        const progress = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : 0;

        return (
          <Card key={project.id} className="group relative overflow-hidden border-0 bg-background">
            <a
              href={`/projects/${project.id}`}
              className="block"
              onClick={(e) => e.target.tagName === 'BUTTON' && e.preventDefault()}
            >
              <div className="relative z-10 p-6">
                {/* Header with project stats */}
                <div className="flex items-center justify-between mb-6">
                  <Badge
                    variant="outline"
                    className="bg-white/5 text-gray-500 border-0 backdrop-blur-2xl"
                  >
                    Project #{project.id}
                  </Badge>
                </div>

                {/* Project title and description */}
                <div className="mb-6">
                  <motion.h2
                    className="text-3xl font-bold text-white mb-2 tracking-tight"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {project.name}
                  </motion.h2>
                </div>

                {/* Progress section */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">{`${progress}%`}</span>
                  </div>
                  <motion.div
                    className="h-1.5 bg-white/10 rounded-full overflow-hidden drop-shadow-[0_0_10px_rgba(200,255,255,0.3)]"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 1, duration: 0.8, ease: 'easeOut' }}
                    />
                  </motion.div>
                </div>

                {/* Team section */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {adminTeams
                      .filter((team) => team.id === project.team_id)
                      .map((team) => (
                        <span
                          key={team.id}
                          className="text-sm text-white bg-neutral-800 px-2 py-1 rounded-full"
                        >
                          {team.name}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Dropdown menu */}
                <div className="absolute top-4 right-4">
                  
                {isAdminOfProjectTeam(project) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-600 text-white"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <>
                          <DropdownMenuItem onSelect={() => handleEditClick(project)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => handleDelete(project.id)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                    </DropdownMenuContent>
                  </DropdownMenu>
                      )}
                </div>
              </div>
            </a>
          </Card>
        );
      })}

{/* Edit Modal */}
<AnimatePresence>
        {editingProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 text-white p-6">
                <h3 className="text-xl font-bold mb-4">Edit Project</h3>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Project Name</label>
                    <input
                      type="text"
                      value={editedProject.name || ''}
                      onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                      placeholder="Enter project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Description</label>
                    <textarea
                      value={editedProject.description || ''}
                      onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-indigo-500 text-white"
                      placeholder="Enter project description"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingProject(null)}
                      className="border-zinc-700 text-gray-400 hover:bg-zinc-800"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600 text-white">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}