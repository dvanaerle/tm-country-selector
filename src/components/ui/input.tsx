import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-grey selection:bg-green border-light-grey flex h-13 w-full min-w-0 rounded border bg-transparent px-4 py-4 text-base transition-[color] outline-none selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-light-grey focus-visible:ring-green focus-visible:ring",
        "aria-invalid:border-red-600 aria-invalid:ring-red-600/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
