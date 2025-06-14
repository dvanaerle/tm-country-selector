import React from "react";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GutterHeightResultView } from "./GutterHeightResultView";
import { PassageHeightResultView } from "./PassageHeightResultView";
import CheckCircleLine from "../../../public/icons/MingCute/check_circle_line.svg";

// Het type berekening dat door het formulier wordt uitgevoerd.
type CalculatorFormType = "wallProfile" | "gutterHeight";

// Props voor de CalculationResultAlert component.
interface CalculationResultAlertProps {
  // Vertalingsfunctie van next-intl.
  t: ReturnType<typeof useTranslations>;
  // Het type van het formulier, bepaalt welke resultaatweergave wordt getoond.
  formType: CalculatorFormType;
  // De berekende outputwaarde.
  calculatedOutput: number;
  // Het acceptabele bereik voor de output, of null als er geen is.
  outputRange: [number, number] | null;
  // De hoogte van het bovenste muurprofiel, optioneel.
  topWallProfileHeight?: number | null;
}

// Toont een succesmelding met het berekende resultaat.
// Deze component toont ofwel de goothoogte ofwel de doorloophoogte,
// afhankelijk van het opgegeven `formType`.
export const CalculationResultAlert: React.FC<CalculationResultAlertProps> = ({
  t,
  formType,
  calculatedOutput,
  outputRange,
  topWallProfileHeight,
}) => {
  // Bepaalt of het resultaat voor de goothoogte moet worden weergegeven.
  const isGutterHeightResult =
    formType === "gutterHeight" && topWallProfileHeight != null && outputRange;

  return (
    <Alert variant="success" role="status" aria-live="polite">
      <CheckCircleLine aria-hidden="true" />
      <AlertDescription>
        {isGutterHeightResult ? (
          // Toont het resultaat voor de goothoogte.
          <GutterHeightResultView
            t={t}
            calculatedOutput={calculatedOutput}
            topWallProfileHeight={topWallProfileHeight}
            outputRange={outputRange}
          />
        ) : (
          // Toont het resultaat voor de doorloophoogte.
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
