"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import * as RadioGroup from "@radix-ui/react-radio-group";
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const minGutterBottomHeight = 1701;
const maxGutterBottomHeight = 2162;

// Error messages for validation
const formSchema = (t: any) =>
  z.object({
    depth: z.coerce.number({
      invalid_type_error: t("Form.Common.validationErrors.selectOption"),
    }),
    slope: z.coerce
      .number({
        invalid_type_error: t("Form.Common.validationErrors.enterNumber"),
      })
      .int(t("Form.Common.validationErrors.integerOnly"))
      .optional(),
    gutterBottomHeight: z.coerce
      .number({
        invalid_type_error: t(
          "Form.Common.validationErrors.validNumberRequired",
        ),
      })
      .int(t("Form.Common.validationErrors.integerOnly"))
      .min(
        minGutterBottomHeight,
        t("Form.HeightLowerGutter.validationErrors.min", {
          min: minGutterBottomHeight,
        }),
      )
      .max(
        maxGutterBottomHeight,
        t("Form.HeightLowerGutter.validationErrors.max", {
          max: maxGutterBottomHeight,
        }),
      ),
  });
type FormValues = z.infer<ReturnType<typeof formSchema>>;

export function HeightLowerGutterForm() {
  const t = useTranslations("Components");
  const [result, setResult] = useState<number | null>(null);
  const [inRange, setInRange] = useState<boolean>(false);
  const [selectedPassageRange, setSelectedPassageRange] = useState<
    [number, number] | null
  >(null);

  // Predefined options for depth selection
  const depthOptions = depths.map((depth) => ({
    value: depth.toString(),
    label: `${depth} ${t(meterUnit)}`,
  }));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    mode: "onChange",
  });

  // Function to check if the calculated passage height falls within the predefined ranges
  function getPassageHeight(rash: number): {
    inRange: boolean;
    range: [number, number] | null;
    message?: React.ReactNode;
  } {
    for (const [min, max] of passageHeights) {
      if (rash >= min && rash <= max) {
        return {
          inRange: true,
          range: [min, max],
        };
      }
    }
    return {
      inRange: false,
      range: null,
    };
  }

  function onSubmit(values: FormValues) {
    // Inputs
    const depthM = values.depth; // F2
    const slopeMm = values.slope ?? 0; // F4
    const gutterBottom = values.gutterBottomHeight; // F10

    // F5 = F2 * COS(RADIANS(8)) * 1000 + 4.59 + 7
    const verandaDepthInside =
      depthM * Math.cos((8 * Math.PI) / 180) * 1000 + 4.59 + 7;

    // F9 = F2 * SIN(RADIANS(8)) * 1000 + 1
    const heightDiffWallToGutter =
      depthM * Math.sin((8 * Math.PI) / 180) * 1000 + 1;

    // F7 = F10 + F9
    const wallProfileNoSlope = gutterBottom + heightDiffWallToGutter;

    // F3 = DEGREES(ASIN(F4 / F5))
    const slopeAngleDeg =
      (180 / Math.PI) * Math.asin(slopeMm / verandaDepthInside);

    // F4 = F5 * SIN(RADIANS(F3))
    const slopeDropActual =
      verandaDepthInside * Math.sin((slopeAngleDeg * Math.PI) / 180);

    // F8 = wallProfileNoSlope + slopeDropActual
    const wallProfileWithSlope = wallProfileNoSlope + slopeDropActual;

    // Set result to F8
    const finalResult = Math.round(wallProfileWithSlope);
    setResult(finalResult);

    // Check if the result is within a recommended range
    const { inRange, range } = getPassageHeight(finalResult);
    setInRange(inRange);
    setSelectedPassageRange(range);
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
                        <button type="button">
                          <InformationLine
                            className="size-4 shrink-0"
                            aria-hidden="true"
                          />
                        </button>
                      }
                      dialogTitle={t("Form.Common.info")}
                    >
                      {t("Form.Common.depthVerandaTooltip")}
                    </ResponsiveTooltipDialog>
                  </legend>
                </FormLabel>
                <FormControl>
                  <RadioGroup.Root
                    name={field.name}
                    className="flex flex-wrap gap-2"
                    onValueChange={field.onChange}
                  >
                    {depthOptions.map((option) => (
                      <RadioGroup.Item
                        key={option.value}
                        value={option.value}
                        className="ring-light-grey text-grey data-[state=checked]:ring-green data-[state=checked]:text-green rounded px-3 py-1.5 text-sm ring data-[state=checked]:font-semibold data-[state=checked]:ring-1"
                      >
                        <span>{option.label}</span>
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup.Root>
                </FormControl>
                <FormMessage />
              </fieldset>
            </FormItem>
          )}
        />

        {/* Afloop terras */}
        <FormField
          control={form.control}
          name="slope"
          render={({ fieldState, field }) => (
            <FormItem>
              <div className="flex items-center space-x-1">
                <FormLabel htmlFor="slope">
                  <span>{t("Form.Common.slope")}</span>
                </FormLabel>
                <ResponsiveTooltipDialog
                  trigger={
                    <button type="button">
                      <InformationLine
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
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
                    id="slope"
                    type="number"
                    step={1}
                    min={0}
                    placeholder={t("Form.Common.slopePlaceholder")}
                    className="pr-10"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(e.target.value)}
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

        {/* Hoogte onderkant goot */}
        <FormField
          control={form.control}
          name="gutterBottomHeight"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex space-x-1">
                <FormLabel
                  className="gap-x-1"
                  htmlFor="gutterBottomHeight"
                  data-required
                >
                  <span>{t("Form.HeightLowerGutter.label")}</span>
                </FormLabel>
                <ResponsiveTooltipDialog
                  trigger={
                    <button type="button">
                      <InformationLine
                        className="size-4 shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  }
                  dialogTitle={t("Form.Common.info")}
                >
                  {t("Form.HeightLowerGutter.tooltip", {
                    min: minGutterBottomHeight,
                    max: maxGutterBottomHeight,
                  })}
                </ResponsiveTooltipDialog>
              </div>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    id="gutterBottomHeight"
                    type="number"
                    step={1}
                    min={minGutterBottomHeight}
                    max={maxGutterBottomHeight}
                    placeholder={t("Form.HeightLowerGutter.placeholder")}
                    aria-invalid={fieldState.invalid}
                    className="pr-10"
                    onChange={(e) => field.onChange(e.target.value)}
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
                <span>
                  {t.rich("Form.Common.rangeError", {
                    outside: t("Form.Common.rangeSuccessOutside"),
                    strong: (chunks) => <strong>{chunks}</strong>,
                  })}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Bereken doorloophoogte */}
        <Button
          type="submit"
          className={buttonVariants({ variant: "default" })}
          disabled={!form.formState.isValid}
        >
          {t("Form.Common.calculateBottomWallProfileHeight")}
        </Button>
      </form>
    </Form>
  );
}
