import React from "react";
import { useTranslations } from "next-intl";

// Props voor de GutterHeightResultView component.
interface GutterHeightResultViewProps {
  // Vertalingsfunctie van next-intl.
  t: ReturnType<typeof useTranslations>;
  // De berekende hoogte van het onderste gootprofiel.
  calculatedOutput: number;
  // De hoogte van het bovenste muurprofiel.
  topWallProfileHeight: number;
  // Het acceptabele bereik voor de doorloophoogte.
  outputRange: [number, number];
}

// Een component die de resultaten van de goothoogteberekening weergeeft.
// Het toont de berekende hoogtes voor zowel het onderste als het bovenste muurprofiel,
// en het resulterende bereik van de doorloophoogte.
export const GutterHeightResultView: React.FC<GutterHeightResultViewProps> = ({
  t,
  calculatedOutput,
  topWallProfileHeight,
  outputRange,
}) => (
  <>
    <p className="font-semibold">
      {t("Form.HeightBottomGutter.wallProfileHeightsResultTitle")}
    </p>
    <ul className="mb-2 list-disc pl-5" role="list">
      <li>
        {t.rich("Form.HeightBottomGutter.bottomWallProfileHeightLabel", {
          height: calculatedOutput,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
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
);
