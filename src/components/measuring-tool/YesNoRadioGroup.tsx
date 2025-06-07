import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface YesNoRadioGroupProps {
  id: string;
  name: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  yesLabel: string;
  noLabel: string;
  "aria-describedby"?: string;
}

// A reusable radio group for "Yes" or "No" selections, using boolean values.
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

  // Converts the radio group's string output to a boolean before calling onChange.
  const handleValueChange = (val: string) => {
    onChange(val === "true");
  };

  return (
    <RadioGroup
      onValueChange={handleValueChange}
      value={value === undefined ? "" : String(value)}
      className="flex space-x-4"
      name={name}
      aria-describedby={ariaDescribedBy}
    >
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={option.id}
            className="peer"
          />
          <Label
            className="cursor-pointer font-medium peer-focus-visible:outline-none"
            htmlFor={option.id}
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
