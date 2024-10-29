'use client'

import React, { useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from '@/Components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const statusColors = {
  pending: 'bg-red-600 drop-shadow-[0_0_10px_rgba(250,0,0,0.2)]',
  'in progress': 'bg-cyan-500 drop-shadow-[0_0_10px_rgba(0,200,200,0.4)]',
  finished: 'bg-emerald-600 drop-shadow-[0_0_10px_rgba(0,200,100,0.6)]'
}

export default function CreateTask({
  listId,
  taskName,
  setTaskName,
  taskDescription,
  setTaskDescription,
  handleCreateTask,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  status,
  setStatus,
  list,
  tasks
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    handleCreateTask(e, listId)
    setIsDialogOpen(false)
  }

  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-neutral-800 hover:bg-neutral-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className=" max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold mb-4">
              Add a task to{' '}
              <span className='rounded-md bg-neutral-800 bg-opacity-20 pt-2 pb-1 px-1'>
                <span className="bg-gradient-to-r from-slate-400 via-white to-black-300 text-transparent bg-clip-text font-bold drop-shadow-[0_0_10px_rgba(200,255,255,0.6)]">
                  {list.title}
                </span>
              </span>
            </DialogTitle>
          </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Task name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
              <Textarea
                placeholder="Task description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="min-h-[225px] resize-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">Status</label>
                <div className="flex space-x-2">
                  {Object.entries(statusColors).map(([key, color]) => (
                    <motion.button
                      key={key}
                      type="button"
                      onClick={() => setStatus(key)}
                      className={`
                        px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-200
                        ${status === key 
                          ? `${color} text-white` 
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {key}
                    </motion.button>
                  ))}
                </div>
              </div>
              
            
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Add Task
            </Button>
          </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}