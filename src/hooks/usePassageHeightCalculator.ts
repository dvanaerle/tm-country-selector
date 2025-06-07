import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";

// Configuration constants
const config = {
  depths: [2.5, 3, 3.5, 4] as const,
  angle: (8 * Math.PI) / 180, // Convert to radians once
  adjustments: {
    depthPrimary: 4.59,
    depthSecondary: 7,
    wallToGutter: 1,
    railSlope: 18,
  },
  limits: {
    maxPassageHeight: 2500,
  },
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

type FormType = "wallProfile" | "gutterHeight";
type RailSlope = "checked" | "unchecked";
export type FormValues = z.infer<ReturnType<typeof createSchema>>;

// Logic for calculations
const calculator = {
  calculateDimensions(depth: number, slope: number) {
    const cosAngle = Math.cos(config.angle);
    const sinAngle = Math.sin(config.angle);
    const insideDepth =
      depth * cosAngle * 1000 +
      config.adjustments.depthPrimary +
      config.adjustments.depthSecondary;
    const wallToGutterDiff =
      depth * sinAngle * 1000 + config.adjustments.wallToGutter;
    const slopeRatio = insideDepth > 0 ? slope / insideDepth : 0;
    const slopeDrop =
      insideDepth * Math.sin(Math.asin(Math.max(-1, Math.min(1, slopeRatio))));
    return { insideDepth, wallToGutterDiff, slopeDrop };
  },

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
        ? gutterHeight + config.adjustments.railSlope
        : gutterHeight;
    return Math.round(passageHeight);
  },

  calculateFromGutterHeight(
    depth: number,
    slope: number,
    targetPassageHeight: number,
    railSlope: RailSlope,
  ) {
    const targetGutterHeight =
      railSlope === "checked"
        ? targetPassageHeight - config.adjustments.railSlope
        : targetPassageHeight;
    const { wallToGutterDiff, slopeDrop } = this.calculateDimensions(
      depth,
      slope,
    );
    const wallProfile = targetGutterHeight + wallToGutterDiff + slopeDrop;
    return Math.round(wallProfile);
  },

  // DEDICATED SUGGESTION FUNCTION: The true mathematical inverse of calculateFromWallProfile.
  calculateInverseForWallProfileSuggestion(
    depth: number,
    slope: number,
    targetPassageHeight: number,
    railSlope: RailSlope,
  ) {
    const targetGutterHeight =
      railSlope === "checked"
        ? targetPassageHeight - config.adjustments.railSlope
        : targetPassageHeight;
    const { wallToGutterDiff, slopeDrop } = this.calculateDimensions(
      depth,
      slope,
    );
    // The true inverse must subtract slopeDrop.
    const wallProfile = targetGutterHeight + wallToGutterDiff - slopeDrop;
    return Math.round(wallProfile);
  },

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
        ? targetGutterHeight + config.adjustments.railSlope
        : targetGutterHeight;
    return Math.round(recommendedPassageHeight);
  },

  checkRange(value: number, formType: FormType) {
    for (const [min, max] of config.ranges) {
      if (value >= min && value <= max) {
        if (
          formType === "wallProfile" &&
          value > config.limits.maxPassageHeight
        )
          continue;
        return { inRange: true, range: [min, max] as [number, number] };
      }
    }
    let closest: [number, number] | null = null;
    let minDiff = Infinity;
    for (const range of config.ranges) {
      const [min, max] = range;
      if (formType === "wallProfile" && min > config.limits.maxPassageHeight)
        continue;
      const diff = Math.min(Math.abs(value - min), Math.abs(value - max));
      if (diff < minDiff) {
        minDiff = diff;
        closest = [min, max];
      }
    }
    return { inRange: false, range: closest };
  },

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
      targetOutput = Math.min(targetOutput, config.limits.maxPassageHeight);
    }

    // Now calls the correct dedicated inverse function for each form type.
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

// Zod schema factory
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
        const suggestion = calculator.generateSuggestion(
          formType,
          data,
          calculatedOutput,
          closestRange,
        );
        if (suggestion) {
          const fieldName =
            formType === "wallProfile"
              ? t("Form.Common.validationErrors.wallProfileHeightFieldName")
              : t("Form.Common.validationErrors.passageHeightFieldName");
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
    });
};

// The custom hook
export function usePassageHeightCalculator(formType: FormType) {
  const t = useTranslations("Components");
  const schema = useMemo(() => createSchema(t, formType), [t, formType]);

  const calculateResult = (values: FormValues) => {
    let output: number;
    let topWallProfileHeight: number | null = null;
    const slope = values.slope ?? 0;

    if (formType === "wallProfile") {
      output = calculator.calculateFromWallProfile(
        values.depth,
        slope,
        values.wallProfileHeight!,
        values.railSystemSlope,
      );
    } else {
      output = calculator.calculateFromGutterHeight(
        values.depth,
        slope,
        values.heightBottomGutter!,
        values.railSystemSlope,
      );
      const { wallToGutterDiff } = calculator.calculateDimensions(
        values.depth,
        slope,
      );
      topWallProfileHeight = Math.round(output + wallToGutterDiff);
    }

    const { range } = calculator.checkRange(output, formType);
    return { output, topWallProfileHeight, range };
  };

  return { t, schema, config, calculateResult };
}
