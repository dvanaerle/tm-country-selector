"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import measuringSlope from "/public/images/measuring-slope.jpg";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as RadioGroupCards from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import InformationLine from "../../../public/icons/MingCute/information_line.svg";
import CheckCircleLine from "../../../public/icons/MingCute/check_circle_line.svg";
import WarningLine from "../../../public/icons/MingCute/warning_line.svg";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { passageHeights } from "@/data/passageHeights";
import { depths, meterUnit } from "@/data/depths";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

const yesNoAnswers = [
  { id: "option-yes", value: "ja", label: "Ja" },
  { id: "option-no", value: "nee", label: "Nee" },
];

// Hook that returns true if the device likely uses a coarse pointer (touch)
function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(pointer: coarse)");
    setIsTouch(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}

export interface ResponsiveTooltipDialogProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  dialogTitle?: string;
}

// Renders a Tooltip on desktop and a Dialog on mobile.
export const ResponsiveTooltipDialog: React.FC<
  ResponsiveTooltipDialogProps
> = ({ trigger, children, dialogTitle = "Information" }) => {
  const isTouch = useIsTouch();

  if (isTouch) {
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription asChild>
              <div>{children}</div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription asChild>
            <div>{children}</div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const minWallProfileHeight = 2259;
const maxWallProfileHeight = 3278;

// Error messages for validation
const formSchema = (t: any) =>
  z.object({
    depth: z.coerce.number({
      invalid_type_error: t("Form.Common.validationErrors.selectOption"),
    }),
    railSystemSlope: z.enum(["ja", "nee"], {
      invalid_type_error: t("Form.Common.validationErrors.selectOption"),
    }),
    terraceSlope: z.coerce
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
        minWallProfileHeight,
        t("Form.WallProfileHeight.validationErrors.min", {
          min: minWallProfileHeight,
        }),
      )
      .max(
        maxWallProfileHeight,
        t("Form.WallProfileHeight.validationErrors.max", {
          max: maxWallProfileHeight,
        }),
      ),
  });
type FormValues = z.infer<ReturnType<typeof formSchema>>;

export function WallProfileHeightForm() {
  const t = useTranslations("Components");
  const [result, setResult] = useState<number | null>(null);
  const [inRange, setInRange] = useState<boolean>(false);
  const [selectedPassageRange, setSelectedPassageRange] = useState<
    [number, number] | null
  >(null);
  const [recommendedWallProfileHeight, setRecommendedWallProfileHeight] =
    useState<number | null>(null);

  // Predefined options for depth selection
  const depthOptions = depths.map((d) => ({
    value: d.toString(),
    label: `${d} ${t(meterUnit)}`,
  }));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    mode: "onChange", // Keep onChange mode for validation feedback
    defaultValues: {
      railSystemSlope: "nee",
      terraceSlope: 0,
    },
  });

  // Watch all form values to detect changes
  // We use form.formState.isDirty to check if any field has been changed by the user
  const isFormDirty = form.formState.isDirty;

  // Effect to reset result and inRange when form values change AFTER a submission
  useEffect(() => {
    // Only reset if a result was previously displayed AND the form has become dirty
    // This ensures the alert stays visible after submission until the user starts typing/changing
    if (result !== null && isFormDirty) {
      setResult(null);
      setInRange(false);
      setSelectedPassageRange(null);
      setRecommendedWallProfileHeight(null);
      // Optionally, you might want to reset isDirty state if you want the alert to reappear
      // immediately after a new submission without further changes.
      // However, for "disappear when user re-enters data", this is correct.
    }
  }, [isFormDirty, result]); // Depend on isFormDirty and result

  // Function to check if the calculated passage height falls within the predefined ranges
  function getPassageHeight(rash: number) {
    for (const [min, max] of passageHeights) {
      if (rash >= min && rash <= max) {
        return { inRange: true, range: [min, max] as [number, number] };
      }
    }
    return { inRange: false, range: null };
  }

  // Function to calculate passage height based on inputs
  const calculatePassageHeight = (
    depthM: number,
    terraceSlopeMm: number,
    wallProfile: number,
    railSystemSlope: "ja" | "nee",
  ): number => {
    const verandaDepthInside =
      depthM * Math.cos((8 * Math.PI) / 180) * 1000 + 4.59 + 7;
    const heightDiffWallToGutter =
      depthM * Math.sin((8 * Math.PI) / 180) * 1000 + 1;
    const gutterBottomNoSlope = wallProfile - heightDiffWallToGutter;
    const slopeAngleDeg =
      (180 / Math.PI) * Math.asin(terraceSlopeMm / verandaDepthInside);
    let gutterBottomWithSlope =
      verandaDepthInside * Math.sin((slopeAngleDeg * Math.PI) / 180) +
      gutterBottomNoSlope;

    if (railSystemSlope === "ja") {
      gutterBottomWithSlope += 18;
    }
    return Math.round(gutterBottomWithSlope);
  };

  function onSubmit(values: FormValues) {
    const finalResult = calculatePassageHeight(
      values.depth,
      values.terraceSlope ?? 0,
      values.wallProfileHeight,
      values.railSystemSlope,
    );
    setResult(finalResult);

    const { inRange, range } = getPassageHeight(finalResult);
    setInRange(inRange);
    setSelectedPassageRange(range);
    setRecommendedWallProfileHeight(null); // Reset recommendation on new submission

    if (!inRange) {
      // Find the closest valid range
      let closestRange: [number, number] | null = null;
      let minDiff = Infinity;

      for (const [min, max] of passageHeights) {
        const diffToMin = Math.abs(finalResult - min);
        const diffToMax = Math.abs(finalResult - max);
        const currentRangeDiff = Math.min(diffToMin, diffToMax);

        if (currentRangeDiff < minDiff) {
          minDiff = currentRangeDiff;
          closestRange = [min, max];
        }
      }

      if (closestRange) {
        let targetPassageHeight: number;
        // If current result is too low, aim for the lowest value of the closest range
        if (finalResult < closestRange[0]) {
          targetPassageHeight = closestRange[0];
        }
        // If current result is too high, aim for the highest value of the closest range
        else {
          targetPassageHeight = closestRange[1];
        }

        // Calculate the required wallProfileHeight to achieve the targetPassageHeight
        // B9 = B5 * SIN(RADIANS(B3)) + B8
        // B8 = B7 - B10
        // B9 = B5 * SIN(RADIANS(B3)) + (B7 - B10)
        // B7 = B9 - B5 * SIN(RADIANS(B3)) + B10

        const depthM = values.depth;
        const terraceSlopeMm = values.terraceSlope ?? 0;
        const railSystemSlope = values.railSystemSlope;

        const verandaDepthInside =
          depthM * Math.cos((8 * Math.PI) / 180) * 1000 + 4.59 + 7;
        const heightDiffWallToGutter =
          depthM * Math.sin((8 * Math.PI) / 180) * 1000 + 1;
        const slopeAngleDeg =
          (180 / Math.PI) * Math.asin(terraceSlopeMm / verandaDepthInside);

        let calculatedWallProfileHeight =
          targetPassageHeight -
          verandaDepthInside * Math.sin((slopeAngleDeg * Math.PI) / 180) +
          heightDiffWallToGutter;

        if (railSystemSlope === "ja") {
          calculatedWallProfileHeight -= 18;
        }

        let adjustedWallProfileHeight = Math.round(calculatedWallProfileHeight);

        // Ensure the recommended wallProfileHeight is within its valid bounds
        adjustedWallProfileHeight = Math.max(
          minWallProfileHeight,
          Math.min(maxWallProfileHeight, adjustedWallProfileHeight),
        );

        // Verify if the adjusted wallProfileHeight actually brings the passage height into a valid range
        const testPassageHeight = calculatePassageHeight(
          values.depth,
          values.terraceSlope ?? 0,
          adjustedWallProfileHeight,
          values.railSystemSlope,
        );

        const { inRange: testInRange, range: testRange } =
          getPassageHeight(testPassageHeight);

        if (testInRange) {
          setRecommendedWallProfileHeight(adjustedWallProfileHeight);
          setSelectedPassageRange(testRange); // Update selected range to the one the recommendation aims for
        } else {
          // If the calculated recommendation doesn't bring it into range (due to wall profile limits),
          // try to find the closest valid wall profile height that still moves it in the right direction.
          // This is a fallback for edge cases where the target passage height is unreachable.
          let bestWallProfile = values.wallProfileHeight;
          let smallestDiff = Math.abs(finalResult - targetPassageHeight);

          for (
            let i = minWallProfileHeight;
            i <= maxWallProfileHeight;
            i += 1
          ) {
            const currentTestPassageHeight = calculatePassageHeight(
              values.depth,
              values.terraceSlope ?? 0,
              i,
              values.railSystemSlope,
            );
            const currentDiff = Math.abs(
              currentTestPassageHeight - targetPassageHeight,
            );

            if (currentDiff < smallestDiff) {
              smallestDiff = currentDiff;
              bestWallProfile = i;
            }
          }
          const { inRange: finalTestInRange, range: finalTestRange } =
            getPassageHeight(
              calculatePassageHeight(
                values.depth,
                values.terraceSlope ?? 0,
                bestWallProfile,
                values.railSystemSlope,
              ),
            );
          if (finalTestInRange) {
            setRecommendedWallProfileHeight(bestWallProfile);
            setSelectedPassageRange(finalTestRange);
          } else {
            setRecommendedWallProfileHeight(null); // No valid recommendation found
          }
        }
      }
    }

    // After a successful submission, reset the dirty state
    // This is crucial so that the useEffect only triggers when the user *next* changes a field
    form.reset(values); // Resetting with current values marks form as not dirty
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Depth of veranda */}
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem>
              <fieldset className="space-y-2">
                <FormLabel asChild>
                  <legend className="flex items-center gap-x-1" data-required>
                    <span>{t("Form.Common.depthVeranda")}</span>
                    <ResponsiveTooltipDialog
                      trigger={
                        <button
                          type="button"
                          aria-label={t("Form.Common.moreInformation")}
                        >
                          <InformationLine className="size-4 shrink-0" />
                        </button>
                      }
                      dialogTitle={t("Form.Common.info")}
                    >
                      <Image
                        src={measuringSlope}
                        alt={t("a11y.imageAlt")}
                        priority
                        fetchPriority="high"
                        placeholder="blur"
                        className="rounded-sm"
                        sizes="
                 (min-width: 1536px) calc((1536px - 48px),
                 (min-width: 1280px) calc((1280px - 48px),
                 (min-width: 1024px) calc(1024px - 48px),
                 (min-width: 768px) calc(768px - 48px),
                 (min-width: 640px) calc(640px - 48px),
                 calc(100vw - 32px)"
                      />
                      {t("Form.Common.depthVerandaTooltip")}
                    </ResponsiveTooltipDialog>
                  </legend>
                </FormLabel>
                <FormControl>
                  <RadioGroupCards.Root
                    name={field.name}
                    className="flex flex-wrap gap-2"
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()} // Ensure default value is set
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

        {/* Railsysteem neerleggen */}
        <FormField
          control={form.control}
          name="railSystemSlope"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel htmlFor="railSystemSlope" data-required>
                  <span>{t("Form.WallProfileHeight.railSystemQuestion")}</span>
                </FormLabel>
                <ResponsiveTooltipDialog
                  trigger={
                    <button
                      type="button"
                      aria-label={t("Form.Common.moreInformation")}
                    >
                      <InformationLine className="size-4 shrink-0" />
                    </button>
                  }
                  dialogTitle={t("Form.Common.info")}
                >
                  {t("Form.Common.slopeTooltip")}
                </ResponsiveTooltipDialog>
              </div>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex space-x-4"
                >
                  {yesNoAnswers.map((answer) => (
                    <div
                      key={answer.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem value={answer.value} id={answer.id} />
                      <Label className="cursor-pointer" htmlFor={answer.id}>
                        {answer.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Afloop terras */}
        <FormField
          control={form.control}
          name="terraceSlope"
          render={({ fieldState, field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel htmlFor="terraceSlope">
                  <span>{t("Form.Common.slope")}</span>
                </FormLabel>
                <ResponsiveTooltipDialog
                  trigger={
                    <button
                      type="button"
                      aria-label={t("Form.Common.moreInformation")}
                    >
                      <InformationLine className="size-4 shrink-0" />
                    </button>
                  }
                  dialogTitle={t("Form.Common.info")}
                >
                  {t("Form.Common.slopeTooltip")}
                </ResponsiveTooltipDialog>
              </div>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    id="terraceSlope"
                    type="number"
                    step={1}
                    min={0}
                    placeholder={t("Form.Common.slopePlaceholder")}
                    className="pr-10"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value ?? ""}
                  />
                  <span className="text-grey absolute right-3 text-sm">
                    {t("Form.Common.measurementUnitMm")}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Hoogte muurprofiel */}
        <FormField
          control={form.control}
          name="wallProfileHeight"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex space-x-1">
                <FormLabel
                  className="gap-x-1"
                  htmlFor="wallProfileHeight"
                  data-required
                >
                  <span>{t("Form.WallProfileHeight.label")}</span>
                </FormLabel>
                <ResponsiveTooltipDialog
                  trigger={
                    <button
                      type="button"
                      aria-label={t("Form.Common.moreInformation")}
                    >
                      <InformationLine className="size-4 shrink-0" />
                    </button>
                  }
                  dialogTitle={t("Form.Common.info")}
                >
                  {t("Form.WallProfileHeight.tooltip", {
                    min: minWallProfileHeight,
                    max: maxWallProfileHeight,
                  })}
                </ResponsiveTooltipDialog>
              </div>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    id="wallProfileHeight"
                    type="number"
                    step={1}
                    min={minWallProfileHeight}
                    max={maxWallProfileHeight}
                    placeholder={t("Form.WallProfileHeight.placeholder")}
                    className="pr-10"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(e.target.value)}
                    value={field.value ?? ""}
                  />
                  <span className="absolute right-3 text-sm text-gray-500">
                    {t("Form.Common.measurementUnitMm")}
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bereken doorloophoogte */}
        <Button
          type="submit"
          className={buttonVariants({ variant: "default" })}
          disabled={!form.formState.isValid}
        >
          {t("Form.Common.calculatePassageHeight")}
        </Button>
        {result !== null && (
          <Alert variant={inRange ? "success" : "error"}>
            {inRange ? <CheckCircleLine /> : <WarningLine />}
            <AlertTitle>
              {t.rich("Form.Common.passageHeightResult", {
                result,
                strong: (chunks) => <strong>{chunks}</strong>,
              })}
            </AlertTitle>
            <AlertDescription>
              {inRange ? (
                <span>
                  {t.rich("Form.Common.rangeSuccess", {
                    within: t("Form.Common.rangeSuccessWithin"),
                    min: selectedPassageRange ? selectedPassageRange[0] : 0,
                    max: selectedPassageRange ? selectedPassageRange[1] : 0,
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </span>
              ) : (
                <>
                  <span>
                    {t.rich("Form.Common.rangeError", {
                      outside: t("Form.Common.rangeSuccessOutside"),
                      min: selectedPassageRange ? selectedPassageRange[0] : 0,
                      max: selectedPassageRange ? selectedPassageRange[1] : 0,
                      strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                  </span>
                  {recommendedWallProfileHeight !== null &&
                    selectedPassageRange && (
                      <p className="mt-2">
                        {t.rich("Form.WallProfileHeight.recommendation", {
                          currentResult: result,
                          recommendedWallProfileHeight:
                            recommendedWallProfileHeight,
                          min: selectedPassageRange[0],
                          max: selectedPassageRange[1],
                          strong: (chunks) => <strong>{chunks}</strong>,
                        })}
                      </p>
                    )}
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}
