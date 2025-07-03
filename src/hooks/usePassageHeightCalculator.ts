import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";

export const FOUNDATION_WARNING_THRESHOLD = 2400;

// Configuratieconstanten voor de berekeningen.
const CALCULATOR_CONFIG = {
  depths: [2.5, 3, 3.5, 4] as const,
  angle: (8 * Math.PI) / 180, // Hoek van 8 graden, eenmalig omgerekend naar radialen.
  adjustments: {
    depthPrimary: 4.59,
    depthSecondary: 7,
    wallToGutter: 1,
    railSlope: 18, // Aanpassing voor verzonken railsysteem.
  },
  limits: {
    maxPassageHeight: 2500, // Maximale toegestane doorloophoogte.
  },
  // Geldige bereiken voor de output.
  ranges: [
    [1980, 2020],
    [2030, 2070],
    [2080, 2120],
    [2130, 2170],
    [2180, 2220],
    [2230, 2270],
    [2280, 2320],
    [2330, 2370],
    [2380, 2420],
    [2480, 2520],
    [2580, 2620],
    [2680, 2720],
  ] as [number, number][],
} as const;

// Type definities
type FormType = "wallProfile" | "gutterHeight";
type RailSlope = "checked" | "unchecked";
export type FormValues = z.infer<ReturnType<typeof createSchema>>;

// Types voor gevalideerde data om non-null assertions te vermijden.
type ValidatedWallProfileForm = FormValues & {
  wallProfileHeight: number;
  depth: number;
  railSystemSlope: RailSlope;
};
type ValidatedGutterHeightForm = FormValues & {
  heightBottomGutter: number;
  depth: number;
  railSystemSlope: RailSlope;
};

// Een object dat alle rekenkundige logica groepeert.
const calculator = {
  // Berekent cruciale afmetingen op basis van diepte en afloop.
  calculateDimensions(depth: number, slope: number) {
    const cosAngle = Math.cos(CALCULATOR_CONFIG.angle);
    const sinAngle = Math.sin(CALCULATOR_CONFIG.angle);
    const insideDepth =
      depth * cosAngle * 1000 +
      CALCULATOR_CONFIG.adjustments.depthPrimary +
      CALCULATOR_CONFIG.adjustments.depthSecondary;
    const wallToGutterDiff =
      depth * sinAngle * 1000 + CALCULATOR_CONFIG.adjustments.wallToGutter;
    const slopeRatio = insideDepth > 0 ? slope / insideDepth : 0;
    const slopeDrop =
      insideDepth * Math.sin(Math.asin(Math.max(-1, Math.min(1, slopeRatio))));
    return { insideDepth, wallToGutterDiff, slopeDrop };
  },

  // Berekent de doorloophoogte op basis van de muurprofielhoogte.
  calculateFromWallProfile(
    depth: number,
    slope: number,
    wallProfile: number,
    railSlope: RailSlope,
  ) {
    const { wallToGutterDiff, slopeDrop } = this.calculateDimensions(
      depth,
      slope,
    );
    const gutterHeight = wallProfile - wallToGutterDiff + slopeDrop;
    const passageHeight =
      railSlope === "checked"
        ? gutterHeight + CALCULATOR_CONFIG.adjustments.railSlope
        : gutterHeight;
    return Math.round(passageHeight);
  },
  // Berekent de muurprofielhoogte op basis van de gewenste doorloophoogte.
  calculateFromGutterHeight(
    depth: number,
    slope: number,
    targetPassageHeight: number,
    railSlope: RailSlope,
  ) {
    const targetGutterHeight =
      railSlope === "checked"
        ? targetPassageHeight - CALCULATOR_CONFIG.adjustments.railSlope
        : targetPassageHeight;
    const { wallToGutterDiff, slopeDrop } = this.calculateDimensions(
      depth,
      slope,
    );
    const wallProfile = targetGutterHeight + wallToGutterDiff + slopeDrop;
    return Math.round(wallProfile);
  },
  // Berekent een voorgestelde muurprofielhoogte als de input buiten het bereik valt.
  calculateInverseForWallProfileSuggestion(
    depth: number,
    slope: number,
    targetPassageHeight: number,
    railSlope: RailSlope,
  ) {
    const targetGutterHeight =
      railSlope === "checked"
        ? targetPassageHeight - CALCULATOR_CONFIG.adjustments.railSlope
        : targetPassageHeight;
    const { wallToGutterDiff, slopeDrop } = this.calculateDimensions(
      depth,
      slope,
    );
    // De inverse berekening moet de hellingsdaling aftrekken.
    const wallProfile = targetGutterHeight + wallToGutterDiff - slopeDrop;
    return Math.round(wallProfile);
  },

  // Berekent een voorgestelde doorloophoogte als de input buiten het bereik valt.
  calculateInverseForGutterHeightSuggestion(
    depth: number,
    slope: number,
    targetWallProfile: number,
    railSlope: RailSlope,
  ) {
    const { wallToGutterDiff, slopeDrop } = this.calculateDimensions(
      depth,
      slope,
    );
    const targetGutterHeight = targetWallProfile - wallToGutterDiff - slopeDrop;
    const recommendedPassageHeight =
      railSlope === "checked"
        ? targetGutterHeight + CALCULATOR_CONFIG.adjustments.railSlope
        : targetGutterHeight;
    return Math.round(recommendedPassageHeight);
  },

  // Controleert of een waarde binnen de gedefinieerde bereiken valt.
  checkRange(value: number, formType: FormType) {
    for (const [min, max] of CALCULATOR_CONFIG.ranges) {
      // Alleen voor wallProfile geldt de maxPassageHeight, niet voor gutterHeight
      if (
        formType === "wallProfile" &&
        value > CALCULATOR_CONFIG.limits.maxPassageHeight
      )
        continue;
      if (value >= min && value <= max) {
        return { inRange: true, range: [min, max] as [number, number] };
      }
    }
    // Zoek het dichtstbijzijnde bereik als de waarde buiten alle bereiken valt.
    let closest: [number, number] | null = null;
    let minDiff = Infinity;
    for (const range of CALCULATOR_CONFIG.ranges) {
      const [min, max] = range;
      if (
        formType === "wallProfile" &&
        min > CALCULATOR_CONFIG.limits.maxPassageHeight
      )
        continue;
      const diff = Math.min(Math.abs(value - min), Math.abs(value - max));
      if (diff < minDiff) {
        minDiff = diff;
        closest = [min, max];
      }
    }
    return { inRange: false, range: closest };
  },

  // Genereert een suggestie voor een nieuwe invoerwaarde als het resultaat buiten het bereik valt.
  generateSuggestion(
    formType: FormType,
    data: FormValues,
    output: number,
    closestRange: [number, number],
  ) {
    const { depth, slope = 0, railSystemSlope } = data;
    if (depth == null || railSystemSlope == null) return null;

    let targetOutput =
      output < closestRange[0] ? closestRange[0] : closestRange[1];
    if (formType === "wallProfile") {
      targetOutput = Math.min(
        targetOutput,
        CALCULATOR_CONFIG.limits.maxPassageHeight,
      );
    }

    const recommendedInput =
      formType === "wallProfile"
        ? this.calculateInverseForWallProfileSuggestion(
            depth,
            slope,
            targetOutput,
            railSystemSlope,
          )
        : this.calculateInverseForGutterHeightSuggestion(
            depth,
            slope,
            targetOutput,
            railSystemSlope,
          );

    return {
      recommendedInput: Math.round(recommendedInput),
      newOutputRange: closestRange,
    };
  },
};

// Een factory-functie die een Zod-validatieschema creëert op basis van het formuliertype.
const createSchema = (
  t: ReturnType<typeof useTranslations>,
  formType: FormType,
) => {
  return z
    .object({
      depth: z.coerce.number({
        invalid_type_error: t("Form.Common.validationErrors.selectOption"),
      }),
      railSystemSlope: z.enum(["checked", "unchecked"], {
        invalid_type_error: t("Form.Common.validationErrors.selectOption"),
      }),
      slope: z.coerce
        .number({
          invalid_type_error: t("Form.Common.validationErrors.enterNumber"),
        })
        .int(t("Form.Common.validationErrors.integerOnly"))
        .optional(),
      wallProfileHeight: z.coerce
        .number({
          invalid_type_error: t(
            "Form.Common.validationErrors.validNumberRequired",
          ),
        })
        .int(t("Form.Common.validationErrors.integerOnly"))
        .optional(),
      heightBottomGutter: z.coerce
        .number({
          invalid_type_error: t(
            "Form.Common.validationErrors.validNumberRequired",
          ),
        })
        .int(t("Form.Common.validationErrors.integerOnly"))
        .optional(),
    })
    .superRefine((data, ctx) => {
      const field =
        formType === "wallProfile" ? "wallProfileHeight" : "heightBottomGutter";
      const mainInputValue = data[field];

      if (mainInputValue == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("Form.Common.validationErrors.validNumberRequired"),
          path: [field],
        });
        return;
      }
      if (data.depth == null || data.railSystemSlope == null) return;

      const slope = data.slope ?? 0;
      const calculatedOutput =
        formType === "wallProfile"
          ? calculator.calculateFromWallProfile(
              data.depth,
              slope,
              mainInputValue,
              data.railSystemSlope,
            )
          : calculator.calculateFromGutterHeight(
              data.depth,
              slope,
              mainInputValue,
              data.railSystemSlope,
            );

      const { inRange, range: closestRange } = calculator.checkRange(
        calculatedOutput,
        formType,
      );
      if (!inRange && closestRange) {
        if (formType === "wallProfile") {
          // Als de berekende waarde buiten de geldige bereiken valt, genereren we een proactieve suggestie.
          // Dit helpt de gebruiker om een correcte waarde in te voeren zonder te hoeven gokken.
          const suggestion = calculator.generateSuggestion(
            formType,
            data,
            calculatedOutput,
            closestRange,
          );
          if (suggestion) {
            const fieldName = t(
              "Form.Common.validationErrors.wallProfileHeightFieldName",
            );
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field],
              message: t("Form.Common.validationErrors.suggestionMessage", {
                fieldName,
                recommendedInput: suggestion.recommendedInput,
                min: suggestion.newOutputRange[0],
                max: suggestion.newOutputRange[1],
              }),
            });
          }
        }
      }
    });
};

// Custom hook voor de doorloophoogtecalculator.
// Beheert de state, validatie en berekeningslogica.
export function usePassageHeightCalculator(formType: FormType) {
  const t = useTranslations("Components");
  const schema = useMemo(() => createSchema(t, formType), [t, formType]);

  const calculateResult = (values: FormValues) => {
    const slope = values.slope ?? 0;

    if (formType === "wallProfile") {
      const validValues = values as ValidatedWallProfileForm;
      const passageHeight = calculator.calculateFromWallProfile(
        validValues.depth,
        slope,
        validValues.wallProfileHeight,
        validValues.railSystemSlope,
      );
      const { range } = calculator.checkRange(passageHeight, "wallProfile");
      return { output: passageHeight, topWallProfileHeight: null, range };
    } else {
      const validValues = values as ValidatedGutterHeightForm;
      const wallProfile = calculator.calculateFromGutterHeight(
        validValues.depth,
        slope,
        validValues.heightBottomGutter,
        validValues.railSystemSlope,
      );
      const topWallProfileHeight = Math.round(wallProfile + 150);
      const { range } = calculator.checkRange(wallProfile, "gutterHeight");
      return { output: wallProfile, topWallProfileHeight, range };
    }
  };

  const shouldShowFoundationWarning = (values: FormValues) => {
    // Only show warning for wall profile calculations
    if (formType !== "wallProfile") return false;

    // Check if all required values are present
    if (
      values.wallProfileHeight == null ||
      values.depth == null ||
      values.railSystemSlope == null
    ) {
      return false;
    }

    try {
      const result = calculateResult(values);
      return result.output > FOUNDATION_WARNING_THRESHOLD;
    } catch (error) {
      // If calculation fails, don't show warning
      return false;
    }
  };

  return { t, schema, config: CALCULATOR_CONFIG, calculateResult, shouldShowFoundationWarning };
}
