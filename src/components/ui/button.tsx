import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-wide transition-[color,background-color,box-shadow,transform,opacity] duration-200 ease-out disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-champagne/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:not-disabled:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-champagne text-primary-foreground shadow-[0_1px_0_rgba(255,255,255,0.15)_inset,0_8px_24px_-8px_rgba(201,163,106,0.45)] hover:bg-champagne-light",
        gold:
          "bg-champagne text-primary-foreground hover:bg-champagne-light",
        outline:
          "bg-transparent text-foreground shadow-[0_0_0_1px_rgba(244,239,232,0.18)] hover:bg-white/[0.05] hover:shadow-[0_0_0_1px_rgba(201,163,106,0.4)]",
        ghost:
          "bg-transparent text-foreground/85 hover:bg-white/[0.06] hover:text-foreground",
        link: "text-champagne underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        default: "h-11 rounded-full px-6 text-sm",
        sm: "h-9 rounded-full px-4 text-sm",
        lg: "h-12 rounded-full px-8 text-[0.9375rem]",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
