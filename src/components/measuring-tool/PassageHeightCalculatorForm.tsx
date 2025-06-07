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
import { Step3_FinalInputs } from "./steps/Step3_FinalInputs";

type FormType = "wallProfile" | "gutterHeight";

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

// Orchestrates a multi-step form for calculating passage height.
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

  const { t, schema, config, calculateResult } =
    usePassageHeightCalculator(formType);

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

  // Effect to advance the form to the next step when a value is selected.
  useEffect(() => {
    if (watchedRailSlope !== undefined) setCurrentStep(3);
    else if (watchedDepth) setCurrentStep(2);
  }, [watchedDepth, watchedRailSlope]);

  // Effect to re-trigger validation on the main input when dependencies change.
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

  // Effect to clear the previous result when the form becomes dirty.
  useEffect(() => {
    if (formState.isDirty && result.output !== null) {
      setResult({ output: null, topWallProfileHeight: null, range: null });
    }
  }, [formState.isDirty, result.output]);

  const onSubmit = (values: FormValues) => {
    const newResult = calculateResult(values);
    setResult(newResult);
    form.reset({ ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleHookSubmit(onSubmit)} className="space-y-6">
        <Step1_Depth t={t} depthOptions={depthOptions} />
        <Step2_RailSystem t={t} disabled={currentStep < 2} />
        <Step3_FinalInputs
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
