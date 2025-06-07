"use client";
import React, { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import MeasuringHeightPaving from "/public/images/measuring-height-paving.jpg";
import MeasuringHeightRecessed from "/public/images/measuring-height-recessed.jpg";
import MeasuringSlope from "/public/images/measuring-slope.jpg";
import MeasuringWidthFront from "/public/images/measuring-width-front.jpg";
import MeasuringWidthSide from "/public/images/measuring-width-side.jpg";

// Configuration constants
const config = {
  depths: [2.5, 3, 3.5, 4] as const,
  angle: (8 * Math.PI) / 180, // Convert to radians once
  adjustments: {
    depthPrimary: 4.59,
    depthSecondary: 7,
    wallToGutter: 1,
    railSlope: 18,
    wallProfileHeightDifference: 488,
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

interface FormProps {
  formType: FormType;
  mainInputLabelKey: string;
  mainInputPlaceholderKey: string;
  mainInputTooltipKey: string;
  submitButtonTextKey: string;
}

interface Result {
  output: number | null;
  topWallProfileHeight?: number | null;
  range: [number, number] | null;
}

const calculateDimensions = (depth: number, slope: number) => {
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
};

const applyRailAdjustment = (value: number, railSlope: RailSlope) =>
  railSlope === "checked" ? value + config.adjustments.railSlope : value;

const calculateFromWallProfile = (
  depth: number,
  slope: number,
  wallProfile: number,
  railSlope: RailSlope,
) => {
  const { wallToGutterDiff, slopeDrop } = calculateDimensions(depth, slope);
  const gutterHeight = wallProfile - wallToGutterDiff + slopeDrop;
  return Math.round(applyRailAdjustment(gutterHeight, railSlope));
};

const calculateFromGutterHeight = (
  depth: number,
  slope: number,
  gutterHeight: number,
  railSlope: RailSlope,
) => {
  const { wallToGutterDiff, slopeDrop } = calculateDimensions(depth, slope);
  const wallProfile = gutterHeight + wallToGutterDiff - slopeDrop;
  return Math.round(applyRailAdjustment(wallProfile, railSlope));
};

const checkRange = (value: number, formType: FormType) => {
  for (const [min, max] of config.ranges) {
    if (value >= min && value <= max) {
      if (formType === "wallProfile" && value > config.limits.maxPassageHeight)
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
};

type FormValues = z.infer<ReturnType<typeof createSchema>>;

const getWallProfileForPassageHeight = (
  targetPassageHeight: number,
  depth: number,
  slope: number,
  railSlope: RailSlope,
) => {
  const { wallToGutterDiff, slopeDrop } = calculateDimensions(depth, slope);
  let baseGutterHeight = targetPassageHeight;
  if (railSlope === "checked") {
    baseGutterHeight -= config.adjustments.railSlope;
  }
  return Math.round(baseGutterHeight + wallToGutterDiff - slopeDrop);
};

const getGutterHeightForWallProfile = (
  targetWallProfile: number,
  depth: number,
  slope: number,
  railSlope: RailSlope,
) => {
  const { wallToGutterDiff, slopeDrop } = calculateDimensions(depth, slope);
  let baseWallProfile = targetWallProfile;
  if (railSlope === "checked") {
    baseWallProfile -= config.adjustments.railSlope;
  }
  return Math.round(baseWallProfile - wallToGutterDiff + slopeDrop);
};

const getDynamicInputRange = (
  formType: FormType,
  depth: number,
  slope: number,
  railSystemSlope: RailSlope,
) => {
  const validInputs: number[] = [];
  const calculationRanges = config.ranges.filter((range) => {
    if (formType === "wallProfile") {
      return range[0] <= config.limits.maxPassageHeight;
    }
    return true;
  });

  for (const [minRange, maxRange] of calculationRanges) {
    if (formType === "wallProfile") {
      validInputs.push(
        getWallProfileForPassageHeight(minRange, depth, slope, railSystemSlope),
      );
      validInputs.push(
        getWallProfileForPassageHeight(maxRange, depth, slope, railSystemSlope),
      );
    } else {
      validInputs.push(
        getGutterHeightForWallProfile(minRange, depth, slope, railSystemSlope),
      );
      validInputs.push(
        getGutterHeightForWallProfile(maxRange, depth, slope, railSystemSlope),
      );
    }
  }

  if (validInputs.length === 0) return null;
  return { min: Math.min(...validInputs), max: Math.max(...validInputs) };
};

const generateSuggestion = (
  formType: FormType,
  data: FormValues,
  output: number,
  closestRange: [number, number],
) => {
  const { depth, slope = 0, railSystemSlope } = data;
  if (depth == null || railSystemSlope == null) {
    return null;
  }

  let targetOutput =
    output < closestRange[0] ? closestRange[0] : closestRange[1];

  // If calculating for a wall profile, the target passage height must not exceed the absolute maximum limit.
  if (formType === "wallProfile") {
    targetOutput = Math.min(targetOutput, config.limits.maxPassageHeight);
  }

  const recommendedInput =
    formType === "wallProfile"
      ? getWallProfileForPassageHeight(
          targetOutput,
          depth,
          slope,
          railSystemSlope,
        )
      : getGutterHeightForWallProfile(
          targetOutput,
          depth,
          slope,
          railSystemSlope,
        );

  return {
    recommendedInput: Math.round(recommendedInput),
    newOutputRange: closestRange,
  };
};

const createSchema = (
  t: ReturnType<typeof useTranslations>,
  formType: FormType,
) => {
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
      .optional(),
    heightBottomGutter: z.coerce
      .number({
        invalid_type_error: t(
          "Form.Common.validationErrors.validNumberRequired",
        ),
      })
      .int(t("Form.Common.validationErrors.integerOnly"))
      .optional(),
  });

  return baseSchema.superRefine((data, ctx) => {
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

    if (data.depth == null || data.railSystemSlope == null) {
      return;
    }

    const slope = data.slope ?? 0;
    const calculatedOutput =
      formType === "wallProfile"
        ? calculateFromWallProfile(
            data.depth,
            slope,
            mainInputValue,
            data.railSystemSlope,
          )
        : calculateFromGutterHeight(
            data.depth,
            slope,
            mainInputValue,
            data.railSystemSlope,
          );

    const { inRange, range: closestRange } = checkRange(
      calculatedOutput,
      formType,
    );

    if (!inRange) {
      if (closestRange) {
        const suggestion = generateSuggestion(
          formType,
          data as FormValues,
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
              fieldName: fieldName,
              recommendedInput: suggestion.recommendedInput,
              min: suggestion.newOutputRange[0],
              max: suggestion.newOutputRange[1],
            }),
          });
          return;
        }
      }

      const dynamicRange = getDynamicInputRange(
        formType,
        data.depth,
        slope,
        data.railSystemSlope,
      );
      if (dynamicRange) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [field],
          message: t("Form.Common.validationErrors.dynamicRangeMessage", {
            min: dynamicRange.min,
            max: dynamicRange.max,
          }),
        });
      }
    }
  });
};

export function PassageHeightCalculatorForm({
  formType,
  mainInputLabelKey,
  mainInputPlaceholderKey,
  mainInputTooltipKey,
  submitButtonTextKey,
}: FormProps) {
  const t = useTranslations("Components");

  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<Result>({
    output: null,
    topWallProfileHeight: null,
    range: null,
  });

  const depthOptions = useMemo(
    () =>
      config.depths.map((d) => ({
        value: String(d),
        label: `${d} ${t("Form.Common.measurementUnitMeter")}`,
      })),
    [t],
  );

  const schema = useMemo(() => createSchema(t, formType), [t, formType]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const mainFieldName = useMemo(
    () =>
      formType === "wallProfile" ? "wallProfileHeight" : "heightBottomGutter",
    [formType],
  );

  const { trigger, watch, getValues } = form;
  const watchedDepth = watch("depth");
  const watchedRailSlope = watch("railSystemSlope");
  const watchedSlope = watch("slope");

  useEffect(() => {
    // Re-validate the main field if its dependencies change
    if (getValues(mainFieldName) != null) {
      trigger(mainFieldName);
    }
  }, [
    watchedDepth,
    watchedRailSlope,
    watchedSlope,
    mainFieldName,
    trigger,
    getValues,
  ]);

  useEffect(() => {
    if (watchedDepth && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [watchedDepth, currentStep]);

  useEffect(() => {
    if (watchedRailSlope && currentStep === 2) {
      setCurrentStep(3);
    }
  }, [watchedRailSlope, currentStep]);

  useEffect(() => {
    // Clear the result when the form becomes dirty after a submission
    if (form.formState.isDirty && result.output !== null) {
      setResult({
        output: null,
        topWallProfileHeight: null,
        range: null,
      });
    }
  }, [form.formState.isDirty, result.output]);

  const handleSubmit = (values: FormValues) => {
    let output: number;
    let topWallProfileHeight: number | null = null;

    if (formType === "wallProfile") {
      output = calculateFromWallProfile(
        values.depth,
        values.slope ?? 0,
        values.wallProfileHeight!,
        values.railSystemSlope,
      );
    } else {
      output = calculateFromGutterHeight(
        values.depth,
        values.slope ?? 0,
        values.heightBottomGutter!,
        values.railSystemSlope,
      );
      topWallProfileHeight =
        output + config.adjustments.wallProfileHeightDifference;
    }

    const { range } = checkRange(output, formType);

    setResult({
      output,
      topWallProfileHeight,
      range,
    });
    // Reset the form state to pristine with the current values
    form.reset({ ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Step 1: Veranda Depth */}
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <fieldset className="space-y-2">
                <FormLabel asChild>
                  <legend data-required className="flex items-center gap-x-1">
                    <span>{t("Form.Common.depthVeranda")}</span>
                    <InfoTooltipSheet
                      t={t}
                      titleKey="Form.Common.depthVeranda"
                      descriptionKey="Form.Common.depthVerandaTooltip"
                      images={[
                        {
                          src: MeasuringWidthFront,
                          alt: "Pages.MeasuringTool.MeasuringWidthFrontAlt",
                          captionKey: "Form.Common.MeasuringWidthFrontCaption",
                        },
                        {
                          src: MeasuringWidthSide,
                          alt: "Pages.MeasuringTool.MeasuringWidthSideAlt",
                          captionKey: "Form.Common.MeasuringWidthSideCaption",
                        },
                      ]}
                    />
                  </legend>
                </FormLabel>
                <FormControl>
                  <RadioGroupCards.Root
                    name={field.name}
                    className="flex flex-wrap gap-2"
                    onValueChange={field.onChange}
                    value={field.value?.toString() ?? ""}
                    aria-describedby={`${field.name}-error`}
                  >
                    {depthOptions.map((option) => (
                      <RadioGroupCards.Item
                        key={option.value}
                        value={option.value}
                        className="focus-visible:ring-grey/50 border-light-grey data-[state=checked]:text-green text-grey data-[state=checked]:border-green focus-visible:border-green rounded border px-3 py-1.5 text-sm outline-none focus-visible:ring-2 data-[state=checked]:font-semibold"
                      >
                        <span>{option.label}</span>
                      </RadioGroupCards.Item>
                    ))}
                  </RadioGroupCards.Root>
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </fieldset>
            </FormItem>
          )}
        />

        {/* Step 2: Rail System Slope */}
        <fieldset
          disabled={currentStep < 2}
          className="group transition-opacity duration-300"
        >
          <FormField
            control={form.control}
            name="railSystemSlope"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="railSystemSlope-yes"
                  data-required
                  className="flex items-center gap-x-1 transition-opacity group-disabled:opacity-50"
                >
                  <span>{t("Form.WallProfileHeight.railSystemQuestion")}</span>
                  <InfoTooltipSheet
                    t={t}
                    titleKey="Form.WallProfileHeight.railSystemQuestion"
                    descriptionKey="Form.Common.slopeTooltip"
                    images={[
                      {
                        src: MeasuringHeightRecessed,
                        alt: "Pages.MeasuringTool.MeasuringHeightRecessedAlt",
                        captionKey:
                          "Form.WallProfileHeight.MeasuringHeightRecessedCaption",
                      },
                    ]}
                  />
                </FormLabel>
                <FormControl>
                  <YesNoRadioGroup
                    id={field.name}
                    name={field.name}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    yesLabel={t("Form.Common.yes")}
                    noLabel={t("Form.Common.no")}
                    aria-describedby={`${field.name}-error`}
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />
        </fieldset>

        {/* Step 3: Final Inputs (Slope, Height, and Submit) */}
        <fieldset
          disabled={currentStep < 3}
          className="group space-y-6 transition-opacity duration-300"
        >
          <FormField
            control={form.control}
            name="slope"
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  htmlFor="slope"
                  className="flex items-center gap-x-1 transition-opacity group-disabled:opacity-50"
                >
                  <span>{t("Form.Common.slope")}</span>
                  <InfoTooltipSheet
                    t={t}
                    titleKey="Form.Common.slope"
                    descriptionKey="Form.Common.slopeTooltip"
                    images={[
                      {
                        src: MeasuringSlope,
                        alt: "Pages.MeasuringTool.MeasuringSlopeAlt",
                        captionKey: "Form.Common.MeasuringSlopeCaption",
                      },
                    ]}
                  />
                </FormLabel>
                <FormControl>
                  <NumberInputWithUnit
                    id="slope"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("Form.Common.slopePlaceholder")}
                    unit={t("Form.Common.measurementUnitMm")}
                    aria-describedby={`${field.name}-error`}
                    min={0}
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={mainFieldName}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  htmlFor={field.name}
                  data-required
                  className="flex items-center gap-x-1 transition-opacity group-disabled:opacity-50"
                >
                  <span>{t(mainInputLabelKey)}</span>
                  <InfoTooltipSheet
                    t={t}
                    titleKey={mainInputLabelKey}
                    descriptionKey={mainInputTooltipKey}
                    images={[
                      {
                        src:
                          formType === "wallProfile"
                            ? MeasuringHeightPaving
                            : MeasuringHeightRecessed,
                        alt:
                          formType === "wallProfile"
                            ? "Pages.MeasuringTool.MeasuringHeightPavingAlt"
                            : "Pages.MeasuringTool.MeasuringHeightRecessedAlt",
                        captionKey:
                          "Form.WallProfileHeight.MeasuringHeightPavingCaption",
                      },
                    ]}
                  />
                </FormLabel>
                <FormControl>
                  <NumberInputWithUnit
                    id={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t(mainInputPlaceholderKey)}
                    min={0}
                    unit={t("Form.Common.measurementUnitMm")}
                    aria-describedby={`${field.name}-error`}
                    isInvalid={fieldState.invalid}
                  />
                </FormControl>
                <FormMessage id={`${field.name}-error`} />
              </FormItem>
            )}
          />
        </fieldset>

        <Button
          type="submit"
          className="w-full"
          disabled={currentStep < 3 || !form.formState.isValid}
        >
          {t(submitButtonTextKey)}
        </Button>

        {result.output !== null && (
          <CalculationResultAlert
            t={t}
            formType={formType}
            calculatedOutput={result.output}
            outputRange={result.range}
            topWallProfileHeight={result.topWallProfileHeight}
          />
        )}
      </form>
    </Form>
  );
}
