"use client"

import * as React from "react";
import InviteMembers from "./invitemembers";

export function AddTeam({ members = [], selectedMembers, setSelectedMembers }) {

    return (
        <InviteMembers members={members} selectedMembers={selectedMembers} setSelectedMembers={setSelectedMembers} />
    );
}

export default AddTeam;
