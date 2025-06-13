import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground ring-offset-2 hover:bg-secondary-hover inset-shadow-button",
        outline:
          "border border-primary hover:bg-primary hover:text-primary-foreground",
        border: "border hover:border-primary",
        link: "text-primary hover:text-secondary-hover",
      },
      size: {
        default: "min-h-12 px-6 py-2.75",
        sm: "min-h-10 px-4 py-2.25 text-sm",
        icon: "size-5",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        size: "default",
        className:
          "pt-2.5 pb-[calc((--spacing(2.5))+var(--inset-shadow-button-y))]",
      },
      {
        variant: "default",
        size: "sm",
        className:
          "pt-2 pb-[calc((--spacing(2))+var(--inset-shadow-button-y))]",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
