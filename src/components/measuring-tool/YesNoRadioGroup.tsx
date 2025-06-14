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
  <Label
    htmlFor={id}
    className="group hover:bg-muted/30 has-[:checked]:bg-muted/40 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-ring/50 has-[:checked]:border-primary flex min-h-12 flex-1 cursor-pointer items-center gap-x-2 rounded-sm border px-3 py-2.75 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 has-[:focus-visible]:ring-2"
  >
    <RadioGroupItem
      value={value}
      id={id}
      className="peer focus-visible:ring-0 focus-visible:outline-none"
      aria-label={label}
    />
    <span className="text-base font-medium group-has-[:checked]:font-semibold peer-focus-visible:outline-none">
      {label}
    </span>
  </Label>
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
