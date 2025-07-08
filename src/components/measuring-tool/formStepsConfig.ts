import { StaticImageData } from "next/image";
import MeasuringHeightRecessed from "/public/images/measuring-height-recessed.jpg";
import MeasuringSlope from "/public/images/measuring-slope.jpg";
import MeasuringHeightPaving from "/public/images/measuring-height-paving.jpg";
import ConfiguratorAngleDiagonalLeftA from "/public/images/configurator-angle-diagonal-left-a.jpg";

export type FormStepType =
  | "radio-group"
  | "number-input"
  | "yes-no"
  | "custom"
  | "custom-select";

export interface FormStepConfig {
  name: string;
  type: FormStepType;
  labelKey: string;
  placeholderKey?: string;
  tooltipKey?: string;
  images?: {
    src: string | StaticImageData;
    alt: string;
  }[];
  options?: { value: string; labelKey: string }[];
  disabledOnStep?: number;
  unitKey?: string;
  min?: number;
  max?: number;
}

export const WALL_PROFILE_STEPS: FormStepConfig[] = [
  {
    name: "depth",
    type: "radio-group",
    labelKey: "Components.Form.Common.depthVeranda",
    tooltipKey: "Components.Form.Common.depthVerandaTooltip",
    images: [
      {
        src: ConfiguratorAngleDiagonalLeftA,
        alt: "Pages.MeasuringTool.a11y.measuringWidthSideAlt",
      },
    ],
    options: [
      { value: "2.5", labelKey: "2.5" },
      { value: "3", labelKey: "3" },
      { value: "3.5", labelKey: "3.5" },
      { value: "4", labelKey: "4" },
    ],
  },
  {
    name: "railSystemSlope",
    type: "yes-no",
    labelKey: "Components.Form.WallProfileHeight.railSystemQuestion",
    tooltipKey: "Components.Form.WallProfileHeight.railSystemQuestionTooltip",
    images: [
      {
        src: MeasuringHeightRecessed,
        alt: "Pages.MeasuringTool.a11y.measuringHeightRecessedAlt",
      },
    ],
    disabledOnStep: 2,
  },
  {
    name: "slope",
    type: "number-input",
    labelKey: "Components.Form.Common.slope",
    placeholderKey: "Components.Form.Common.slopePlaceholder",
    tooltipKey: "Components.Form.Common.slopeTooltip",
    images: [
      {
        src: MeasuringSlope,
        alt: "Pages.MeasuringTool.a11y.measuringSlopeAlt",
      },
    ],
    unitKey: "Components.Form.Common.measurementUnitMm",
    min: 0,
    disabledOnStep: 3,
  },
  {
    name: "wallProfileHeight",
    type: "number-input",
    labelKey: "Components.Form.WallProfileHeight.label",
    placeholderKey: "Components.Form.WallProfileHeight.placeholder",
    tooltipKey: "Components.Form.WallProfileHeight.tooltip",
    images: [
      {
        src: MeasuringHeightPaving,
        alt: "Pages.MeasuringTool.a11y.measuringHeightPavingAlt",
      },
    ],
    unitKey: "Components.Form.Common.measurementUnitMm",
    min: 0,
    disabledOnStep: 3,
  },
];

export const GUTTER_HEIGHT_STEPS: FormStepConfig[] = [
  { ...WALL_PROFILE_STEPS[0] },
  { ...WALL_PROFILE_STEPS[1] },
  { ...WALL_PROFILE_STEPS[2] },
  {
    name: "heightBottomGutter",
    type: "custom-select",
    labelKey: "Components.Form.HeightBottomGutter.label",
    placeholderKey: "Components.Form.HeightBottomGutter.placeholder",
    tooltipKey: "Components.Form.HeightBottomGutter.tooltip",
    images: [
      {
        src: MeasuringHeightPaving,
        alt: "Pages.MeasuringTool.a11y.measuringHeightPavingAlt",
      },
    ],
    unitKey: "Components.Form.Common.measurementUnitMm",
    min: 0,
    disabledOnStep: 3,
  },
];
