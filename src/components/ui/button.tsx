import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-white border-b-4 border-secondary-shadow ring-offset-2 hover:bg-secondary-shadow focus-visible:border-secondary-shadow",
        outlineDark: "border border-primary hover:bg-primary hover:text-white",
        outlineLight: "border hover:border-primary",
        link: "text-primary hover:text-primary-shadow",
      },
      size: {
        default: "px-4 py-2.5 has-[>svg]:px-3",
        sm: "gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "px-5 py-4 has-[>svg]:px-3.5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9",
      },
    },
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
