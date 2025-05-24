import React from "react";
import { Input } from "@/components/ui/input";

interface NumberInputWithUnitProps {
  id: string;
  placeholder: string;
  unit: string;
  min?: number;
  max?: number;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  isInvalid?: boolean;
}

export const NumberInputWithUnit = ({
  id,
  placeholder,
  unit,
  min,
  max,
  value,
  onChange,
  isInvalid,
}: NumberInputWithUnitProps) => (
  <div className="relative flex items-center">
    <Input
      id={id}
      type="number"
      step={1}
      min={min}
      max={max}
      placeholder={placeholder}
      className="pr-10"
      aria-invalid={isInvalid}
      value={value ?? ""}
      onChange={(e) =>
        onChange(e.target.value === "" ? undefined : Number(e.target.value))
      }
    />
    <span className="text-grey absolute right-3 text-sm">{unit}</span>
  </div>
);
