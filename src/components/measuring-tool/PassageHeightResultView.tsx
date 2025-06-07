import React from "react";
import { useTranslations } from "next-intl";

interface PassageHeightResultViewProps {
  t: ReturnType<typeof useTranslations>;
  calculatedOutput: number;
  outputRange: [number, number] | null;
}

export const PassageHeightResultView: React.FC<
  PassageHeightResultViewProps
> = ({ t, calculatedOutput, outputRange }) => (
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
);
