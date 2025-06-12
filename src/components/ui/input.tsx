import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-neutral-medium selection:bg-primary border-neutral-light flex h-13 w-full min-w-0 rounded border bg-transparent px-4 py-4 text-base transition-[color] outline-none selection:text-white file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2",
        "aria-invalid:border-error aria-invalid:ring-error/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
