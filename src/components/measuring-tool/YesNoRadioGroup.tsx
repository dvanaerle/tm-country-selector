import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/**
 * Props voor de YesNoRadioGroup component.
 */
interface YesNoRadioGroupProps {
  id: string;
  name: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  yesLabel: string;
  noLabel: string;
  "aria-describedby"?: string;
}

/**
 * Een herbruikbare radiogroep voor "Ja" of "Nee" selecties.
 * Deze component werkt intern met booleaanse waarden (`true`/`false`)
 * voor een eenvoudige integratie met formulierlogica.
 */
export const YesNoRadioGroup: React.FC<YesNoRadioGroupProps> = ({
  id,
  name,
  value,
  onChange,
  yesLabel,
  noLabel,
  "aria-describedby": ariaDescribedBy,
}) => {
  const options = [
    { id: `${id}-yes`, value: "true", label: yesLabel },
    { id: `${id}-no`, value: "false", label: noLabel },
  ];

  /**
   * Converteert de string-waarde van de radiogroep ("true" of "false")
   * naar een booleaanse waarde voordat de `onChange`-callback wordt aangeroepen.
   */
  const handleValueChange = (val: string) => {
    onChange(val === "true");
  };

  return (
    <RadioGroup
      onValueChange={handleValueChange}
      value={value === undefined ? "" : String(value)}
      className="flex gap-x-4"
      name={name}
      aria-describedby={ariaDescribedBy}
    >
      {options.map((option) => (
        <div key={option.id} className="flex items-center gap-x-2">
          <RadioGroupItem
            value={option.value}
            id={option.id}
            className="peer"
          />
          <Label
            className="cursor-pointer text-base font-medium peer-focus-visible:outline-none"
            htmlFor={option.id}
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
