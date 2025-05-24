import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface YesNoRadioGroupProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  yesLabel: string;
  noLabel: string;
}

export const YesNoRadioGroup = ({
  id,
  name,
  value,
  onChange,
  yesLabel,
  noLabel,
}: YesNoRadioGroupProps) => {
  const options = [
    { id: `${id}-yes`, value: "checked", label: yesLabel },
    { id: `${id}-no`, value: "unchecked", label: noLabel },
  ];

  return (
    <RadioGroup
      onValueChange={onChange}
      value={value}
      className="flex space-x-4"
      name={name}
    >
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.value}
            id={option.id}
            className="peer"
          />
          <Label className="cursor-pointer font-medium" htmlFor={option.id}>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
