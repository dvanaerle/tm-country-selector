import React from "react";
import { useTranslations } from "next-intl";

// Props voor de PassageHeightResultView component.
interface PassageHeightResultViewProps {
  // Vertalingsfunctie van next-intl.
  t: ReturnType<typeof useTranslations>;
  // De berekende doorloophoogte.
  calculatedOutput: number;
  // Het acceptabele bereik voor de output, of null.
  outputRange: [number, number] | null;
}

// Toont het resultaat van de doorloophoogteberekening.
// Deze component geeft de berekende hoogte weer en, indien beschikbaar,
// een succesbericht dat aangeeft binnen welk bereik de waarde valt.
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
          min: outputRange[0],
          max: outputRange[1],
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </span>
    )}
  </>
);
