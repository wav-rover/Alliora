import React, { useEffect, useState } from 'react';
import Echo from 'laravel-echo';

export const UsersOnProject = ({ initialUsers, projectId }) => {
    const [members, setMembers] = useState(initialUsers); // Initialize with initial users

    // Ensure initialUsers is an array
    const usersList = initialUsers || [];

    useEffect(() => {
        const presenceChannel = window.Echo.join('presence-project.' + projectId)
            .here((members) => {
                console.log('Membres présents:', members);
                setMembers(members); // Set the initial list of members
            })
            .joining((member) => {
                console.log('Membre a rejoint:', member);
                setMembers(prevMembers => [...prevMembers, member]); // Add new member
            })
            .leaving((member) => {
                console.log('Membre a quitté:', member);
                setMembers(prevMembers => prevMembers.filter(m => m.id !== member.id)); // Remove member
            })
            .error(function (error) {
                console.error('Erreur lors de l\'écoute du canal de présence :', error);
            });

        // Cleanup on component unmount
        return () => {
            presenceChannel.stopListening();
        };
    }, [projectId]); // Run effect when projectId changes


    return (
        <div>
            <h2>Utilisateurs Connectés :</h2>
            <ul>
                {usersList.map(user => (
                    <li key={user.id}>{user.info.name}</li>
                ))}
            </ul>
        </div>
    );
};
