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

// Constants
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

const calculationConstants = {
  internalDepthPrimaryAdjustment: 4.59,
  internalDepthSecondaryAdjustment: 7,
  wallToGutterHeightBaseAdjustment: 1,
  railSystemSlopeAdjustment: 18,
} as const;

const inputConstraints = {
  wallProfileHeight: { min: 2259, max: 3278 },
  gutterBottomHeight: { min: 1701, max: 2162 },
} as const;

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

// Types
type CalculatorFormType = "wallProfile" | "gutterHeight";
type RailSystemSlope = "checked" | "unchecked";

interface VerandaDimensions {
  verandaDepthInside: number;
  heightDiffWallToGutter: number;
  slopeDropActual: number;
}

interface PassageHeightCalculatorFormProps {
  formType: CalculatorFormType;
  mainInputLabelKey: string;
  mainInputPlaceholderKey: string;
  mainInputTooltipKey: string;
  submitButtonTextKey: string;
}

interface Recommendation {
  recommendedInput: number;
  resultingOutputInRange: number;
  newOutputRange: [number, number];
}

interface StatusResult {
  inRange: boolean;
  range: [number, number] | null;
}

// Utility Functions
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

const calculateVerandaDimensions = (
  depthInMeters: number,
  terraceSlopeMillimeters: number,
): VerandaDimensions => {
  const verandaDepthInside =
    depthInMeters * verandaConfig.cosineFactor * 1000 +
    calculationConstants.internalDepthPrimaryAdjustment +
    calculationConstants.internalDepthSecondaryAdjustment;

  const heightDiffWallToGutter =
    depthInMeters * verandaConfig.sineFactor * 1000 +
    calculationConstants.wallToGutterHeightBaseAdjustment;

  const slopeRatio =
    verandaDepthInside === 0 ? 0 : terraceSlopeMillimeters / verandaDepthInside;
  const slopeAngleRad = Math.asin(Math.max(-1, Math.min(1, slopeRatio)));
  const slopeDropActual = verandaDepthInside * Math.sin(slopeAngleRad);

  return { verandaDepthInside, heightDiffWallToGutter, slopeDropActual };
};

const calculatePassageHeightFromWallProfile = (
  depthInMeters: number,
  terraceSlopeMillimeters: number,
  wallProfile: number,
  railSystemSlope: RailSystemSlope,
): number => {
  const { verandaDepthInside, heightDiffWallToGutter } =
    calculateVerandaDimensions(depthInMeters, terraceSlopeMillimeters);
  const gutterBottomNoSlope = wallProfile - heightDiffWallToGutter;

  const slopeRatio =
    verandaDepthInside === 0 ? 0 : terraceSlopeMillimeters / verandaDepthInside;
  const slopeAngleRad = Math.asin(Math.max(-1, Math.min(1, slopeRatio)));
  const currentSlopeDrop = verandaDepthInside * Math.sin(slopeAngleRad);

  let gutterBottomWithSlope = gutterBottomNoSlope + currentSlopeDrop;

  if (railSystemSlope === "checked") {
    gutterBottomWithSlope += calculationConstants.railSystemSlopeAdjustment;
  }

  return Math.round(gutterBottomWithSlope);
};

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

  if (railSystemSlope === "checked") {
    wallProfileWithSlope -= calculationConstants.railSystemSlopeAdjustment;
  }

  return Math.round(wallProfileWithSlope);
};

const getPassageOutputStatus = (
  calculatedValue: number,
  standardRanges: readonly [number, number][],
): StatusResult => {
  // Check if value is within any standard range
  for (const [min, max] of standardRanges) {
    if (calculatedValue >= min && calculatedValue <= max) {
      return { inRange: true, range: [min, max] };
    }
  }

  // Find closest range
  let closestRange: [number, number] | null = null;
  let minDiff = Infinity;

  for (const currentRange of standardRanges) {
    const [min, max] = currentRange;
    const diffToMin = Math.abs(calculatedValue - min);
    const diffToMax = Math.abs(calculatedValue - max);
    const currentRangeDiff = Math.min(diffToMin, diffToMax);

    if (currentRangeDiff < minDiff) {
      minDiff = currentRangeDiff;
      closestRange = currentRange;
    }
  }

  return { inRange: false, range: closestRange };
};

const generateRecommendation = (
  formType: CalculatorFormType,
  currentValues: FormValues,
  calculatedOutput: number,
): Recommendation | null => {
  const { range: closestOutputRange } = getPassageOutputStatus(
    calculatedOutput,
    passageHeightRanges,
  );
  if (!closestOutputRange) return null;

  const targetOutputValue =
    calculatedOutput < closestOutputRange[0]
      ? closestOutputRange[0]
      : closestOutputRange[1];

  const { depth, slope = 0, railSystemSlope } = currentValues;
  const { heightDiffWallToGutter, slopeDropActual } =
    calculateVerandaDimensions(depth, slope);

  const constraints =
    formType === "wallProfile"
      ? inputConstraints.wallProfileHeight
      : inputConstraints.gutterBottomHeight;

  // Try direct calculation first
  let directRecommendation: number;

  if (formType === "wallProfile") {
    directRecommendation =
      targetOutputValue + heightDiffWallToGutter - slopeDropActual;
    if (railSystemSlope === "checked") {
      directRecommendation -= calculationConstants.railSystemSlopeAdjustment;
    }
  } else {
    directRecommendation =
      targetOutputValue - heightDiffWallToGutter + slopeDropActual;
    if (railSystemSlope === "checked") {
      directRecommendation += calculationConstants.railSystemSlopeAdjustment;
    }
  }

  const clampedRecommendation = Math.max(
    constraints.min,
    Math.min(constraints.max, Math.round(directRecommendation)),
  );

  // Test the recommendation
  const testOutput =
    formType === "wallProfile"
      ? calculatePassageHeightFromWallProfile(
          depth,
          slope,
          clampedRecommendation,
          railSystemSlope,
        )
      : calculateWallProfileFromGutterHeight(
          depth,
          slope,
          clampedRecommendation,
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

  // Fallback: iterate through valid range to find best match
  let bestRecommendation: Recommendation | null = null;
  let smallestDiff = Infinity;

  for (let i = constraints.min; i <= constraints.max; i++) {
    const iterativeOutput =
      formType === "wallProfile"
        ? calculatePassageHeightFromWallProfile(
            depth,
            slope,
            i,
            railSystemSlope,
          )
        : calculateWallProfileFromGutterHeight(
            depth,
            slope,
            i,
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

// Main Component
export function PassageHeightCalculatorForm({
  formType,
  mainInputLabelKey,
  mainInputPlaceholderKey,
  mainInputTooltipKey,
  submitButtonTextKey,
}: PassageHeightCalculatorFormProps) {
  const t = useTranslations("Components");

  // State management
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
    const recommendation = inRange
      ? null
      : generateRecommendation(formType, values, calculatedOutput);

    setCalculationResult({
      output: calculatedOutput,
      isInRange: inRange,
      range,
      recommendation,
    });

    // Reset form with current values to clear dirty state
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
