"use client";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import React, { useState, createContext, useContext } from "react";
import { Menu, X, ArrowLeftFromLine, Group, Settings, Users } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { motion } from "framer-motion";

// Création du contexte de la Sidebar
const SidebarContext = createContext(undefined);

const links = [
  {
    label: "Dashboard",
    href: route('dashboard'), // Remplace le lien vers le Dashboard ici
    icon: <Group className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Projects",
    href: route('projects.index'),
    icon: <Settings className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Teams",
    href: route('teams.index'),
    icon: <Users className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
  },
  {
    label: "Logout",
    href: route("logout"),
    icon: <ArrowLeftFromLine className="text-neutral-200 h-5 w-5 flex-shrink-0" />,
    method: "post",
    as: "button",
  },
];


// Hook personnalisé pour utiliser le contexte de la sidebar
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [open, setOpen] = useState(false); // État local pour l'ouverture de la sidebar
  
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Composant Sidebar principal
export const Sidebar = ({ children }) => {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
};

// Composant qui gère la partie visible de la sidebar sur desktop et mobile
export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

// Sidebar pour Desktop
export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  
  return (
    <div
      className={cn("my-5")}
      
    >
      <motion.div
      onMouseEnter={() => setOpen(true)} // Ouvre la sidebar au hover
      onMouseLeave={() => setOpen(false)} // Ferme la sidebar lorsque le curseur sort
        className={cn(" h-full px-4 py-4 ml-5 hidden md:flex md:flex-col bg-neutral-900/90 w-[300px] rounded-3xl", className)}
        style={{ width: open ? "300px" : "60px" }} // Gère la largeur selon l'état ouvert
        initial={{ width: "60px", opacity: 0.7 }} // État initial
        animate={{ width: open ? "250px" : "60px", opacity: open ? 1 : 0.7 }} // Animation sur ouverture
        transition={{ type: "spring", stiffness: 170, damping:19 }} // Transition d'animation
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Sidebar pour Mobile
export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  
  return (
    <div className={cn("h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-900 dark:bg-neutral-900 w-full")} {...props}>
      <div className="flex justify-end z-20 w-full">
        <Menu className="text-neutral-200" onClick={() => setOpen(!open)} />
      </div>
      {open && (
        <div
          className={cn("fixed h-full w-full inset-0 bg-neutral-900 dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between", className)}
        >
          <div className="absolute right-10 top-10 z-50 text-neutral-200" onClick={() => setOpen(false)}>
            <X />
          </div>
          {children}
        </div>
      )}
    </div>
  );
};

// Composant pour les liens dans la Sidebar
export const SidebarLink = ({ link, setActivePage, className, ...props }) => {
  const { open, setOpen } = useSidebar();

  const handleClick = (event) => {
    event.preventDefault(); // Empêche le comportement par défaut du lien

    // Ferme la sidebar avec un délai
    if (link.href && link.href !== "#") {
      setOpen(false);
      setTimeout(() => {
        setActivePage(link.label.toLowerCase()); 
        window.location.href = link.href;
      }, 100);
    }

    if (link.method === "post") {
      const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content;

      fetch(link.href, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          window.location.href = "/"; // Rediriger après déconnexion
        } else {
          console.error("Logout failed:", response.statusText);
        }
      });
    } else if (link.action) {
      link.action();
    } else if (link.href && link.href !== "#") {
      window.location.href = link.href;
    }
  };

  return (
    <a href={link.href || "#"} onClick={handleClick} className={cn("flex items-center justify-start gap-2 group/sidebar py-2", className)} {...props}>
      {link.icon}
      <motion.span
        
        style={{ display: open ? "inline-block" : "none", opacity: open ? 1 : 0 }} // Gère la visibilité du texte
        className="text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
};

// Composant pour afficher le logo
export const Logo = () => {
  const { open } = useSidebar();
  return (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20">
      <div className="h-5 w-6 bg-white dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <span style={{ opacity: open ? 1 : 0 }} className="font-medium text-white whitespace-pre">
        Alliora
      </span>
    </Link>
  );
};

// Composant final de la Sidebar avec les liens et l'avatar
export const SidebarFinal = ({ setActivePage }) => {
  const { auth } = usePage().props;

  return (
    <Sidebar>
      <SidebarBody>
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Logo />
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} setActivePage={setActivePage} className="group">
                <span className="text-neutral-200 text-sm whitespace-pre group-hover:underline">
                  {link.label}
                </span>
              </SidebarLink>
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: auth.user?.name || "User",
              href: "#",
              icon: (
                <img
                  src={auth.user?.img_profil || "https://via.placeholder.com/40"}
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  alt="Avatar"
                />
              ),
            }}
            className="group"
          >
            <span className="text-neutral-200 text-sm group-hover:underline">
              {auth.user?.name || "User"}
            </span>
          </SidebarLink>
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

export default SidebarFinal;
