import { useState, useEffect } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';
import { X, Check, UserCog, ArrowBigUpDash, UserMinus, ArrowBigDownDash, LogOut, CopyCheck, Plus, Trash } from 'lucide-react';
import { Input } from "../ui/input2";
import { InviteMembers, Selected } from '../form/invitemembers';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from '../ui/scroll-area';
import { motion } from 'framer-motion';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import SearchModal from "@/components/ui/team-search-modal";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const Teams = () => {
    const { props } = usePage();
    const initialTeams = props.teams || [];
    const initialUsers = props.users || [];
    const [isHovered, setIsHovered] = useState(false);
    const [teams, setTeams] = useState(initialTeams);
    const [users, setUsers] = useState(initialUsers);
    const [newTeamName, setNewTeamName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState(new Set());

    const [editingTeam, setEditingTeam] = useState(null);
    const [updatedTeamName, setUpdatedTeamName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDialog2Open, setIsDialog2Open] = useState(false);
    const [deleteTeamId, setDeleteTeamId] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [isConfirming2, setIsConfirming2] = useState(false);
    const [copied, setCopied] = useState(false);

    // Fetch team users function
    const fetchTeamUsers = async (teamId) => {
        try {
            const response = await axios.get(`/teams/${teamId}/users`);
            return response.data;
        } catch (error) {
            console.error('Error fetching team users:', error);
            return [];
        }
    };

    // Fetch all users function
    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        const loadTeamUsers = async () => {
            const updatedTeams = await Promise.all(
                teams.map(async (team) => {
                    const users = await fetchTeamUsers(team.id);
                    return { ...team, users };
                })
            );
            setTeams(updatedTeams);
        };

        loadTeamUsers();
        fetchUsers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const membersArray = Array.from(selectedMembers);
            const response = await axios.post('/teams', {
                name: newTeamName,
                members: membersArray
            });

            const teamUsers = await fetchTeamUsers(response.data.id);
            setTeams(prevTeams => [...prevTeams, { ...response.data, users: teamUsers }]);
            setNewTeamName('');
            setSelectedMembers(new Set());
        } catch (error) {
            console.error('Error creating team:', error.response?.data);
        }
    };

    // Edit team dialog trigger function
    const openEditDialog = (team) => {
        setEditingTeam(team);
        setUpdatedTeamName(team.name);
        setIsDialogOpen(true);
    };

    // Update team function
    const handleUpdateTeam = async () => {
        try {
            const response = await axios.put(`/teams/${editingTeam.id}`, { name: updatedTeamName });
            const teamUsers = await fetchTeamUsers(editingTeam.id);
            setTeams(teams.map(team => (team.id === editingTeam.id ? { ...response.data, users: teamUsers } : team)));
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };

    // Fonction pour actualiser les utilisateurs d'une équipe après une action
    const refreshTeamUsers = async (teamId) => {
        try {
            const teamUsers = await fetchTeamUsers(teamId); // Récupérer les utilisateurs mis à jour
            setTeams(teams.map(team => team.id === teamId ? { ...team, users: teamUsers } : team));
        } catch (error) {
            console.error('Error refreshing team users:', error);
        }
    };

    // Fonction pour promouvoir un membre en admin
    const handlePromote = async (userId) => {
        try {
            await axios.put(`/teams/${editingTeam.id}/promote/${userId}`);
            await refreshTeamUsers(editingTeam.id); // Actualiser les utilisateurs de l'équipe
        } catch (error) {
            console.error('Error promoting member:', error);
        }
    };

    // Fonction pour rétrograder un admin en membre
    const handleDemote = async (userId) => {
        try {
            await axios.put(`/teams/${editingTeam.id}/demote/${userId}`);
            await refreshTeamUsers(editingTeam.id); // Actualiser les utilisateurs de l'équipe
        } catch (error) {
            console.error('Error demoting admin:', error);
        }
    };

    // Fonction pour retirer un membre de l'équipe
    const handleRemove = async (userId) => {
        try {
            const response = await axios.delete(`/teams/${editingTeam.id}/remove/${userId}`);

            // Vérifier la réponse pour voir si l'équipe a été supprimée
            if (response.data.message === 'Team deleted as no admins were left') {
                // Si l'équipe est supprimée, gérer cette situation (par exemple, rediriger ou mettre à jour l'état)
                console.log('Team was deleted');
                // Redirection ou rafraîchissement général
                // window.location.href = '/teams'; // Exemple de redirection vers une page de liste d'équipes
            } else {
                // Actualiser les utilisateurs de l'équipe si elle n'a pas été supprimée
                await refreshTeamUsers(editingTeam.id);
            }
        } catch (error) {
            console.error('Error removing member:', error);
        }
    };



    // Delete team with confirmation function
    const handleDeleteClick = async (teamId) => {
        if (isConfirming && deleteTeamId === teamId) {
            try {
                await axios.delete(`/teams/${teamId}`);
                setTeams(teams.filter(team => team.id !== teamId));
                setDeleteTeamId(null);
                setIsConfirming(false);
            } catch (error) {
                console.error('Error deleting team:', error);
            }
        } else {
            setDeleteTeamId(teamId);
            setIsConfirming(true);
        }
    };// Delete team with confirmation function
    const handleDeleteClick2 = async (teamId) => {
        if (isConfirming2 && deleteTeamId === teamId) {
            try {
                await axios.delete(`/teams/${teamId}`);
                setTeams(teams.filter(team => team.id !== teamId));
                setDeleteTeamId(null);
                setIsConfirming(false);
            } catch (error) {
                console.error('Error deleting team:', error);
            }
        } else {
            setDeleteTeamId(teamId);
            setIsConfirming2(true);
        }
    };


    // Render members with popover
    const renderTeamMembers = (members) => {
        const maxVisibleMembers = 3; // Nombre max de membres visibles
        const filteredMembers = members.filter(user => user.pivot.role === 'member');
        const extraMembersCount = filteredMembers.length - maxVisibleMembers;
        const visibleMembers = filteredMembers.slice(0, maxVisibleMembers);

        return (
            <div className="flex items-center space-x-1">
                <TooltipProvider delayDuration={100}>
                    {visibleMembers.map((user) => (
                        <Tooltip key={user.id}>
                            <TooltipTrigger asChild>
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={`/profile/${user.id}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <img
                                        src={user.profileImage || "/placeholder.svg?height=32&width=32"}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full cursor-pointer bg-slate-100"
                                    />
                                </motion.a>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                                {user.name}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
                {extraMembersCount > 0 && (
                    <span className="text-sm text-gray-500">+{extraMembersCount} more</span>
                )}
            </div>
        );
    };

    const handleLeave = async (teamId) => {
        try {
            const response = await axios.post(`/teams/${teamId}/leave`); // Appelle l'API pour quitter l'équipe

            // Mettre à jour l'état des équipes après avoir quitté
            setTeams(teams.filter(team => team.id !== teamId)); // Retire l'équipe si l'utilisateur était le dernier membre
        } catch (error) {
            console.error('Error leaving team:', error);
        }
    };

    // Render admins based on role
    const renderTeamAdmins = (members) => {
        const maxVisibleAdmins = 3; // Nombre max d'admins visibles
        const admins = members.filter(user => user.pivot.role === 'admin');
        const extraAdminsCount = admins.length - maxVisibleAdmins;
        const visibleAdmins = admins.slice(0, maxVisibleAdmins);

        if (admins.length === 0) {
            return <span>No admins</span>;
        }

        return (
            <div className="flex items-center space-x-1">
                <TooltipProvider delayDuration={100}>
                    {visibleAdmins.map((user) => (
                        <Tooltip key={user.id}>
                            <TooltipTrigger asChild>
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={`/profile/${user.id}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                                    <img
                                        src={user.profileImage || "/placeholder.svg?height=32&width=32"}
                                        alt={user.name}
                                        className="w-8 h-8 rounded-full cursor-pointer bg-slate-100"
                                    />
                                </motion.a>
                            </TooltipTrigger>
                            <TooltipContent side="top" align="center">
                                {user.name}
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
                {extraAdminsCount > 0 && (
                    <span className="text-sm text-gray-500">+{extraAdminsCount} more</span>
                )}
            </div>
        );
    }

    return (
        <div className="bg-dark text-white">
            <div className='flex justify-end gap-5'>
            <SearchModal
                placeholder="Enter team code to join"
                buttonLabel="Join a team"
            />
            <Dialog open={isDialog2Open} onOpenChange={setIsDialog2Open}>
                <DialogTrigger asChild>
                    <button className="bg-neutral-900 px-3 rounded-md"><Plus className='h-4 w-4' /></button>
                </DialogTrigger>
                <DialogContent>
                    {/* Form to create a new team */}
                    <DialogHeader>
                        <DialogTitle>Create a new team</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={(e) => {
                        handleSubmit(e);
                        setIsDialog2Open(false);
                    }} className="flex flex-col gap-4">

                        <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            placeholder="Team Name"
                            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium  h-10 px-4 py-2"
                            required
                        />

                        <div className="flex-1">
                            <InviteMembers selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} members={users} />
                        </div>
                        <Selected members={users} selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} />

                        <DialogFooter>
                            <Button
                                type="submit"
                                variant="secondary"
                            >
                                Create Team
                            </Button>
                        </DialogFooter>
                    </form></DialogContent>

            </Dialog>
            </div>
            <div className="overflow-auto">
                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b p-3">Team Name</th>
                            <th className="border-b p-3">Admins</th>
                            <th className="border-b p-3">Members</th>
                            <th className="border-b p-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team) => {
                            // Récupérer l'utilisateur connecté depuis les props de la page
                            const { auth } = usePage().props;
                            const isTeamAdmin = team.users.some(user => user.id === auth.user.id && user.pivot.role === 'admin'); // Vérifier si l'utilisateur connecté est admin de l'équipe

                            return (
                                <Dialog key={team.id} open={isDialogOpen && editingTeam?.id === team.id} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <motion.tr 
                                        whileHover={
                                            { backgroundColor: '#26262633' }
                                        } 
                                        transition={{ duration: 0.1 }} 
                                        className="cursor-pointer" onClick={() => openEditDialog(team)}>
                                            <td className="border-b p-3">{team.name}</td>
                                            <td className="border-b p-3">
                                                {team.users && renderTeamAdmins(team.users)} {/* Display admins */}
                                            </td>
                                            <td className="border-b p-3">
                                                {team.users && renderTeamMembers(team.users)}
                                            </td>
                                            <td className="border-b p-3 text-right">
                                                {/* Bouton de suppression rapide si l'utilisateur est admin */}
                                                {isTeamAdmin && (
                                                    <Popover open={isConfirming2 && deleteTeamId === team.id} onOpenChange={setIsConfirming2}>
                                                        <PopoverTrigger asChild>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="bg-background px-3 py-3 rounded-md"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteClick2(team.id); // Passer le bon ID de l'équipe
                                                                }}
                                                            >
                                                                {isConfirming2 && deleteTeamId === team.id ? <Check className="w-3 h-3" /> : <Trash className="w-3 h-3" />}
                                                            </motion.button>
                                                        </PopoverTrigger>
                                                        <PopoverContent>
                                                            <div className="text-center text-sm">
                                                                <p>Really ?</p>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                )}
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="bg-background ml-2 px-3 py-3 rounded-md"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLeave(team.id); // Passer le bon ID de l'utilisateur
                                                    }}
                                                >
                                                    <LogOut className="w-3 h-3" />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    </DialogTrigger>

                                    {/* Dialog Content */}
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{team.name}</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex justify-between min-h-5">
                                            <div className="text-sm w-3/5">
                                                <Input
                                                    type="text"
                                                    onChange={(e) => setUpdatedTeamName(e.target.value)}
                                                    value={updatedTeamName}
                                                    className="border rounded p-2 w-full text-black"
                                                    placeholder="Change the name of your team (For example The Avengers)"
                                                    disabled={!isTeamAdmin} // Input non modifiable si l'utilisateur n'est pas admin
                                                />
                                                <ScrollArea className="h-52">
                                                    <p className="mb-2 mt-2">Admins :</p>
                                                    <motion.div
                                                        layout
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                        className="flex flex-wrap gap-2"
                                                    >
                                                        {team.users
                                                            .filter((user) => user.pivot.role === "admin")
                                                            .map((user) => (
                                                                <motion.div
                                                                    key={user.id}
                                                                    layout
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: 20 }}
                                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                                >
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="xxs"
                                                                                className="flex items-center space-x-2"
                                                                            >
                                                                                <img
                                                                                    src={user.img_profil}
                                                                                    alt={user.name}
                                                                                    className="w-6 h-6 rounded-full"
                                                                                />
                                                                                <span>{user.name}</span>
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="p-1 text-xs">
                                                                            <div className="flex flex-col space-y-2">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="justify-start text-xs"
                                                                                >
                                                                                    <a
                                                                                        href={`/profile/${user.id}`}
                                                                                        target="_blank"
                                                                                        className="flex"
                                                                                        rel="noopener noreferrer"
                                                                                    >
                                                                                        <UserCog className="mr-2 h-4 w-4" />
                                                                                        View Profile
                                                                                    </a>
                                                                                </Button>

                                                                                {/* Additional options for team admin */}
                                                                                {isTeamAdmin && user.id !== auth.user.id && (
                                                                                    <>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            className="justify-start text-xs"
                                                                                            onClick={() => handleDemote(user.id)}
                                                                                        >
                                                                                            <ArrowBigDownDash className="mr-2 h-4 w-4" />
                                                                                            Demote to member
                                                                                        </Button>
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            className="justify-start text-red-500 hover:text-red-500 text-xs"
                                                                                            onClick={() => handleRemove(user.id)}
                                                                                        >
                                                                                            <UserMinus className="mr-2 h-4 w-4" />
                                                                                            Remove from Team
                                                                                        </Button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </motion.div>
                                                            ))}
                                                    </motion.div>

                                                    <p className="mt-3 mb-2">Members :</p>
                                                    <motion.div
                                                        layout
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                        className="flex flex-wrap gap-2"
                                                    >
                                                        {team.users
                                                            .filter((user) => user.pivot.role === "member")
                                                            .map((user) => (
                                                                <motion.div
                                                                    key={user.id}
                                                                    layout
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: 20 }}
                                                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                                >
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="xxs"
                                                                                className="flex items-center space-x-2"
                                                                            >
                                                                                <img
                                                                                    src={user.img_profil}
                                                                                    alt={user.name}
                                                                                    className="w-6 h-6 rounded-full"
                                                                                />
                                                                                <span>{user.name}</span>
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="p-1 text-sm">
                                                                            <div className="flex flex-col space-y-2">
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="justify-start text-xs"
                                                                                >
                                                                                    <a
                                                                                        href={`/profile/${user.id}`}
                                                                                        target="_blank"
                                                                                        className="flex"
                                                                                        rel="noopener noreferrer"
                                                                                    >
                                                                                        <UserCog className="mr-2 h-4 w-4" />
                                                                                        View Profile
                                                                                    </a>
                                                                                </Button>

                                                                                {isTeamAdmin && (
                                                                                    <>
                                                                                        {/* Promote Button */}
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            className="justify-start text-xs"
                                                                                            onClick={() => handlePromote(user.id)}
                                                                                        >
                                                                                            <ArrowBigUpDash className="mr-2 h-4 w-4" />
                                                                                            Promote to Admin
                                                                                        </Button>

                                                                                        {/* Remove Button */}
                                                                                        <Button
                                                                                            variant="ghost"
                                                                                            size="sm"
                                                                                            className="justify-start text-red-500 hover:text-red-500 text-xs"
                                                                                            onClick={() => handleRemove(user.id)}
                                                                                        >
                                                                                            <UserMinus className="mr-2 h-4 w-4" />
                                                                                            Remove from Team
                                                                                        </Button>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </motion.div>
                                                            ))}
                                                    </motion.div>
                                                </ScrollArea>
                                            </div>
                                            <motion.div
                                                className="border-l-2 border-zinc-900 text-gray-500 text-xs pl-3 w-1/3 flex flex-col gap-5"
                                                initial={{ opacity: 0 }}          // Animation initiale
                                                animate={{ opacity: 1 }}           // Animation d'entrée
                                                transition={{ duration: 0.5 }}     // Durée de la transition
                                            >
                                                <p>Created on {team.created_at}</p>
                                                <p>Working on 0 projects</p>

                                                <motion.div
                                                    initial={{ scale: 1 }}                   // État initial avant le clic
                                                    whileTap={{ scale: 0.95 }}               // Réduction de l'échelle pendant le clic
                                                    transition={{ type: "spring", stiffness: 300 }}  // Effet de ressort
                                                >
                                                    <Button onClick={() =>
                                                        navigator.clipboard.writeText(team.team_code).then(() => {
                                                            setCopied(true);
                                                            setTimeout(() => setCopied(false), 2000);
                                                        })
                                                    } className="w-full">
                                                        {copied ? (
                                                            <motion.span
                                                                initial={{ opacity: 0, y: -10 }}
                                                                exit={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="w-full flex items-center justify-center"  // Taille du bouton
                                                            >
                                                                <CopyCheck className='h-5' /> {/* Ton icône */}
                                                            </motion.span>
                                                        ) : (
                                                            <motion.span
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ duration: 0.3 }}
                                                                className="flex items-center justify-center"
                                                            >
                                                                Copy team code
                                                            </motion.span>
                                                        )}
                                                    </Button>
                                                </motion.div>
                                            </motion.div>
                                        </div>

                                        <DialogFooter>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleUpdateTeam}
                                                className="inline-flex min-w-20 px-4 py-2 mt-2 ml-2 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 transition-colors"
                                                disabled={!isTeamAdmin} // Bouton non cliquable si l'utilisateur n'est pas admin
                                            >
                                                Save
                                            </motion.button>

                                            <Popover open={isConfirming && deleteTeamId === team.id} onOpenChange={setIsConfirming}>
                                                <PopoverTrigger asChild>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        className={`inline-flex min-w-20 bg-black px-4 py-2 mt-2 ml-2 items-center justify-center rounded-md border border-slate-800 text-slate-400 ${isTeamAdmin ? '' : 'hidden'}`} // Bouton de suppression uniquement si l'utilisateur est admin
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(team.id); // Passer le bon ID de l'équipe
                                                        }}
                                                    >
                                                        {isConfirming && deleteTeamId === team.id ? 'Yes' : 'Delete'}
                                                    </motion.button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div className="text-center">
                                                        <p>You really want to delete this team? :(</p>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </DialogFooter>
                                    </DialogContent>

                                </Dialog>
                            );
                        })}
                    </tbody>

                </table>
            </div>

        </div>
    );
};

export default Teams;
