'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
        console.log('tasks', tasks);
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
                      <DropdownMenuItem onSelect={() => {}}>
                        <Star className="w-4 h-4 mr-2" />
                        Favorite
                      </DropdownMenuItem>
                      {isAdminOfProjectTeam(project) && (
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
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </a>
          </Card>
        );
      })}

      {/* Edit Modal */}
      {/* ... */}
    </div>
  );
}