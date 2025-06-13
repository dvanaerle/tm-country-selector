"use client";
import React, { useState, useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CalculationResultAlert } from "./CalculationResultAlert";
import {
  usePassageHeightCalculator,
  FormValues,
} from "@/hooks/usePassageHeightCalculator";
import { Step1_Depth } from "./steps/Step1_Depth";
import { Step2_RailSystem } from "./steps/Step2_RailSystem";
import { Step3_TerraceSlope } from "./steps/Step3_TerraceSlope";
import { Step4_HeightBottomWallProfile } from "./steps/Step4_HeightBottomWallProfile";

/** Het type berekening: muurprofiel of goothoogte. */
type FormType = "wallProfile" | "gutterHeight";

/** Props voor het formulier. */
interface FormProps {
  formType: FormType;
  mainInputLabelKey: string;
  mainInputPlaceholderKey: string;
  mainInputTooltipKey: string;
  submitButtonTextKey: string;
}

/** De structuur van het berekeningsresultaat. */
interface Result {
  output: number | null;
  topWallProfileHeight?: number | null;
  range: [number, number] | null;
}

/**
 * Orchestreert een meerstapsformulier voor het berekenen van de doorloophoogte of goothoogte.
 * Deze component beheert de staat van het formulier, de stappen en de weergave van het resultaat.
 */
export function PassageHeightCalculatorForm({
  formType,
  mainInputLabelKey,
  mainInputPlaceholderKey,
  mainInputTooltipKey,
  submitButtonTextKey,
}: FormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<Result>({
    output: null,
    topWallProfileHeight: null,
    range: null,
  });

  // Hook voor de berekeningslogica, schema en configuratie.
  const { t, schema, config, calculateResult } =
    usePassageHeightCalculator(formType);

  // Memoized opties voor de diepteselectie.
  const depthOptions = useMemo(
    () =>
      config.depths.map((d) => ({
        value: String(d),
        label: `${d} ${t("Form.Common.measurementUnitMeter")}`,
      })),
    [t, config.depths],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Bepaalt de naam van het hoofdveld op basis van het formuliertype.
  const mainFieldName = useMemo(
    () =>
      formType === "wallProfile" ? "wallProfileHeight" : "heightBottomGutter",
    [formType],
  );

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

  // Effect om het vorige resultaat te wissen wanneer het formulier wordt gewijzigd.
  useEffect(() => {
    if (formState.isDirty && result.output !== null) {
      setResult({ output: null, topWallProfileHeight: null, range: null });
    }
  }, [formState.isDirty, result.output]);

  /**
   * Verwerkt de formulierinzending, berekent het resultaat en reset het formulier.
   */
  const onSubmit = (values: FormValues) => {
    const newResult = calculateResult(values);
    setResult(newResult);
    form.reset({ ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleHookSubmit(onSubmit)} className="space-y-5">
        <Step1_Depth t={t} depthOptions={depthOptions} />
        <Step2_RailSystem t={t} disabled={currentStep < 2} />
        <Step3_TerraceSlope t={t} disabled={currentStep < 3} />
        <Step4_HeightBottomWallProfile
          t={t}
          disabled={currentStep < 3}
          formType={formType}
          mainFieldName={mainFieldName}
          mainInputLabelKey={mainInputLabelKey}
          mainInputPlaceholderKey={mainInputPlaceholderKey}
          mainInputTooltipKey={mainInputTooltipKey}
        />
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
