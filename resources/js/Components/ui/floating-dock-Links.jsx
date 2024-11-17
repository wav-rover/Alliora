"use client"

import React, { useEffect, useState, useCallback } from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { motion } from "framer-motion";
import { LineChartIcon as ChartLine, CalendarRange, SquareStack, ListPlus, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

export function FloatingDockWithLinks({ project, onListModified, onLinkClick, selectedComponent }) {
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
    onListModified('create', { title: randomName, position: Date.now() });
  };

  const [isProjectInfoDialogOpen, setIsProjectInfoDialogOpen] = React.useState(false);
  const [isGoogleCalendarDialogOpen, setIsGoogleCalendarDialogOpen] = React.useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [tokenClient, setTokenClient] = useState(null);

  useEffect(() => {
    const initializeGapiClient = () => {
      window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
      }).then(() => {
        console.log('GAPI client initialized');
        const newTokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (tokenResponse) => {
            console.log('Access token received', tokenResponse);
            setIsGoogleConnected(true);
          },
        });
        setTokenClient(newTokenClient);
      }, (error) => {
        console.error('Error initializing GAPI client', error);
      });
    };

    window.gapi.load('client', initializeGapiClient);
  }, []);

  const requestAccessToken = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    } else {
      console.error('Token client not initialized');
    }
  }, [tokenClient]);

  const exportToCalendar = useCallback(() => {
    if (!window.gapi.client) {
      console.error('GAPI client not loaded.');
      return;
    }

    if (!tokenClient) {
      console.error('Token client not initialized.');
      return;
    }

    if (!window.gapi.client.getToken()) {
      requestAccessToken();
      return;
    }

    project.tasks.forEach((task) => {
      if (task.start_date) {
        const event = {
          summary: task.name,
          description: task.description,
          start: {
            dateTime: new Date(task.start_date).toISOString(),
            timeZone: 'America/Los_Angeles',
          },
          end: task.end_date ? {
            dateTime: new Date(task.end_date).toISOString(),
            timeZone: 'America/Los_Angeles',
          } : undefined,
        };

        window.gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event,
        }).then((response) => {
          console.log('Event created:', response);
        }, (err) => {
          console.error('Error creating event', err);
        });
      } else {
        console.warn('Task skipped due to missing start date:', task);
      }
    });
  }, [project.tasks, tokenClient, requestAccessToken]);

  const links = [
    {
      title: "Task Board",
      icon: (
        <motion.div
          className="h-full w-full"
          animate={{
            color: selectedComponent === "taskboard" ? "rgb(255, 255, 255)" : "rgb(212, 212, 212)",
            filter: selectedComponent === "taskboard" ? "drop-shadow(0px 0px 10px rgba(200, 255, 255, 0.9))" : "drop-shadow(0px 0px 10px rgba(200, 255, 255, 0.0))",
          }}
        >
          <SquareStack className="h-full w-full" />
        </motion.div>
      ),
      href: "#",
      onClick: () => onLinkClick("taskboard"),
    },
    {
      title: "Statistics",
      icon: (
        <motion.div
          className="h-full w-full"
          animate={{
            color: selectedComponent === "projectcharts" ? "rgb(255, 255, 255)" : "rgb(212, 212, 212)",
            filter: selectedComponent === "projectcharts" ? "drop-shadow(0px 0px 10px rgba(200, 255, 255, 0.9))" : "drop-shadow(0px 0px 10px rgba(200, 255, 255, 0.0))",
          }}
        >
          <ChartLine className="h-full w-full" />
        </motion.div>
      ),
      href: "#",
      onClick: () => onLinkClick("projectcharts"),
    },
    {
      title: "Calendar",
      icon: (
        <motion.div
          className="h-full w-full"
          animate={{
            color: selectedComponent === "projectcalendar" ? "rgb(255, 255, 255)" : "rgb(212, 212, 212)",
            filter: selectedComponent === "projectcalendar" ? "drop-shadow(0px 0px 10px rgba(200, 255, 255, 0.9))" : "drop-shadow(0px 0px 10px rgba(200, 255, 255, 0.0))",
          }}
        >
          <CalendarRange className="h-full w-full" />
        </motion.div>
      ),
      href: "#",
      onClick: () => onLinkClick("projectcalendar"),
    },
    {
      title: "Powered by Alliora",
      icon: " ",
      href: "#",
    },
    {
      title: "Project info",
      icon: (
        <Info
          className="h-full w-full text-neutral-500 dark:text-neutral-300 cursor-pointer"
          onClick={() => setIsProjectInfoDialogOpen(true)}
        />
      ),
      href: "#",
    },
    {
      title: "Export to Google Agenda",
      icon: (
        <img
          src="https://img.icons8.com/?size=100&id=60984&format=png&color=FFFFFF"
          width={20}
          height={20}
          className="h-full w-full cursor-pointer"
          alt="Google Logo"
          onClick={() => setIsGoogleCalendarDialogOpen(true)}
        />
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
        <Dialog open={isProjectInfoDialogOpen} onOpenChange={setIsProjectInfoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project Information</DialogTitle>
              <DialogDescription>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  This project was created on {new Date(project.created_at).toDateString()}
                </p>
                <p className="mt-2 text-lg font-semibold">Name: {project.name}</p>
                <p>Description: {project.description}</p>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={isGoogleCalendarDialogOpen} onOpenChange={setIsGoogleCalendarDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export to Google Calendar</DialogTitle>
              <DialogDescription>
                <p className="mb-4">
                  You can export your tasks to Google Calendar. Only tasks with at least a start date will be exported.
                </p>
                <p>Exported tasks will be imported in a new agenda with the name of your Alliora project</p>
                <p className="mb-4">
                  {isGoogleConnected
                    ? "You are connected to Google Calendar."
                    : "You are not connected to Google Calendar. Click the button below to connect."}
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              {isGoogleConnected ? (
                <>
                  <Button onClick={exportToCalendar}>Export Tasks</Button>
                  <a href="https://calendar.google.com/calendar" target="_blank" rel="noopener noreferrer"><Button>See Google Calendar</Button></a>
                </>
              ) : (
                <Button onClick={requestAccessToken}>Connect to Google Calendar</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}