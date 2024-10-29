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
    pending: 'bg-red-600 drop-shadow-[0_0_10px_rgba(250,0,0,0.2)]',
    'in progress': 'bg-cyan-500 drop-shadow-[0_0_10px_rgba(0,200,200,0.4)]',
    finished: 'bg-emerald-600 drop-shadow-[0_0_10px_rgba(0,200,100,0.6)]'
};

export default function AddDependency({
    listId,
    taskId,
    taskName,
    setTaskName,
    handleCreateTask,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    status,
    setStatus,
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
            dependency: taskId // Link the dependency to the current task
        };
        handleCreateTask(e, listId, dependencyToAdd); // Passez les données de la nouvelle tâche
        console.log('Dependency added:', dependencyToAdd);
        setNewDependency({
            name: '',
            startDate: '',
            endDate: '',
            status: 'pending'
        });
    };

    return (
        <Accordion type="single" collapsible className="w-full" defaultValue="dependencies">
            <AccordionItem value="dependencies">
                <AccordionTrigger>Dependencies</AccordionTrigger>
                <AccordionContent>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    placeholder="Dependency name"
                                    value={newDependency.name}
                                    onChange={(e) => setNewDependency({ ...newDependency, name: e.target.value })}
                                    className="bg-neutral-900 border-neutral-700 text-white placeholder-neutral-400 focus:ring-neutral-500 focus:border-neutral-500 flex-grow"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-[120px] justify-start text-left font-normal ${!newDependency.startDate && "text-muted-foreground"}`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newDependency.startDate ? format(new Date(newDependency.startDate), "PPP") : <span>Start</span>}
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
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {newDependency.endDate ? format(new Date(newDependency.endDate), "PPP") : <span>End</span>}
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
                                    className="bg-neutral-900 border-neutral-700 text-white focus:ring-neutral-500 focus:border-neutral-500 rounded-md"
                                >
                                    {Object.keys(statusColors).map((key) => (
                                        <option key={key} value={key}>{key}</option>
                                    ))}
                                </select>
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="bg-neutral-800 hover:bg-neutral-700"
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    </form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}