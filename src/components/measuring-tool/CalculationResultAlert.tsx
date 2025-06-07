import React from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GutterHeightResultView } from "./GutterHeightResultView";
import { PassageHeightResultView } from "./PassageHeightResultView";
import CheckCircleLine from "../../../public/icons/MingCute/check_circle_line.svg";

type CalculatorFormType = "wallProfile" | "gutterHeight";

interface CalculationResultAlertProps {
  t: ReturnType<typeof useTranslations>;
  formType: CalculatorFormType;
  calculatedOutput: number;
  outputRange: [number, number] | null;
  topWallProfileHeight?: number | null;
}

export const CalculationResultAlert: React.FC<CalculationResultAlertProps> = ({
  t,
  formType,
  calculatedOutput,
  outputRange,
  topWallProfileHeight,
}) => {
  const isGutterHeightResult =
    formType === "gutterHeight" && topWallProfileHeight != null && outputRange;

  return (
    <Alert variant="success" role="status" aria-live="polite">
      <CheckCircleLine aria-hidden="true" />
      <AlertDescription>
        {isGutterHeightResult ? (
          <GutterHeightResultView
            t={t}
            calculatedOutput={calculatedOutput}
            topWallProfileHeight={topWallProfileHeight}
            outputRange={outputRange}
          />
        ) : (
          <PassageHeightResultView
            t={t}
            calculatedOutput={calculatedOutput}
            outputRange={outputRange}
          />
        )}
      </AlertDescription>
    </Alert>
  );
};
