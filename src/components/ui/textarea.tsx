import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-28 w-full rounded-xl bg-card px-3.5 py-3 text-base text-foreground shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow] duration-150 outline-none placeholder:text-muted-foreground/80",
        "focus-visible:shadow-[0_0_0_2px_var(--color-plum)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
