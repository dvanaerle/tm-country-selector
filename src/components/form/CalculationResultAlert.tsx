
import React from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import CheckCircleLine from "../../../public/icons/MingCute/check_circle_line.svg";
import WarningLine from "../../../public/icons/MingCute/warning_line.svg";

type CalculatorFormType = "wallProfile" | "gutterHeight";

interface Recommendation {
  recommendedInput: number;
  resultingOutputInRange: number;
  newOutputRange: [number, number];
}

interface CalculationResultAlertProps {
  t: ReturnType<typeof useTranslations>;
  formType: CalculatorFormType;
  calculatedOutput: number;
  isOutputInRange: boolean;
  outputRange: [number, number] | null;
  recommendation: Recommendation | null;
}

export const CalculationResultAlert: React.FC<CalculationResultAlertProps> = ({
  t,
  formType,
  calculatedOutput,
  isOutputInRange,
  outputRange,
  recommendation,
}) => {
  const resultTitleKey =
    formType === "gutterHeight"
      ? "Form.HeightBottomGutter.heightBottomGutterResult"
      : "Form.Common.passageHeightResult";

  const alertTitle = t.rich(resultTitleKey, {
    result: calculatedOutput,
    strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  });

  const alertVariant = isOutputInRange && !recommendation ? "success" : "error";

  const renderSuccessContent = () => (
    <span>
      {t.rich("Form.Common.rangeSuccess", {
        within: t("Form.Common.rangeSuccessWithin"),
        min: outputRange![0],
        max: outputRange![1],
        strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
      })}
    </span>
  );

  const renderErrorContent = () => (
    <>
      {outputRange ? (
        <>
          <span>
            {t.rich("Form.Common.rangeError", {
              outside: t("Form.Common.rangeSuccessOutside"),
              min: outputRange[0],
              max: outputRange[1],
              strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
            })}
          </span>
          {formType === "wallProfile" && calculatedOutput > 2500 && (
            <p className="mt-2">
              {t.rich("Form.Common.maximumPostsRule", {
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              })}
            </p>
          )}
        </>
      ) : (
        <span>
          {t("Form.Common.genericRangeError", { result: calculatedOutput })}
        </span>
      )}

      {recommendation && (
        <p className="mt-2">
          {formType === "wallProfile"
            ? t.rich("Form.WallProfileHeight.recommendation", {
                currentResult: calculatedOutput,
                recommendedWallProfileHeight: recommendation.recommendedInput,
                min: recommendation.newOutputRange[0],
                max: recommendation.newOutputRange[1],
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              })
            : t.rich("Form.HeightBottomGutter.recommendation", {
                currentResult: calculatedOutput,
                recommendedGutterBottomHeight: recommendation.recommendedInput,
                min: recommendation.newOutputRange[0],
                max: recommendation.newOutputRange[1],
                strong: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
              })}
        </p>
      )}
    </>
  );

  return (
    <Alert variant={alertVariant} role="alert" aria-live="polite">
      {alertVariant === "success" ? (
        <CheckCircleLine aria-hidden="true" />
      ) : (
        <WarningLine aria-hidden="true" />
      )}
      <AlertTitle>{alertTitle}</AlertTitle>
      <AlertDescription>
        {isOutputInRange && outputRange
          ? renderSuccessContent()
          : renderErrorContent()}
      </AlertDescription>
    </Alert>
  );
};
