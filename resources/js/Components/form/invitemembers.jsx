"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { X } from "lucide-react";
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function InviteMembers({ members = [], selectedMembers, setSelectedMembers }) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Si `members` est vide ou indéfini, cette vérification évite les erreurs
    const filteredMembers = (members || []).filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleMemberSelection = (memberId) => {
        setSelectedMembers(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(memberId)) {
                newSelection.delete(memberId);
            } else {
                newSelection.add(memberId);
            }
            return newSelection;
        });
    };

    return (
        <div className="">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="min-w-52"
                    >
                        {selectedMembers.size > 0
                            ? `${selectedMembers.size} user(s) selected`
                            : "Invite your colleagues"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="p-0"
                    onMouseLeave={() => setOpen(false)}  // Fermer lorsque la souris quitte le menu
                >
                    <Command>
                        <CommandInput
                            placeholder="Find members"
                            className="border-0 focus-within:ring-0 min-w-36 px-1"
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        />
                        <CommandList>
                            <CommandEmpty>No one found.</CommandEmpty>
                            <CommandGroup>
                                {filteredMembers.map(member => (
                                    <CommandItem
                                        key={member.id}
                                        onSelect={() => {
                                            toggleMemberSelection(member.id);
                                            // Ne pas fermer le popover ici
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selectedMembers.has(member.id) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {member.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export function Selected({ members, selectedMembers, setSelectedMembers }) {
    const toggleMemberSelection = (memberId) => {
        setSelectedMembers(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(memberId)) {
                newSelection.delete(memberId);
            } else {
                newSelection.add(memberId);
            }
            return newSelection;
        });
    };

    return (
        <div className="mt-1 flex flex-wrap">
            <AnimatePresence>
                {Array.from(selectedMembers).map(memberId => {
                    const member = members.find(m => m.id === memberId);
                    return (
                        <motion.div
                            key={memberId}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0.8, scale: 0.8 }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 17,
                                duration: 0.3,
                            }}
                            className="text-sm inline-flex min-w-fit px-4 py-2 mt-2 ml-2 items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 transition-colors"
                            title="Désélectionner"
                        >
                            {member?.name}
                            <motion.span
                                className="ml-1 w-4 h-4 flex justify-center items-center text-black-400 cursor-pointer"
                                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => toggleMemberSelection(memberId)}
                            >
                                <X />
                            </motion.span>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

export default InviteMembers;
