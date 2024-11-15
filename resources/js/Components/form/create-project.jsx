import React, { useState } from 'react';
import { Input } from "../ui/input2";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


const CreateProjectForm = ({ adminTeams, onProjectCreated }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('');

    // Soumission du formulaire en appelant onProjectCreated avec les données du projet
    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectData = {
            name: projectName,
            description: projectDescription,
            team_id: selectedTeam,
        };
        try {
            await onProjectCreated(projectData);
            setProjectName(''); // Réinitialiser le formulaire après la création
            setProjectDescription('');
            setSelectedTeam('');
        } catch (error) {
            console.error('Erreur lors de la création du projet :', error);
        }
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <button className="bg-neutral-900 px-3 py-3 rounded-md"><Plus className='h-4 w-4' /></button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                        handleSubmit(e);
                        setIsDialogOpen(false);
                    }} 
                    className="flex flex-col space-y-4">
                        <Input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Project Name"
                            required
                        />
                        <Input
                            type="text"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            placeholder="Project Description"
                            required
                        />
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="min-w-52"
                                >
                                    {selectedTeam ? adminTeams.find(team => team.id === selectedTeam)?.name : "Select a Team"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent
                                className="p-0"
                                onMouseLeave={() => setOpen(false)}
                            >
                                <Command>
                                    <CommandInput
                                        placeholder="Find teams"
                                        className="border-0 focus-within:ring-0 min-w-36 px-1"
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                        }}
                                    />
                                    <CommandList>
                                        <CommandEmpty>No teams found.</CommandEmpty>
                                        <CommandGroup>
                                            {adminTeams.filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase())).map(team => (
                                                <CommandItem
                                                    key={team.id}
                                                    onSelect={() => {
                                                        setSelectedTeam(team.id);
                                                        setOpen(false); // Close the popover after selection
                                                    }}
                                                >
                                                    <Check
                                                        className={
                                                            "mr-2 h-4 w-4" + (team.id === selectedTeam ? " opacity-100" : " opacity-0")
                                                        }
                                                    />
                                                    {team.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <DialogFooter>
                            <Button type="submit" variant="secondary" className="text-white px-4 py-2 rounded">
                                Create Project
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateProjectForm;
