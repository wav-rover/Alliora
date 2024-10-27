import React, { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Plus } from "lucide-react";

const CreateTask = ({ listId, taskName, setTaskName, taskDescription, setTaskDescription, handleCreateTask }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSubmit = (e) => {
        handleCreateTask(e, listId);
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter une tâche</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Nom de la tâche"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Description de la tâche"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        required
                    />
                    <Button type="submit">Ajouter Tâche</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateTask;