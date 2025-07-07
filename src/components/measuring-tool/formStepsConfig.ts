import { StaticImageData } from "next/image";
import MeasuringHeightRecessed from "/public/images/measuring-height-recessed.jpg";
import MeasuringSlope from "/public/images/measuring-slope.jpg";
import MeasuringHeightPaving from "/public/images/measuring-height-paving.jpg";
import ConfiguratorAngleDiagonalLeftA from "/public/images/configurator-angle-diagonal-left-a.jpg";
import ConfiguratorAngleDiagonalLeftB from "/public/images/configurator-angle-diagonal-left-b.jpg";

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
    captionKey?: string;
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
    labelKey: "Form.Common.depthVeranda",
    tooltipKey: "Form.Common.depthVerandaTooltip",
    images: [
      {
        src: ConfiguratorAngleDiagonalLeftA,
        alt: "Pages.MeasuringTool.MeasuringWidthSideAlt",
        captionKey: "Form.Common.MeasuringWidthSideCaption",
      },
      {
        src: ConfiguratorAngleDiagonalLeftB,
        alt: "Pages.MeasuringTool.MeasuringWidthFrontAlt",
        captionKey: "Form.Common.MeasuringWidthFrontCaption",
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
    labelKey: "Form.WallProfileHeight.railSystemQuestion",
    tooltipKey: "Form.WallProfileHeight.railSystemQuestionTooltip",
    images: [
      {
        src: MeasuringHeightRecessed,
        alt: "Pages.MeasuringTool.MeasuringHeightRecessedAlt",
        captionKey: "Form.WallProfileHeight.MeasuringHeightRecessedCaption",
      },
    ],
    disabledOnStep: 2,
  },
  {
    name: "slope",
    type: "number-input",
    labelKey: "Form.Common.slope",
    placeholderKey: "Form.Common.slopePlaceholder",
    tooltipKey: "Form.Common.slopeTooltip",
    images: [
      {
        src: MeasuringSlope,
        alt: "Pages.MeasuringTool.MeasuringSlopeAlt",
        captionKey: "Form.Common.MeasuringSlopeCaption",
      },
    ],
    unitKey: "Form.Common.measurementUnitMm",
    min: 0,
    disabledOnStep: 3,
  },
  {
    name: "wallProfileHeight",
    type: "number-input",
    labelKey: "Form.WallProfileHeight.label",
    placeholderKey: "Form.WallProfileHeight.placeholder",
    tooltipKey: "Form.WallProfileHeight.tooltip",
    images: [
      {
        src: MeasuringHeightPaving,
        alt: "Pages.MeasuringTool.MeasuringHeightPavingAlt",
        captionKey: "Form.WallProfileHeight.MeasuringHeightPavingCaption",
      },
    ],
    unitKey: "Form.Common.measurementUnitMm",
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
    labelKey: "Form.HeightBottomGutter.label",
    placeholderKey: "Form.HeightBottomGutter.placeholder",
    tooltipKey: "Form.HeightBottomGutter.tooltip",
    images: [
      {
        src: MeasuringHeightPaving,
        alt: "Pages.MeasuringTool.MeasuringHeightPavingAlt",
        captionKey: "Form.HeightBottomGutter.MeasuringHeightPavingCaption",
      },
    ],
    unitKey: "Form.Common.measurementUnitMm",
    min: 0,
    disabledOnStep: 3,
  },
];
