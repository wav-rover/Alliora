import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names or conditional class names into a single string
 * @param {...(string|Object<string, boolean>)} inputs - Class names or conditional class objects
 * @returns {string} A merged string of class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
