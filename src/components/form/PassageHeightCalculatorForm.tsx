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
import MeasuringHeightPaving from "/public/images/measuring-height-paving.jpg";
import MeasuringHeightRecessed from "/public/images/measuring-height-recessed.jpg";
import MeasuringSlope from "/public/images/measuring-slope.jpg";
import MeasuringWidthFront from "/public/images/measuring-width-front.jpg";
import MeasuringWidthSide from "/public/images/measuring-width-side.jpg";

// Configuration constants
const config = {
  depths: [2, 2.5, 3, 3.5, 4] as const,
  angle: (8 * Math.PI) / 180, // Convert to radians once
  adjustments: {
    depthPrimary: 4.59,
    depthSecondary: 7,
    wallToGutter: 1,
    railSlope: 18,
  },
  limits: {
    maxPassageHeight: 2500,
    wallProfile: { min: 2259, max: 3058 },
    gutterHeight: { min: 1701, max: 2500 },
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

interface Recommendation {
  recommendedInput: number;
  resultingOutputInRange: number;
  newOutputRange: [number, number];
}

interface Result {
  output: number | null;
  inRange: boolean;
  range: [number, number] | null;
  recommendation: Recommendation | null;
}

// Create form validation schema
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
      .min(
        config.limits.wallProfile.min,
        t("Form.WallProfileHeight.validationErrors.min", {
          min: config.limits.wallProfile.min,
        }),
      )
      .max(
        config.limits.wallProfile.max,
        t("Form.WallProfileHeight.validationErrors.max", {
          max: config.limits.wallProfile.max,
        }),
      )
      .optional(),
    heightBottomGutter: z.coerce
      .number({
        invalid_type_error: t(
          "Form.Common.validationErrors.validNumberRequired",
        ),
      })
      .int(t("Form.Common.validationErrors.integerOnly"))
      .min(
        config.limits.gutterHeight.min,
        t("Form.HeightBottomGutter.validationErrors.min", {
          min: config.limits.gutterHeight.min,
        }),
      )
      .max(
        config.limits.gutterHeight.max,
        t("Form.HeightBottomGutter.validationErrors.max", {
          max: config.limits.gutterHeight.max,
        }),
      )
      .optional(),
  });

  return baseSchema.superRefine((data, ctx) => {
    const field =
      formType === "wallProfile" ? "wallProfileHeight" : "heightBottomGutter";
    if (data[field] == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t("Form.Common.validationErrors.validNumberRequired"),
        path: [field],
      });
    }
  });
};

type FormValues = z.infer<ReturnType<typeof createSchema>>;

// Calculate core dimensions
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

// Apply rail system adjustment
const applyRailAdjustment = (value: number, railSlope: RailSlope) =>
  railSlope === "checked" ? value + config.adjustments.railSlope : value;

// Calculate passage height from wall profile
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

// Calculate wall profile from gutter height
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

// Check if output is within valid ranges
const checkRange = (value: number, formType: FormType) => {
  for (const [min, max] of config.ranges) {
    if (value >= min && value <= max) {
      if (formType === "wallProfile" && value > config.limits.maxPassageHeight)
        continue;
      return { inRange: true, range: [min, max] as [number, number] };
    }
  }

  // Find closest range
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

// Generate recommendation to get output in valid range
const generateRecommendation = (
  formType: FormType,
  values: FormValues,
  output: number,
): Recommendation | null => {
  const { range } = checkRange(output, formType);
  if (!range) return null;

  const target =
    output < range[0]
      ? range[0]
      : formType === "wallProfile"
        ? Math.min(range[1], config.limits.maxPassageHeight)
        : range[1];

  const { depth, slope = 0, railSystemSlope } = values;
  const { wallToGutterDiff, slopeDrop } = calculateDimensions(depth, slope);

  let recommendedInput: number;
  if (formType === "wallProfile") {
    recommendedInput = target + wallToGutterDiff - slopeDrop;
    if (railSystemSlope === "checked")
      recommendedInput -= config.adjustments.railSlope;
  } else {
    recommendedInput = target - wallToGutterDiff + slopeDrop;
    if (railSystemSlope === "checked")
      recommendedInput -= config.adjustments.railSlope;
  }

  const limits =
    formType === "wallProfile"
      ? config.limits.wallProfile
      : config.limits.gutterHeight;
  const clampedInput = Math.max(
    limits.min,
    Math.min(limits.max, Math.round(recommendedInput)),
  );

  const testOutput =
    formType === "wallProfile"
      ? calculateFromWallProfile(depth, slope, clampedInput, railSystemSlope)
      : calculateFromGutterHeight(depth, slope, clampedInput, railSystemSlope);

  const testResult = checkRange(testOutput, formType);

  return testResult.inRange && testResult.range
    ? {
        recommendedInput: clampedInput,
        resultingOutputInRange: testOutput,
        newOutputRange: testResult.range,
      }
    : null;
};

export function PassageHeightCalculatorForm({
  formType,
  mainInputLabelKey,
  mainInputPlaceholderKey,
  mainInputTooltipKey,
  submitButtonTextKey,
}: FormProps) {
  const t = useTranslations("Components");

  const [result, setResult] = useState<Result>({
    output: null,
    inRange: false,
    range: null,
    recommendation: null,
  });

  const constraints = useMemo(
    () =>
      formType === "wallProfile"
        ? config.limits.wallProfile
        : config.limits.gutterHeight,
    [formType],
  );

  const depthOptions = useMemo(
    () =>
      config.depths.map((d) => ({
        value: d.toString(),
        label: `${d} ${t("Form.Common.measurementUnitMeter")}`,
      })),
    [t],
  );

  const schema = useMemo(() => createSchema(t, formType), [t, formType]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { slope: 0 },
  });

  useEffect(() => {
    if (form.formState.isDirty && result.output !== null) {
      setResult({
        output: null,
        inRange: false,
        range: null,
        recommendation: null,
      });
    }
  }, [form.formState.isDirty, result.output]);

  // Handle form submission and calculations
  const handleSubmit = (values: FormValues) => {
    try {
      const output =
        formType === "wallProfile"
          ? calculateFromWallProfile(
              values.depth,
              values.slope ?? 0,
              values.wallProfileHeight!,
              values.railSystemSlope,
            )
          : calculateFromGutterHeight(
              values.depth,
              values.slope ?? 0,
              values.heightBottomGutter!,
              values.railSystemSlope,
            );

      const { inRange, range } = checkRange(output, formType);
      const recommendation = !inRange
        ? generateRecommendation(formType, values, output)
        : null;

      setResult({ output, inRange, range, recommendation });
      form.reset({ ...values });
    } catch (error) {
      setResult({
        output: null,
        inRange: false,
        range: null,
        recommendation: null,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <fieldset className="space-y-2">
                <div className="flex items-center space-x-1">
                  <FormLabel asChild>
                    <legend data-required>
                      <span>{t("Form.Common.depthVeranda")}</span>
                    </legend>
                  </FormLabel>
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
                </div>
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
                        className="ring-light-grey text-grey data-[state=checked]:ring-green data-[state=checked]:text-green rounded px-3 py-1.5 text-sm ring data-[state=checked]:font-semibold data-[state=checked]:ring-1"
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

        <FormField
          control={form.control}
          name="railSystemSlope"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel htmlFor="railSystemSlope-yes" data-required>
                  <span>{t("Form.WallProfileHeight.railSystemQuestion")}</span>
                </FormLabel>
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
              </div>
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

        <FormField
          control={form.control}
          name="slope"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel htmlFor="slope">
                  <span>{t("Form.Common.slope")}</span>
                </FormLabel>
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
              </div>
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
          name={
            formType === "wallProfile"
              ? "wallProfileHeight"
              : "heightBottomGutter"
          }
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel htmlFor={field.name} data-required>
                  <span>{t(mainInputLabelKey)}</span>
                </FormLabel>
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
              </div>
              <FormControl>
                <NumberInputWithUnit
                  id={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t(mainInputPlaceholderKey)}
                  unit={t("Form.Common.measurementUnitMm")}
                  min={constraints.min}
                  max={constraints.max}
                  aria-describedby={`${field.name}-error`}
                  isInvalid={fieldState.invalid}
                />
              </FormControl>
              <FormMessage id={`${field.name}-error`} />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={buttonVariants({ variant: "default", fullWidth: true })}
          disabled={!form.formState.isValid}
        >
          {t(submitButtonTextKey)}
        </Button>

        {result.output !== null && (
          <CalculationResultAlert
            t={t}
            formType={formType}
            calculatedOutput={result.output}
            isOutputInRange={result.inRange}
            outputRange={result.range}
            recommendation={result.recommendation}
          />
        )}
      </form>
    </Form>
  );
}
