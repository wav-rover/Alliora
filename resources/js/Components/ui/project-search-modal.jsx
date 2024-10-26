"use client";

import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { SparklesCore } from "../ui/sparkles";
import { useMemo } from "react";

export function ProjectSearch({ searchTerm, setSearchTerm }) {
  const placeholders = [
    "Find your projects",
    "Where is this damn remote?",
    "Web development projects",
    "Art projects",
    "Any type of project",
    "Alliora is the best project management app",
    "Don't search how to assemble your own PC here",
    "Lost? Me too don't worry",
    "Projects: A journey into the unknown",
    "This is not a black hole, it's your workspace!",
    "Just another day in project paradise",
    "Warning: Genius ideas ahead!",
    "Welcome to the project jungle!",
    "Your creativity starts here!",
    "Where ideas go to get organized",
    "Searching for inspiration... Please wait!",
    "Enter at your own risk: Projects inside!",
    "Let the chaos unfold!",
    "Project land: Populated by ideas!",
    "Loading... please do not feed the projects",
    "This placeholder is on a coffee break ☕",
    "Finding your next big idea...",
    "Hold tight! Projects are being summoned!",
    "Your next adventure starts here!",
    "Project management: The ultimate quest!",
    "Every project needs a hero. Is it you?",
    "Warning: May contain awesome projects!",
];


  const sparkles = useMemo(() => (
    <SparklesCore
      background="transparent"
      minSize={0.4}
      maxSize={1}
      particleDensity={500}
      className="w-5/6 mx-auto h-full"
      particleColor="#FFFFFF"
    />
  ), []);

  const handleChange = (e) => {
    setSearchTerm(e.target.value); // Mettre à jour l'état des termes de recherche
  };

  const onSubmit = (e) => {
    setSearchTerm('');
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <div className="h-[10rem] flex flex-col justify-center  items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        value={searchTerm} // Liaison avec l'état des termes de recherche
        onSubmit={onSubmit}
      />
      <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-[40rem] h-4 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          
          {sparkles}
        </div>
      </div>
    </div>
  );
}

export default ProjectSearch;
