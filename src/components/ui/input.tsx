import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-xl bg-card px-3.5 text-base text-foreground shadow-[0_0_0_1px_var(--color-border)] transition-[box-shadow] duration-150 outline-none placeholder:text-muted-foreground/80",
          "focus-visible:shadow-[0_0_0_2px_var(--color-plum)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
