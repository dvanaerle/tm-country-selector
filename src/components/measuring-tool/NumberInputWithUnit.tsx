import React from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

// Props voor de NumberInputWithUnit component.
interface NumberInputWithUnitProps {
  id: string;
  placeholder: string;
  unit: string;
  t: ReturnType<typeof useTranslations>;
  min?: number;
  max?: number;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  isInvalid?: boolean;
  "aria-describedby"?: string;
  disabled?: boolean;
}

// Een inputveld voor numerieke waarden met een eenheid (bijv. "mm") die ernaast wordt weergegeven.
// Zorgt voor de conversie van de input-string naar een numerieke waarde.
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
  // Behandelt de wijziging van de inputwaarde.
  // Converteert de string-waarde naar een getal of `undefined` als het veld leeg is.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      onChange(undefined);
      return;
    }

    const numValue = Number(inputValue);
    // Roep onChange alleen aan als de waarde een geldig getal is.
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
        className="text-muted-foreground pointer-events-none absolute right-3 text-sm transition-opacity peer-disabled:opacity-50"
        aria-disabled={disabled ? "true" : undefined}
      >
        {unit}
      </span>
    </div>
  );
};
