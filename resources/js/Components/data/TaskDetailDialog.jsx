import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, User, Edit2, Check, ChevronsUpDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from '@/Components/ui/scroll-area';
import AddDependency from '@/Components/form/add-dependency';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const statusColors = {
  pending: 'bg-red-600 drop-shadow-[0_0_10px_rgba(250,0,0,0.2)]',
  'in progress': 'bg-cyan-500 drop-shadow-[0_0_10px_rgba(0,200,200,0.4)]',
  finished: 'bg-emerald-600 drop-shadow-[0_0_10px_rgba(0,200,100,0.6)]'
};

export default function TaskDetailDialog({
  handleTaskClick = {},
  selectedTask = [],
  setSelectedTask ={},
  tasks = [],
  users = [],
  list = {},
  task = {},
  onTaskUpdate = () => { },
  isOpen = false,
  onClose = () => { },
  handleCreateTask = () => { },
  handleDeleteTask = () => { }
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isEditingStartDate, setIsEditingStartDate] = useState(false);
  const [isEditingEndDate, setIsEditingEndDate] = useState(false);
  const [tempName, setTempName] = useState(task.name);
  const [tempDescription, setTempDescription] = useState(task.description);
  const [tempStartDate, setTempStartDate] = useState(task.start_date);
  const [tempEndDate, setTempEndDate] = useState(task.end_date);
  const [tempStatus, setTempStatus] = useState(task.status);
  const [tempUserId, setTempUserId] = useState(task.user_id);
  const [dependencies, setDependencies] = useState(task.dependencies || []);
  const [open, setOpen] = useState(false);

  const handleCreateDependency = (dependencies) => {
    handleCreateTask(dependencies);
  };

  useEffect(() => {
    setTempName(task.name);
    setTempDescription(task.description);
    setTempStartDate(task.start_date);
    setTempEndDate(task.end_date);
    setTempStatus(task.status);
    setTempUserId(task.user_id);
    setDependencies(task.dependencies || []);
  }, [task]);

  const handleNameEdit = () => {
    onTaskUpdate({ ...task, name: tempName });
    setIsEditingName(false);
  };

  const handleDescriptionEdit = () => {
    onTaskUpdate({ ...task, description: tempDescription });
    setIsEditingDescription(false);
  };

  const handleStartDateEdit = () => {
    onTaskUpdate({ ...task, start_date: tempStartDate });
    setIsEditingStartDate(false);
  };

  const handleEndDateEdit = () => {
    onTaskUpdate({ ...task, end_date: tempEndDate });
    setIsEditingEndDate(false);
  };
  
  const cycleStatus = () => {
    const statusOrder = ['pending', 'in progress', 'finished'];
    const currentIndex = statusOrder.indexOf(tempStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    setTempStatus(nextStatus);
    const updatedTask = { ...task, status: nextStatus };
    onTaskUpdate(updatedTask);
  };

  const handleUserChange = (userId) => {
    setTempUserId(userId);
    onTaskUpdate({ ...task, user_id: userId });
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full">
      <ScrollArea className="h-[80vh] rounded-md pr-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center text-2xl font-bold mb-4">
              <div className='flex gap-3 items-center justify-start'>
                {list.title} -
                {isEditingName ? (
                  <Input
                    maxLength={40}
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={handleNameEdit}
                    onKeyPress={(e) => e.key === 'Enter' && handleNameEdit()}
                    className="text-2xl bg-neutral-900 w-fit border-neutral-700 text-white placeholder-neutral-400 focus:border-neutral-500 focus:ring-1 focus:ring-neutral-500 focus:ring-opacity-50"
                    autoFocus
                  />
                ) : (
                  <div
                    className="relative group cursor-pointer"
                    onClick={() => setIsEditingName(true)}
                  >
                    {tempName}
                    <Edit2 className="absolute top-1/2 -right-4 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                  </div>
                )}
              </div>
              <motion.button
                onClick={cycleStatus}
                className={`mr-4 mt-5 px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${statusColors[tempStatus]}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tempStatus}
              </motion.button>
            </DialogTitle>
          </DialogHeader>
          <div className='flex items-start justify-between gap-5'>
            <div className="space-y-4 w-full">
              <ScrollArea className="h-72 rounded-md pr-4">
                <label className="text-sm font-medium text-neutral-300">Description</label>
                {isEditingDescription ? (
                  <Textarea
                    maxLength={1000}
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    onBlur={handleDescriptionEdit}
                    className="border-neutral-700 text-white placeholder-neutral-400 min-h-64 max-w-full"
                  />
                ) : (
                  <div
                    className="relative group cursor-pointer bg-neutral-900 border border-neutral-700 rounded-md min-h-64 p-2 w-full break-words whitespace-pre-wrap"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    {tempDescription}
                    <Edit2 className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                  </div>
                )}
              </ScrollArea>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-neutral-300">Start Date</label>
                  {isEditingStartDate ? (
                    <Input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      onBlur={handleStartDateEdit}
                      className="bg-neutral-900  border-neutral-700 text-white placeholder-neutral-400"
                    />
                  ) : (
                    <div
                      className="relative group text-sm cursor-pointer bg-neutral-900 border border-neutral-700 rounded-md p-2 flex items-center"
                      onClick={() => setIsEditingStartDate(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                      {tempStartDate ? (
                        <span>{format(new Date(tempStartDate), "PPP")}</span>
                      ) : (
                        <span className="text-neutral-400">No start date</span>
                      )}
                      <Edit2 className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                    </div>
                  )}
                </div>
                <div className='pr-4'>
                  <label className="text-sm font-medium text-neutral-300">End Date</label>
                  {isEditingEndDate ? (
                    <Input
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      onBlur={handleEndDateEdit}
                      className="bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400"
                    />
                  ) : (
                    <div
                      className="relative group cursor-pointer text-sm bg-neutral-900 border border-neutral-700 rounded-md p-2 flex items-center"
                      onClick={() => setIsEditingEndDate(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                      {tempEndDate ? (
                        <span>{format(new Date(tempEndDate), "PPP")}</span>
                      ) : (
                        <span className="text-neutral-400">No end date</span>
                      )}
                      <Edit2 className="absolute top-1/2 right-2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div>
                <label className="text-sm font-medium text-neutral-300">Assigned To</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {tempUserId
                        ? users.find((user) => user.id === tempUserId)?.name
                        : "Select user"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search user..." />
                      <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem
                              onSelect={() => handleUserChange(null)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  tempUserId === null ? "opacity-100" : "opacity-0"
                                )}
                              />
                              Unassigned
                            </CommandItem>
                          {users.map((user) => (
                            <CommandItem
                              key={user.id}
                              onSelect={() => handleUserChange(user.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  tempUserId === user.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <Avatar className="mr-2 h-6 w-6">
                                <AvatarImage src={user.img_profile} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              {user.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className='mt-20 flex justify-end'>
                <Button variant='secondary' className="text-xs bg-red-600 text-white :hover-bg-red-500" onClick={() => handleDeleteTask(task.id)}>
                  Delete Task
                </Button>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  {tempStartDate && tempEndDate && (
                    <>
                      <p className="text-xs">
                        {`From ${format(new Date(tempStartDate), "P")}`}
                      </p>
                      <p className="text-xs">
                        {`To ${format(new Date(tempEndDate), "P")}`}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <AddDependency
            listId={list.id}
            taskId={task.id}
            taskName={tempName}
            setTaskName={setTempName}
            handleCreateDependency={handleCreateDependency} 
            startDate={tempStartDate}
            setStartDate={setTempStartDate}
            endDate={tempEndDate}
            setEndDate={setTempEndDate}
            status={tempStatus}
            setStatus={setTempStatus}
            list={list}
            dependencies={dependencies}
            setDependencies={setDependencies}
            tasks={tasks}
            handleTaskClick={handleTaskClick}
            selectedTask={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        </motion.div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}