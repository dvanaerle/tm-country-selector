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
  "aria-describedby"?: string;
}

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
    { id: `${id}-yes`, value: "checked", label: yesLabel },
    { id: `${id}-no`, value: "unchecked", label: noLabel },
  ];

  return (
    <RadioGroup
      onValueChange={onChange}
      value={value}
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
