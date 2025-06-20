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
}

// Een component die de resultaten van de goothoogteberekening weergeeft.
// Het toont de berekende hoogtes voor zowel het onderste als het bovenste muurprofiel,
// en het resulterende bereik van de doorloophoogte.
export const GutterHeightResultView: React.FC<GutterHeightResultViewProps> = ({
  t,
  calculatedOutput,
  topWallProfileHeight,
}) => (
  <>
    <ul className="list-(--dash) space-x-12 pl-3" role="list">
      <li className="pl-2">
        {t.rich("Form.HeightBottomGutter.bottomWallProfileHeightLabel", {
          height: calculatedOutput,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </li>
      <li className="pl-2">
        {t.rich("Form.HeightBottomGutter.topWallProfileHeightLabel", {
          height: topWallProfileHeight,
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </li>
    </ul>
  </>
);
