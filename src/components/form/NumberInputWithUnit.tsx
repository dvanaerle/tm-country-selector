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
  "aria-describedby"?: string;
  disabled?: boolean;
}

export const NumberInputWithUnit: React.FC<NumberInputWithUnitProps> = ({
  id,
  placeholder,
  unit,
  min,
  max,
  value,
  onChange,
  isInvalid = false,
  disabled = false,
  "aria-describedby": ariaDescribedBy,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      onChange(undefined);
      return;
    }

    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const unitId = `${id}-unit`;

  return (
    <div className="relative flex items-center">
      <Input
        id={id}
        type="number"
        step={1}
        min={min}
        max={max}
        placeholder={placeholder}
        className="peer pr-10"
        aria-invalid={isInvalid}
        aria-describedby={`${unitId} ${ariaDescribedBy || ""}`.trim()}
        value={value ?? ""}
        onChange={handleChange}
        disabled={disabled}
      />
      <span
        id={unitId}
        className="text-grey pointer-events-none absolute right-3 text-sm transition-opacity peer-disabled:opacity-50"
        aria-label={`Unit: ${unit}`}
      >
        {unit}
      </span>
    </div>
  );
};