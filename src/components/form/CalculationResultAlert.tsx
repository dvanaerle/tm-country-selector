import React from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  // Always render the success variant as error states are handled by form validation
  return (
    <Alert variant="success" role="status" aria-live="polite">
      <CheckCircleLine aria-hidden="true" />
      <AlertDescription>
        {formType === "gutterHeight" &&
        topWallProfileHeight != null &&
        outputRange ? (
          <>
            <p className="font-semibold">
              {t("Form.HeightBottomGutter.wallProfileHeightsResultTitle")}
            </p>
            <ul className="mb-2 list-disc pl-5">
              <li>
                {t.rich(
                  "Form.HeightBottomGutter.bottomWallProfileHeightLabel",
                  {
                    height: calculatedOutput,
                    strong: (chunks) => <strong>{chunks}</strong>,
                  },
                )}
              </li>
              <li>
                {t.rich("Form.HeightBottomGutter.topWallProfileHeightLabel", {
                  height: topWallProfileHeight,
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </li>
            </ul>
            <div>
              {t.rich("Form.HeightBottomGutter.walkthroughHeightRangeLabel", {
                min: outputRange[0],
                max: outputRange[1],
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </div>
          </>
        ) : (
          <>
            <p>
              {t.rich("Form.Common.passageHeightResult", {
                result: calculatedOutput,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            {outputRange && (
              <span>
                {t.rich("Form.Common.rangeSuccess", {
                  within: t("Form.Common.rangeSuccessWithin"),
                  min: outputRange[0],
                  max: outputRange[1],
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
              </span>
            )}
          </>
        )}
      </AlertDescription>
    </Alert>
  );
};
