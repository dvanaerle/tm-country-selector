"use client";

import React, { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as RadioGroupCards from "@radix-ui/react-radio-group";
import { useTranslations } from "next-intl";
import { InfoTooltipSheet } from "./InfoTooltipSheet";
import { NumberInputWithUnit } from "./NumberInputWithUnit";
import { YesNoRadioGroup } from "./YesNoRadioGroup";
import { CalculationResultAlert } from "./CalculationResultAlert";

// Configuration constants for veranda calculations
const verandaConfig = {
  depths: [2, 2.5, 3, 3.5, 4] as const,
  angleDegrees: 8,
  get angleRadians() {
    return (this.angleDegrees * Math.PI) / 180;
  },
  get cosineFactor() {
    return Math.cos(this.angleRadians);
  },
  get sineFactor() {
    return Math.sin(this.angleRadians);
  },
} as const;

// Constants used in passage height calculations
const calculationConstants = {
  internalDepthPrimaryAdjustment: 4.59,
  internalDepthSecondaryAdjustment: 7,
  wallToGutterHeightBaseAdjustment: 1,
  railSystemSlopeAdjustment: 18,
  maxPassageHeight: 2500,
  millimetersPerMeter: 1000,
} as const;

// Input validation constraints
const inputConstraints = {
  wallProfileHeight: { min: 2259, max: 3278 },
  gutterBottomHeight: { min: 1701, max: 2162 },
} as const;

// Standard passage height ranges according to Tuinmaximaal standards
const passageHeightRanges: readonly [number, number][] = [
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
] as const;

// Type definitions
type CalculatorFormType = "wallProfile" | "gutterHeight";
type RailSystemSlope = "checked" | "unchecked";

// Represents the calculated dimensions of a veranda
interface VerandaDimensions {
  verandaDepthInside: number;
  heightDiffWallToGutter: number;
  slopeDropActual: number;
}

// Props for the main calculator form component
interface PassageHeightCalculatorFormProps {
  formType: CalculatorFormType;
  mainInputLabelKey: string;
  mainInputPlaceholderKey: string;
  mainInputTooltipKey: string;
  submitButtonTextKey: string;
}

// Represents a recommendation for adjusting input values
interface Recommendation {
  recommendedInput: number;
  resultingOutputInRange: number;
  newOutputRange: [number, number];
}

// Status of whether a calculated value falls within acceptable ranges
interface StatusResult {
  inRange: boolean;
  range: [number, number] | null;
}

// Form validation schema factory
const createFormSchema = (t: any, formType: CalculatorFormType) => {
  const baseSchema = z.object({
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
      .min(
        inputConstraints.wallProfileHeight.min,
        t("Form.WallProfileHeight.validationErrors.min", {
          min: inputConstraints.wallProfileHeight.min,
        }),
      )
      .max(
        inputConstraints.wallProfileHeight.max,
        t("Form.WallProfileHeight.validationErrors.max", {
          max: inputConstraints.wallProfileHeight.max,
        }),
      )
      .optional(),
    gutterBottomHeight: z.coerce
      .number({
        invalid_type_error: t(
          "Form.Common.validationErrors.validNumberRequired",
        ),
      })
      .int(t("Form.Common.validationErrors.integerOnly"))
      .min(
        inputConstraints.gutterBottomHeight.min,
        t("Form.HeightLowerGutter.validationErrors.min", {
          min: inputConstraints.gutterBottomHeight.min,
        }),
      )
      .max(
        inputConstraints.gutterBottomHeight.max,
        t("Form.HeightLowerGutter.validationErrors.max", {
          max: inputConstraints.gutterBottomHeight.max,
        }),
      )
      .optional(),
  });

  return baseSchema.superRefine((data, ctx) => {
    const requiredField =
      formType === "wallProfile" ? "wallProfileHeight" : "gutterBottomHeight";
    const fieldValue = data[requiredField];

    if (fieldValue === undefined || fieldValue === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("Form.Common.validationErrors.validNumberRequired"),
        path: [requiredField],
      });
    }
  });
};

type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

// Calculates the slope angle and drop based on terrace slope and veranda depth
const calculateSlope = (
  verandaDepthInside: number,
  terraceSlopeMillimeters: number,
) => {
  const slopeRatio =
    verandaDepthInside === 0 ? 0 : terraceSlopeMillimeters / verandaDepthInside;
  const slopeAngleRad = Math.asin(Math.max(-1, Math.min(1, slopeRatio)));
  return {
    slopeAngleRad,
    slopeDropActual: verandaDepthInside * Math.sin(slopeAngleRad),
  };
};

// Calculates the internal dimensions of a veranda based on depth and slope
const calculateVerandaDimensions = (
  depthInMeters: number,
  terraceSlopeMillimeters: number,
): VerandaDimensions => {
  const verandaDepthInside =
    depthInMeters *
      verandaConfig.cosineFactor *
      calculationConstants.millimetersPerMeter +
    calculationConstants.internalDepthPrimaryAdjustment +
    calculationConstants.internalDepthSecondaryAdjustment;

  const heightDiffWallToGutter =
    depthInMeters *
      verandaConfig.sineFactor *
      calculationConstants.millimetersPerMeter +
    calculationConstants.wallToGutterHeightBaseAdjustment;

  const { slopeDropActual } = calculateSlope(
    verandaDepthInside,
    terraceSlopeMillimeters,
  );

  return { verandaDepthInside, heightDiffWallToGutter, slopeDropActual };
};

// Applies rail system slope adjustment if enabled
const applyRailSystemAdjustment = (
  value: number,
  railSystemSlope: RailSystemSlope,
): number => {
  if (railSystemSlope === "checked") {
    return value + calculationConstants.railSystemSlopeAdjustment;
  }
  return value;
};

// Calculates passage height from wall profile dimensions
const calculatePassageHeightFromWallProfile = (
  depthInMeters: number,
  terraceSlopeMillimeters: number,
  wallProfile: number,
  railSystemSlope: RailSystemSlope,
): number => {
  const { verandaDepthInside, heightDiffWallToGutter } =
    calculateVerandaDimensions(depthInMeters, terraceSlopeMillimeters);

  const gutterBottomNoSlope = wallProfile - heightDiffWallToGutter;
  const { slopeDropActual } = calculateSlope(
    verandaDepthInside,
    terraceSlopeMillimeters,
  );

  let gutterBottomWithSlope = gutterBottomNoSlope + slopeDropActual;
  gutterBottomWithSlope = applyRailSystemAdjustment(
    gutterBottomWithSlope,
    railSystemSlope,
  );

  return Math.round(gutterBottomWithSlope);
};

// Calculates wall profile from gutter height dimensions
const calculateWallProfileFromGutterHeight = (
  depthInMeters: number,
  terraceSlopeMillimeters: number,
  gutterBottom: number,
  railSystemSlope: RailSystemSlope,
): number => {
  const { heightDiffWallToGutter, slopeDropActual } =
    calculateVerandaDimensions(depthInMeters, terraceSlopeMillimeters);

  const wallProfileNoSlope = gutterBottom + heightDiffWallToGutter;
  let wallProfileWithSlope = wallProfileNoSlope - slopeDropActual;
  wallProfileWithSlope = applyRailSystemAdjustment(
    wallProfileWithSlope,
    railSystemSlope,
  );

  return Math.round(wallProfileWithSlope);
};

// Checks if a calculated value falls within standard ranges and maximum height constraints
const getPassageOutputStatus = (
  calculatedValue: number,
  standardRanges: readonly [number, number][],
): StatusResult => {
  // Check if value is within any standard range AND <= maxPassageHeight
  for (const [min, max] of standardRanges) {
    if (
      calculatedValue >= min &&
      calculatedValue <= max &&
      calculatedValue <= calculationConstants.maxPassageHeight
    ) {
      return { inRange: true, range: [min, max] };
    }
  }

  // Find closest range that could potentially meet the criteria
  const closestRange = findClosestValidRange(calculatedValue, standardRanges);
  return { inRange: false, range: closestRange };
};

// Finds the closest standard range that respects the maximum height constraint
const findClosestValidRange = (
  calculatedValue: number,
  standardRanges: readonly [number, number][],
): [number, number] | null => {
  let closestRange: [number, number] | null = null;
  let minDiff = Infinity;

  for (const currentRange of standardRanges) {
    const [min, max] = currentRange;

    if (min <= calculationConstants.maxPassageHeight) {
      const diffToMin = Math.abs(calculatedValue - min);
      const diffToMax = Math.abs(
        calculatedValue - Math.min(max, calculationConstants.maxPassageHeight),
      );
      const currentRangeDiff = Math.min(diffToMin, diffToMax);

      if (currentRangeDiff < minDiff) {
        minDiff = currentRangeDiff;
        closestRange = currentRange;
      }
    }
  }

  return closestRange;
};

// Determines the target output value for recommendations
const determineTargetOutput = (
  calculatedOutput: number,
  effectiveClosestOutputRange: [number, number],
): number => {
  if (calculatedOutput > calculationConstants.maxPassageHeight) {
    let targetOutputValue = Math.min(
      effectiveClosestOutputRange[1],
      calculationConstants.maxPassageHeight,
    );

    if (
      targetOutputValue < effectiveClosestOutputRange[0] &&
      effectiveClosestOutputRange[0] <= calculationConstants.maxPassageHeight
    ) {
      targetOutputValue = effectiveClosestOutputRange[0];
    }
    return targetOutputValue;
  }

  const targetOutputValue =
    calculatedOutput < effectiveClosestOutputRange[0]
      ? effectiveClosestOutputRange[0]
      : effectiveClosestOutputRange[1];

  return Math.min(targetOutputValue, calculationConstants.maxPassageHeight);
};

// Calculates the recommended input value for a given target output
const calculateRecommendedInput = (
  formType: CalculatorFormType,
  targetOutputValue: number,
  dimensions: VerandaDimensions,
  railSystemSlope: RailSystemSlope,
): number => {
  const { heightDiffWallToGutter, slopeDropActual } = dimensions;

  if (formType === "wallProfile") {
    let directRecommendation =
      targetOutputValue + heightDiffWallToGutter - slopeDropActual;
    return applyRailSystemAdjustment(directRecommendation, railSystemSlope);
  } else {
    let directRecommendation =
      targetOutputValue - heightDiffWallToGutter + slopeDropActual;
    return applyRailSystemAdjustment(directRecommendation, railSystemSlope);
  }
};

// Tests a recommended input value to verify it produces the expected output
const testRecommendation = (
  formType: CalculatorFormType,
  recommendedInput: number,
  depth: number,
  slope: number,
  railSystemSlope: RailSystemSlope,
): number => {
  return formType === "wallProfile"
    ? calculatePassageHeightFromWallProfile(
        depth,
        slope,
        recommendedInput,
        railSystemSlope,
      )
    : calculateWallProfileFromGutterHeight(
        depth,
        slope,
        recommendedInput,
        railSystemSlope,
      );
};

// Finds the best recommendation through iterative search
const findBestRecommendationByIteration = (
  formType: CalculatorFormType,
  currentValues: FormValues,
  targetOutputValue: number,
  constraints: { min: number; max: number },
): Recommendation | null => {
  const { depth, slope = 0, railSystemSlope } = currentValues;
  let bestRecommendation: Recommendation | null = null;
  let smallestDiff = Infinity;

  for (let i = constraints.min; i <= constraints.max; i++) {
    const iterativeOutput = testRecommendation(
      formType,
      i,
      depth,
      slope,
      railSystemSlope,
    );
    const { inRange, range } = getPassageOutputStatus(
      iterativeOutput,
      passageHeightRanges,
    );

    if (inRange && range) {
      const diff = Math.abs(iterativeOutput - targetOutputValue);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        bestRecommendation = {
          recommendedInput: i,
          resultingOutputInRange: iterativeOutput,
          newOutputRange: range,
        };
      }
    }
  }

  return bestRecommendation;
};

// Generates a recommendation for adjusting input values to achieve target output
const generateRecommendation = (
  formType: CalculatorFormType,
  currentValues: FormValues,
  calculatedOutput: number,
): Recommendation | null => {
  const { range: initialClosestOutputRange } = getPassageOutputStatus(
    calculatedOutput,
    passageHeightRanges,
  );

  // Determine effective range for recommendations
  let effectiveClosestOutputRange = initialClosestOutputRange;
  if (!effectiveClosestOutputRange) {
    const validRanges = passageHeightRanges.filter(
      ([min]) => min <= calculationConstants.maxPassageHeight,
    );

    if (validRanges.length > 0) {
      effectiveClosestOutputRange = validRanges.reduce(
        (prev, current) => (current[0] > prev[0] ? current : prev),
        validRanges[0],
      );
    } else {
      effectiveClosestOutputRange = [2480, 2500];
    }
  }

  if (!effectiveClosestOutputRange) return null;

  const targetOutputValue = determineTargetOutput(
    calculatedOutput,
    effectiveClosestOutputRange,
  );
  const { depth, slope = 0, railSystemSlope } = currentValues;
  const dimensions = calculateVerandaDimensions(depth, slope);

  const constraints =
    formType === "wallProfile"
      ? inputConstraints.wallProfileHeight
      : inputConstraints.gutterBottomHeight;

  // Try direct calculation first
  const directRecommendation = calculateRecommendedInput(
    formType,
    targetOutputValue,
    dimensions,
    railSystemSlope,
  );

  const clampedRecommendation = Math.max(
    constraints.min,
    Math.min(constraints.max, Math.round(directRecommendation)),
  );

  const testOutput = testRecommendation(
    formType,
    clampedRecommendation,
    depth,
    slope,
    railSystemSlope,
  );
  const { inRange: testInRange, range: testRange } = getPassageOutputStatus(
    testOutput,
    passageHeightRanges,
  );

  if (testInRange && testRange) {
    return {
      recommendedInput: clampedRecommendation,
      resultingOutputInRange: testOutput,
      newOutputRange: testRange,
    };
  }

  // Fallback to iterative search
  return findBestRecommendationByIteration(
    formType,
    currentValues,
    targetOutputValue,
    constraints,
  );
};

// Main calculator form component
export function PassageHeightCalculatorForm({
  formType,
  mainInputLabelKey,
  mainInputPlaceholderKey,
  mainInputTooltipKey,
  submitButtonTextKey,
}: PassageHeightCalculatorFormProps) {
  const t = useTranslations("Components");

  // State for calculation results
  const [calculationResult, setCalculationResult] = useState<{
    output: number | null;
    isInRange: boolean;
    range: [number, number] | null;
    recommendation: Recommendation | null;
  }>({
    output: null,
    isInRange: false,
    range: null,
    recommendation: null,
  });

  // Memoized values for performance
  const mainInputConstraints = useMemo(
    () =>
      formType === "wallProfile"
        ? inputConstraints.wallProfileHeight
        : inputConstraints.gutterBottomHeight,
    [formType],
  );

  const depthOptions = useMemo(
    () =>
      verandaConfig.depths.map((d) => ({
        value: d.toString(),
        label: `${d} ${t("Form.Common.measurementUnitMeter")}`,
      })),
    [t],
  );

  const formSchema = useMemo(
    () => createFormSchema(t, formType),
    [t, formType],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { slope: 0 },
  });

  // Reset calculation results when form is modified
  useEffect(() => {
    if (form.formState.isDirty && calculationResult.output !== null) {
      setCalculationResult({
        output: null,
        isInRange: false,
        range: null,
        recommendation: null,
      });
    }
  }, [form.formState.isDirty, calculationResult.output]);

  // Handles form submission and calculation
  const handleSubmit = (values: FormValues) => {
    const calculatedOutput =
      formType === "wallProfile"
        ? calculatePassageHeightFromWallProfile(
            values.depth,
            values.slope ?? 0,
            values.wallProfileHeight!,
            values.railSystemSlope,
          )
        : calculateWallProfileFromGutterHeight(
            values.depth,
            values.slope ?? 0,
            values.gutterBottomHeight!,
            values.railSystemSlope,
          );

    const { inRange, range } = getPassageOutputStatus(
      calculatedOutput,
      passageHeightRanges,
    );
    const needsRecommendation =
      !inRange || calculatedOutput > calculationConstants.maxPassageHeight;
    const recommendation = needsRecommendation
      ? generateRecommendation(formType, values, calculatedOutput)
      : null;

    setCalculationResult({
      output: calculatedOutput,
      isInRange:
        inRange && calculatedOutput <= calculationConstants.maxPassageHeight,
      range,
      recommendation,
    });

    // Reset form to clear dirty state
    form.reset({
      ...values,
      wallProfileHeight:
        formType === "wallProfile" ? values.wallProfileHeight : undefined,
      gutterBottomHeight:
        formType === "gutterHeight" ? values.gutterBottomHeight : undefined,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Depth Selection Field */}
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <fieldset className="space-y-2">
                <div className="flex items-center gap-x-2">
                  <FormLabel asChild>
                    <legend data-required>
                      <span>{t("Form.Common.depthVeranda")}</span>
                    </legend>
                  </FormLabel>
                  <InfoTooltipSheet
                    t={t}
                    titleKey="Form.Common.depthVeranda"
                    descriptionKey="Form.Common.depthVerandaTooltip"
                  />
                </div>
                <FormControl>
                  <RadioGroupCards.Root
                    name={field.name}
                    className="flex flex-wrap gap-2"
                    onValueChange={field.onChange}
                    value={field.value?.toString() ?? ""}
                  >
                    {depthOptions.map((option) => (
                      <RadioGroupCards.Item
                        key={option.value}
                        value={option.value}
                        className="ring-light-grey text-grey data-[state=checked]:ring-green data-[state=checked]:text-green rounded px-3 py-1.5 text-sm ring data-[state=checked]:font-semibold data-[state=checked]:ring-1"
                      >
                        <span>{option.label}</span>
                      </RadioGroupCards.Item>
                    ))}
                  </RadioGroupCards.Root>
                </FormControl>
                <FormMessage />
              </fieldset>
            </FormItem>
          )}
        />

        {/* Rail System Slope Field */}
        <FormField
          control={form.control}
          name="railSystemSlope"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-x-2">
                <FormLabel htmlFor="railSystemSlope-yes" data-required>
                  <span>{t("Form.WallProfileHeight.railSystemQuestion")}</span>
                </FormLabel>
                <InfoTooltipSheet
                  t={t}
                  titleKey="Form.WallProfileHeight.railSystemQuestion"
                  descriptionKey="Form.Common.slopeTooltip"
                />
              </div>
              <FormControl>
                <YesNoRadioGroup
                  id={field.name}
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  yesLabel={t("Form.Common.yes")}
                  noLabel={t("Form.Common.no")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slope Field */}
        <FormField
          control={form.control}
          name="slope"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center gap-x-2">
                <FormLabel htmlFor="slope">
                  <span>{t("Form.Common.slope")}</span>
                </FormLabel>
                <InfoTooltipSheet
                  t={t}
                  titleKey="Form.Common.slope"
                  descriptionKey="Form.Common.slopeTooltip"
                />
              </div>
              <FormControl>
                <NumberInputWithUnit
                  id="slope"
                  placeholder={t("Form.Common.slopePlaceholder")}
                  unit={t("Form.Common.measurementUnitMm")}
                  min={0}
                  value={field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Main Input Field */}
        <FormField
          control={form.control}
          name={
            formType === "wallProfile"
              ? "wallProfileHeight"
              : "gutterBottomHeight"
          }
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center gap-x-2">
                <FormLabel
                  htmlFor={
                    formType === "wallProfile"
                      ? "wallProfileHeight"
                      : "gutterBottomHeight"
                  }
                  data-required
                >
                  <span>{t(mainInputLabelKey)}</span>
                </FormLabel>
                <InfoTooltipSheet
                  t={t}
                  titleKey={mainInputLabelKey}
                  descriptionKey={mainInputTooltipKey}
                  descriptionValues={{
                    min: mainInputConstraints.min,
                    max: mainInputConstraints.max,
                  }}
                />
              </div>
              <FormControl>
                <NumberInputWithUnit
                  id={
                    formType === "wallProfile"
                      ? "wallProfileHeight"
                      : "gutterBottomHeight"
                  }
                  placeholder={t(mainInputPlaceholderKey)}
                  unit={t("Form.Common.measurementUnitMm")}
                  min={mainInputConstraints.min}
                  max={mainInputConstraints.max}
                  value={field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className={buttonVariants({ variant: "default", fullWidth: true })}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {t(submitButtonTextKey)}
        </Button>

        {/* Calculation Results */}
        {calculationResult.output !== null && (
          <CalculationResultAlert
            t={t}
            formType={formType}
            calculatedOutput={calculationResult.output}
            isOutputInRange={calculationResult.isInRange}
            outputRange={calculationResult.range}
            recommendation={calculationResult.recommendation}
          />
        )}
      </form>
    </Form>
  );
}
