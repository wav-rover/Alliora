import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { ChartLine, Terminal, LayoutTemplate, ListPlus, MessageSquareDashed } from "lucide-react";

export function FloatingDockWithLinks() {
  const links = [
    {
      title: "Statistics",
      icon: (
        <ChartLine className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Products",
      icon: (
        <Terminal className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Components",
      icon: (
        <LayoutTemplate className="h-full w-full text-neutral-500 dark:text-neutral-300" />
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
        <ListPlus className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-fit flex items-center z-0 justify-center mb-5">
      <FloatingDock items={links} />
    </div>

  );
}
