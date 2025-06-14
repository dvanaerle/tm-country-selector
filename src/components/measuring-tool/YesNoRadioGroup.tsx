import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Props voor de YesNoRadioGroup component.
interface YesNoRadioGroupProps {
  id: string;
  name: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  yesLabel: string;
  noLabel: string;
  "aria-describedby"?: string;
}

// Props voor de RadioOption component.
interface RadioOptionProps {
  id: string;
  value: string;
  label: string;
}

// Een helper component om een individuele radio optie te renderen.
const RadioOption: React.FC<RadioOptionProps> = ({ id, value, label }) => (
  <div className="flex items-center gap-x-2">
    <RadioGroupItem value={value} id={id} className="peer" aria-label={label} />
    <Label
      className="cursor-pointer text-base font-medium peer-focus-visible:outline-none"
      htmlFor={id}
    >
      {label}
    </Label>
  </div>
);

// Een herbruikbare radiogroep voor "Ja" of "Nee" selecties.
// Deze component werkt intern met booleaanse waarden (`true`/`false`)
// voor een eenvoudige integratie met formulierlogica.
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

  // Converteert de string-waarde van de radiogroep ("true" of "false")
  // naar een booleaanse waarde voordat de `onChange`-callback wordt aangeroepen.
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
        <RadioOption
          key={option.id}
          id={option.id}
          value={option.value}
          label={option.label}
        />
      ))}
    </RadioGroup>
  );
};
