import React from "react";
import { useTranslations } from "next-intl";
import { FormStepConfig } from "./formStepsConfig";
import { RadioGroupStep } from "./RadioGroupStep";
import { YesNoStep } from "./YesNoStep";
import { NumberInputStep } from "./NumberInputStep";
import { CustomSelectStep } from "./CustomSelectStep";

type Props = {
  config: FormStepConfig;
  t: ReturnType<typeof useTranslations>;
  disabled?: boolean;
};

// Factory component die de juiste stap-component rendert op basis van het type
// Dit patron maakt het eenvoudig om nieuwe stap-types toe te voegen zonder de hoofdlogica te wijzigen
export const FormStep: React.FC<Props> = ({ config, t, disabled }) => {
  switch (config.type) {
    case "radio-group":
      return <RadioGroupStep config={config} t={t} disabled={disabled} />;
    case "yes-no":
      return <YesNoStep config={config} t={t} disabled={disabled} />;
    case "number-input":
      return <NumberInputStep config={config} t={t} disabled={disabled} />;
    case "custom-select":
      return <CustomSelectStep config={config} t={t} disabled={disabled} />;
    default:
      return null;
  }
};
