import React from "react";
import { useTranslations } from "next-intl";

interface GutterHeightResultViewProps {
  t: ReturnType<typeof useTranslations>;
  calculatedOutput: number;
  topWallProfileHeight: number;
  outputRange: [number, number];
}

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
    <ul className="mb-2 list-disc pl-5">
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
