import React from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { GutterHeightResultView } from "./GutterHeightResultView";
import { PassageHeightResultView } from "./PassageHeightResultView";
import CheckCircleLine from "../../../public/icons/MingCute/check_circle_line.svg";
import InformationLine from "../../../public/icons/MingCute/information_line.svg";

// Het type berekening dat door het formulier wordt uitgevoerd.
type CalculatorFormType = "wallProfile" | "gutterHeight";

// Props voor de CalculationResultAlert component.
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

  if (isGutterHeightResult) {
    return (
      <Alert variant="info" role="status" aria-live="polite">
        <InformationLine aria-hidden="true" />
        <AlertTitle>
          {t("Form.HeightBottomGutter.wallProfileHeightsResultTitle")}
        </AlertTitle>
        <AlertDescription>
          <GutterHeightResultView
            t={t}
            calculatedOutput={calculatedOutput}
            topWallProfileHeight={topWallProfileHeight}
          />
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="success" role="status" aria-live="polite">
      <CheckCircleLine aria-hidden="true" />
      <AlertTitle>
        {t.rich("Form.Common.passageHeightResult", {
          result: calculatedOutput,
          strong: (chunks) => <strong className="font-bold">{chunks}</strong>,
        })}
      </AlertTitle>
      <AlertDescription>
        <PassageHeightResultView
          t={t}
          calculatedOutput={calculatedOutput}
          outputRange={outputRange}
        />
      </AlertDescription>
    </Alert>
  );
};
