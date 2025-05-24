import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function FloatingLabelInput({
  label,
  type = "text",
  className,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update hasValue if the input value changes from outside
  useEffect(() => {
    if (inputRef.current) {
      setHasValue(!!inputRef.current.value);
    }
  }, [props.value]);

  return (
    <div className="relative w-full">
      <input
        {...props}
        ref={inputRef}
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0);
          if (props.onChange) props.onChange(e);
        }}
        className={cn(
          "peer w-full rounded border border-gray-300 bg-transparent px-4 pt-6 pb-2 text-base text-black placeholder-transparent transition-colors focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        placeholder={label}
      />
      <label
        className={cn(
          "absolute top-2 left-4 z-10 origin-left scale-100 transform text-gray-500 transition-all duration-200 ease-in-out peer-placeholder-shown:top-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:scale-75 peer-focus:text-green",
          (isFocused || hasValue) && "top-2 scale-75 text-green-500",
        )}
      >
        {label}
      </label>
    </div>
  );
}

export { FloatingLabelInput };
