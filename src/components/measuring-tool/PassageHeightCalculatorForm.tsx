"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CalculationResultAlert } from "./CalculationResultAlert";
import { ResponsiveInfoTrigger } from "@/components/ui/responsive-info-trigger";
import {
  usePassageHeightCalculator,
  FormValues,
} from "@/hooks/usePassageHeightCalculator";
import { WALL_PROFILE_STEPS, GUTTER_HEIGHT_STEPS } from "./formStepsConfig";
import { FormStep } from "./FormStep";

// Het type berekening: muurprofiel of goothoogte.
type FormType = "wallProfile" | "gutterHeight";

// Props voor het formulier.
interface FormProps {
  formType: FormType;
  mainInputLabelKey: string;
  mainInputPlaceholderKey: string;
  mainInputTooltipKey: string;
  submitButtonTextKey: string;
}

// De structuur van het berekeningsresultaat.
interface Result {
  output: number | null;
  topWallProfileHeight?: number | null;
  range: [number, number] | null;
}

// Orchestreert een meerstapsformulier voor het berekenen van de doorloophoogte of goothoogte.
// Deze component beheert de staat van het formulier, de stappen en de weergave van het resultaat.
export function PassageHeightCalculatorForm({
  formType,
  submitButtonTextKey,
}: FormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<Result>({
    output: null,
    topWallProfileHeight: null,
    range: null,
  });

  // Hook voor de berekeningslogica, schema en configuratie.
  const { t, schema, calculateResult } = usePassageHeightCalculator(formType);
  const steps =
    formType === "wallProfile" ? WALL_PROFILE_STEPS : GUTTER_HEIGHT_STEPS;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    trigger,
    watch,
    getValues,
    formState,
    handleSubmit: handleHookSubmit,
  } = form;
  const watchedDepth = watch("depth");
  const watchedRailSlope = watch("railSystemSlope");
  const watchedSlope = watch("slope");

  // Effect om automatisch naar de volgende stap te gaan.
  useEffect(() => {
    if (watchedRailSlope !== undefined) setCurrentStep(3);
    else if (watchedDepth) setCurrentStep(2);
  }, [watchedDepth, watchedRailSlope]);

  // Effect om validatie opnieuw te triggeren wanneer afhankelijke velden veranderen.
  useEffect(() => {
    type FieldName =
      | "depth"
      | "railSystemSlope"
      | "slope"
      | "wallProfileHeight"
      | "heightBottomGutter";
    const mainField = steps[steps.length - 1].name as FieldName;
    if (getValues(mainField) != null) {
      trigger(mainField);
    }
  }, [watchedDepth, watchedRailSlope, watchedSlope, trigger, getValues, steps]);

  // Effect om het vorige resultaat te wissen wanneer het formulier wordt gewijzigd.
  useEffect(() => {
    if (formState.isDirty && result.output !== null) {
      setResult({ output: null, topWallProfileHeight: null, range: null });
    }
  }, [formState.isDirty, result.output]);

  // Verwerkt de formulierinzending, berekent het resultaat en reset het formulier.
  const onSubmit = (values: FormValues) => {
    const newResult = calculateResult(values);
    setResult(newResult);
    form.reset({ ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleHookSubmit(onSubmit)} className="space-y-6">
        <p className="text-muted-foreground bg-muted/40 rounded p-4 text-sm">
          {formType === "gutterHeight"
            ? t.rich("Form.WallProfileHeight.intro")
            : t.rich("Form.HeightBottomGutter.intro", {
                info: (chunks) => (
                  <ResponsiveInfoTrigger
                    triggerText={chunks}
                    title={t(
                      "Form.HeightBottomGutter.passageHeightTooltipTitle",
                    )}
                    content={t(
                      "Form.HeightBottomGutter.passageHeightTooltipDescription",
                    )}
                  />
                ),
                sup: () => <sup>®</sup>,
              })}
        </p>
        {steps.map((step) => (
          <FormStep
            key={step.name}
            config={step}
            t={t}
            disabled={
              step.disabledOnStep ? currentStep < step.disabledOnStep : false
            }
          />
        ))}
        <Button
          type="submit"
          className="w-full"
          disabled={currentStep < 3 || !formState.isValid}
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
