"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { X } from "lucide-react";
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import InviteMembers from "./invitemembers";
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

export function AddTeam({ members = [], selectedMembers, setSelectedMembers }) {

    return (
        <InviteMembers members={members} selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} />
    );
}

export default AddTeam;
