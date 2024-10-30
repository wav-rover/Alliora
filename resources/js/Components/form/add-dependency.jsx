import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, CalendarIcon } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/Components/ui/Accordion';
import { Input } from '@/Components/ui/Input';
import { Button } from '@/Components/ui/Button';
import { Calendar } from '@/Components/ui/calendar';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverTrigger, PopoverContent } from '@/Components/ui/Popover';

const statusColors = {
    pending: 'bg-red-600 shadow-[0_0_10px_rgba(250,0,0,0.6)]',
    'in progress': 'bg-cyan-500 drop-shadow-[0_0_10px_rgba(0,200,200,0.4)]',
    finished: 'bg-emerald-600 drop-shadow-[0_0_10px_rgba(0,200,100,0.6)]'
};

export default function AddDependency({
    tasks,
    listId,
    taskId,
    handleCreateDependency,
    list,
    dependencies,
    setDependencies
}) {
    const [newDependency, setNewDependency] = useState({
        name: '',
        startDate: '',
        endDate: '',
        status: 'pending'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const dependencyToAdd = {
            name: newDependency.name,
            description: '',
            project_id: list.project_id,
            list_id: listId,
            position: list.tasks?.length || 1,
            status: newDependency.status,
            start_date: newDependency.startDate,
            end_date: newDependency.endDate,
            user_id: null,
            dependencies: taskId
        };
        handleCreateDependency(dependencyToAdd);
        console.log('Dependency added:', dependencyToAdd);
        setNewDependency({
            name: '',
            startDate: '',
            endDate: '',
            status: 'pending'
        });
    };

    const filteredTasks = tasks.filter(t => t.dependencies === taskId);



    const updateDependency = (index, field, value) => {
        const updatedDependencies = dependencies.map((dep, i) =>
            i === index ? { ...dep, [field]: value } : dep
        );
        setDependencies(updatedDependencies);
    };

    const saveDependency = () => {
        setEditingDependency(null);
    };

    const editDependency = (index) => {
        setEditingDependency(index);
    };

    const updateDependencyStatus = (index) => {
        const updatedDependencies = dependencies.map((dep, i) =>
            i === index ? { ...dep, status: dep.status === 'pending' ? 'completed' : 'pending' } : dep
        );
        setDependencies(updatedDependencies);
    };


    return (
        <Accordion type="single" collapsible className="w-full" defaultValue="dependencies">
            <AccordionItem value="dependencies">
                <AccordionTrigger>Dependencies ({filteredTasks.length})</AccordionTrigger>
                <AccordionContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    placeholder="Dependency name"
                                    value={newDependency.name}
                                    required
                                    onChange={(e) => setNewDependency({ ...newDependency, name: e.target.value })}
                                    className="bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400 focus:ring-neutral-500 focus:border-neutral-500 flex-grow"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-[120px] justify-start text-left font-normal ${!newDependency.startDate && "text-muted-foreground"}`}
                                        >
                                            {newDependency.startDate ? format(new Date(newDependency.startDate), "PP") : <span>Start</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={newDependency.startDate ? new Date(newDependency.startDate) : undefined}
                                            onSelect={(date) => setNewDependency({ ...newDependency, startDate: date ? date.toISOString() : '' })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-[120px] justify-start text-left font-normal ${!newDependency.endDate && "text-muted-foreground"}`}
                                        >
                                            {newDependency.endDate ? format(new Date(newDependency.endDate), "PP") : <span>End</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={newDependency.endDate ? new Date(newDependency.endDate) : undefined}
                                            onSelect={(date) => setNewDependency({ ...newDependency, endDate: date ? date.toISOString() : '' })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <select
                                    value={newDependency.status}
                                    onChange={(e) => setNewDependency({ ...newDependency, status: e.target.value })}
                                    className="rounded-md bg-neutral-900 text-sm border-neutral-700 text-white placeholder-neutral-400 focus:ring-neutral-500 focus:border-neutral-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in progress">In Progress</option>
                                    <option value="finished">Finished</option>
                                </select>
                                <Button
                                    type="submit"
                                    className="bg-neutral-800 hover:bg-neutral-700"
                                >
                                    Add
                                </Button>
                            </div>

                        </div>
                    </form>
                    <ul className='space-y-2 mt-3'>
                        {filteredTasks.map(filteredTask => (
                            <li key={filteredTask.id} className="p-2 bg-neutral-800 rounded-md flex items-center justify-between">
                                <div className='flex items-center gap-3'>
                                <div className={`w-2 h-2 rounded-full animate-pulse ${statusColors[filteredTask.status]}`}></div>
                                {filteredTask.name}
                                </div>

                                <div className='flex items-center gap-3'>
                                <motion.div
                                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${statusColors[filteredTask.status]}`}
                                >
                                    {filteredTask.status}
                                </motion.div>
                                
                                <div
                                    className="relative group text-sm bg-neutral-900 border border-neutral-700 rounded-md p-2 flex items-center"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                                    {filteredTask.start_date ? (
                                        <span>{format(new Date(filteredTask.start_date), "P")}</span>
                                    ) : (
                                        <span className="text-neutral-400 w-4"></span>
                                    )}
                                </div>

                                <div
                                    className="relative group text-sm bg-neutral-900 border border-neutral-700 rounded-md p-2 flex items-center"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                                    {filteredTask.end_date ? (
                                        <span>{format(new Date(filteredTask.end_date), "P")}</span>
                                    ) : (
                                        <span className="text-neutral-400 w-4"></span>
                                    )}
                                </div>
                                
                                </div>


                            </li>
                        ))}
                    </ul>

                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}