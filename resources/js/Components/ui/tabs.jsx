"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * A customizable trigger component for tabs, built on top of TabsPrimitive.Trigger.
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional CSS classes to apply to the trigger.
 * @param {React.Ref} ref - A ref to be forwarded to the underlying TabsPrimitive.Trigger component.
 * @returns {React.ReactElement} A styled and accessible tab trigger component.
 */
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background hover:text-zinc-100",
      className
    )}
    {...props} />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * Renders a tab content component with forwarded ref and customizable className.
 * @param {Object} props - The properties passed to the component.
 * @param {string} [props.className] - Additional CSS class names to apply to the component.
 * @param {React.Ref} ref - The ref to be forwarded to the underlying TabsPrimitive.Content component.
 * @returns {React.ReactElement} A TabsPrimitive.Content component with applied styles and properties.
 */
const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
