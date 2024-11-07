import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { ChartLine, CalendarRange, SquareStack, ListPlus, MessageSquareDashed } from "lucide-react";

export function FloatingDockWithLinks({ onListModified }) {
  const randomNames = [
    "Bright Beginnings",
    "Barely Started tasks",
    "Halfway... Sort Of",
    "The impossible tasks",
    "Incredible Ideas",
    "Stuff to Do",
    "The Adventure List",
    "Ideas for Inspiration",
  ];
  const addRandomList = () => {
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];

    // Appelle `onListModified` pour créer la liste avec le nom sélectionné
    onListModified('create', { title: randomName, position: Date.now() });
  };

  const links = [
    {
      title: "Lists and tasks",
      icon: (
        <SquareStack className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Statistics",
      icon: (
        <ChartLine className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Table",
      icon: (
        <CalendarRange className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Powered by Alliora",
      icon: (
        " "
      ),
      href: "#",
    },
    {
      title: "Open Team Chat",
      icon: (
        <MessageSquareDashed className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Aceternity UI",
      icon: (
        <img
          src="https://assets.aceternity.com/logo-dark.png"
          width={20}
          height={20}
          alt="Aceternity Logo" />
      ),
      href: "#",
    },
    {
      title: "Add a list",
      icon: (
        <ListPlus
          className="h-full w-full text-neutral-500 dark:text-neutral-300 cursor-pointer"
          onClick={addRandomList}
        />
      ),
      href: "#",
    },
  ];

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-fit flex items-center z-0 justify-center mb-5">
          <div className="relative z-50">
            <div className="relative z-50">
          <FloatingDock items={links} />
          </div>
          <div className="absolute inset-x-0 top-full flex justify-center">
              <div className="bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          </div>
          <div className="absolute inset-x-0 top-full flex justify-center">
              <div className="bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          </div>
          <div className="absolute inset-x-0 top-full flex justify-center">
              <div className="bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[2px] w-1/4 blur-sm" />
          </div>
          <div className="absolute inset-x-0 top-full flex justify-center">
              <div className="bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          </div>
      </div>
    </div>
  );
}
