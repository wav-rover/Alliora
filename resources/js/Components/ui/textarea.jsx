import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * A customizable textarea component with forwarded ref and className support.
 * @param {Object} props - The props for the textarea.
 * @param {string} [props.className] - Additional CSS classes to apply to the textarea.
 * @param {React.Ref} ref - The ref to be forwarded to the textarea element.
 * @returns {JSX.Element} A styled textarea element with forwarded ref and merged classNames.
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    (<textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Textarea.displayName = "Textarea"

export { Textarea }
