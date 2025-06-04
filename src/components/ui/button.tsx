import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-green focus-visible:ring-green/50 focus-visible:ring-2",
  {
    variants: {
      variant: {
        default:
          "bg-lime-600 text-white border-b-4 border-lime-700 hover:bg-lime-700",
        outlineDark:
          "border border-green text-green hover:bg-green hover:text-white",
        outlineLight: "border border-light-grey hover:border-green",
        link: "text-green hover:text-light-green",
      },
      size: {
        default: "px-4 py-2.5 has-[>svg]:px-3",
        sm: "gap-1.5 px-3 has-[>svg]:px-2.5",
        md: "px-5 py-4 has-[>svg]:px-3.5 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-9",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

function Button({
  className,
  variant,
  size,
  fullWidth,
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
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
