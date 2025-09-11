const recipesIndex = "export const recipes = {};";

const slotRecipesIndex = "export const slotRecipes = {};";

const animationUtilities = `import { type PropertyConfig } from "@pandacss/dev";

export const animation: Record<string, PropertyConfig> = {
  animateIn: {
    className: "animate_in",
    values: { type: "boolean" },
    transform: (value: boolean, { token }) => {
      if (!value) return {};

      return {
        animationName: "enter",
        animationDuration: token("durations.fast"),
        "--panda-enter-opacity": "initial",
        "--panda-enter-scale": "initial",
        "--panda-enter-rotate": "initial",
        "--panda-enter-translate-x": "initial",
        "--panda-enter-translate-y": "initial",
      };
    },
  },
  animateOut: {
    className: "animate_out",
    values: { type: "boolean" },
    transform: (value: boolean, { token }) => {
      if (!value) return {};

      return {
        animationName: "exit",
        animationDuration: token("durations.fast"),
        "--panda-enter-opacity": "initial",
        "--panda-enter-scale": "initial",
        "--panda-enter-rotate": "initial",
        "--panda-enter-translate-x": "initial",
        "--panda-enter-translate-y": "initial",
      };
    },
  },
  fadeIn: {
    className: "animate_fade_in",
    values: "opacity",
    transform: (value: number | string) => {
      return {
        "--panda-enter-opacity": value,
      };
    },
  },
  fadeOut: {
    className: "animate_fade_out",
    values: "opacity",
    transform: (value: number | string) => {
      return {
        "--panda-exit-opacity": value,
      };
    },
  },
  zoomIn: {
    className: "animate_zoom_in",
    transform: (value: number | string) => {
      return {
        "--panda-enter-scale": Number(value) / 100,
      };
    },
  },
  zoomOut: {
    className: "animate_zoom_out",
    transform: (value: number | string) => {
      return {
        "--panda-exit-scale": Number(value) / 100,
      };
    },
  },
  spinIn: {
    className: "animate_spin_in",
    transform: (value: number | string) => {
      return {
        "--panda-enter-rotate": value,
      };
    },
  },
  spinOut: {
    className: "animate_spin_out",
    transform: (value: number | string) => {
      return {
        "--panda-exit-rotate": value,
      };
    },
  },
  slideInFromTop: {
    className: "animate_slide_in_from_top",
    values: "spacing",
    transform: (value: number | string) => {
      return {
        "--panda-enter-translate-y": \`calc(\${value} * -1)\`,
      };
    },
  },
  slideInFromBottom: {
    className: "animate_slide_in_from_bottom",
    values: "spacing",
    transform: (value: number | string) => {
      return {
        "--panda-enter-translate-y": value,
      };
    },
  },
  slideInFromLeft: {
    className: "animate_slide_in_from_left",
    values: "spacing",
    transform: (value: number | string) => {
      return {
        "--panda-enter-translate-x": \`calc(\${value} * -1)\`,
      };
    },
  },
  slideInFromRight: {
    className: "animate_slide_in_from_right",
    values: "spacing",
    transform: (value: number | string) => {
      return {
        "--panda-enter-translate-x": value,
      };
    },
  },
  slideOutToTop: {
    className: "animate_slide_out_to_top",
    values: "spacing",
    transform: (value: number | string) => {
      return {
        "--panda-exit-translate-y": \`calc(\${value} * -1)\`,
      };
    },
  },
  slideOutToBottom: {
    className: "animate_slide_out_to_bottom",
    values: "spacing",
    transform: (value: number | string) => {
      return {
        "--panda-exit-translate-y": value,
      };
    },
  },
  slideOutToLeft: {
    className: "animate_slide_out_to_left",
    values: "spacing",
    transform: (value: number | string) => {
      return {
        "--panda-exit-translate-x": \`calc(\${value} * -1)\`,
      };
    },
  },
  slideOutToRight: {
    className: "animate_slide_out_to_right",
    values: "spacing",
    transform: (value: number | string) => {
      return {
        "--panda-exit-translate-x": value,
      };
    },
  },
};`;

const utilitiesIndex = `import { animation } from "./animation";

export const utilities = Object.assign({}, animation);
`;

const presetIndex = `import { definePreset } from "@pandacss/dev";
import { keyframes } from "./keyframes";
import { recipes } from "./recipes";
import { semanticTokens } from "./semantic-tokens";
import { slotRecipes } from "./slot-recipes";
import { utilities } from "./utilities";

const preset = definePreset({
  name: "nore-ui",
  presets: ["@pandacss/preset-panda"],
  globalCss: {
    html: {
      "--global-color-border": "colors.border",
    },
    body: {
      bg: "bg",
      color: "fg",
    },
    button: {
      cursor: "pointer",
    },
  },
  theme: {
    extend: {
      semanticTokens,
      keyframes,
    },
    recipes,
    slotRecipes,
  },
  utilities: {
    extend: utilities,
  },
});

export default preset;
`;

const keyframes = `import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
  enter: {
    from: {
      opacity: "var(--panda-enter-opacity, 1)",
      transform:
        "translate3d(var(--panda-enter-translate-x, 0), var(--panda-enter-translate-y, 0), 0) scale3d(var(--panda-enter-scale, 1), var(--panda-enter-scale, 1), var(--panda-enter-scale, 1)) rotate(var(--panda-enter-rotate, 0))",
    },
  },
  exit: {
    to: {
      opacity: "var(--panda-exit-opacity, 1)",
      transform:
        "translate3d(var(--panda-exit-translate-x, 0), var(--panda-exit-translate-y, 0), 0) scale3d(var(--panda-exit-scale, 1), var(--panda-exit-scale, 1), var(--panda-exit-scale, 1)) rotate(var(--panda-exit-rotate, 0))",
    },
  },
});
`;

const semanticTokens = `import { defineSemanticTokens } from "@pandacss/dev";

export const semanticTokens = defineSemanticTokens({
  colors: {
    bg: { value: { base: "{colors.white}", _dark: "{colors.neutral.950}" } },
    fg: { value: { base: "{colors.neutral.950}", _dark: "{colors.neutral.50}" } },
    primary: {
      DEFAULT: { value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.100}" } },
      fg: { value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.900}" } },
    },
    secondary: {
      DEFAULT: { value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.800}" } },
      fg: { value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.50}" } },
    },
    accent: {
      DEFAULT: { value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.800}" } },
      fg: { value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.50}" } },
    },
    muted: {
      DEFAULT: { value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.800}" } },
      fg: { value: { base: "{colors.neutral.500}", _dark: "{colors.neutral.400}" } },
    },
    danger: {
      DEFAULT: { value: { base: "{colors.red.500}", _dark: "{colors.red.400}" } },
      fg: { value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.900}" } },
    },
    card: {
      DEFAULT: { value: { base: "{colors.white}", _dark: "{colors.neutral.900}" } },
      fg: { value: { base: "{colors.neutral.950}", _dark: "{colors.neutral.50}" } },
    },
    popover: {
      DEFAULT: { value: { base: "{colors.white}", _dark: "{colors.neutral.900}" } },
      fg: { value: { base: "{colors.neutral.950}", _dark: "{colors.neutral.50}" } },
    },
    border: { value: { base: "{colors.neutral.200}", _dark: "{colors.neutral.800}" } },
    input: { value: { base: "{colors.neutral.200}", _dark: "{colors.neutral.800}" } },
    ring: { value: { base: "{colors.neutral.400}", _dark: "{colors.neutral.600}" } },
    chart: {
      1: { value: { base: "{colors.orange.500}", _dark: "{colors.blue.400}" } },
      2: { value: { base: "{colors.cyan.500}", _dark: "{colors.green.400}" } },
      3: { value: { base: "{colors.blue.700}", _dark: "{colors.yellow.400}" } },
      4: { value: { base: "{colors.yellow.400}", _dark: "{colors.purple.400}" } },
      5: { value: { base: "{colors.yellow.500}", _dark: "{colors.red.400}" } },
    },
    sidebar: {
      DEFAULT: { value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.900}" } },
      fg: { value: { base: "{colors.neutral.950}", _dark: "{colors.neutral.50}" } },
      primary: {
        DEFAULT: { value: { base: "{colors.neutral.900}", _dark: "{colors.blue.400}" } },
        fg: { value: { base: "{colors.neutral.50}", _dark: "{colors.neutral.50}" } },
      },
      accent: {
        DEFAULT: { value: { base: "{colors.neutral.100}", _dark: "{colors.neutral.800}" } },
        fg: { value: { base: "{colors.neutral.900}", _dark: "{colors.neutral.50}" } },
      },
      border: { value: { base: "{colors.neutral.200}", _dark: "{colors.neutral.800}" } },
      ring: { value: { base: "{colors.neutral.400}", _dark: "{colors.neutral.600}" } },
    },
  },
});
`;

export const STRUCTURE = {
  "preset/recipes/index.ts": recipesIndex,
  "preset/slot-recipes/index.ts": slotRecipesIndex,
  "preset/utilities/animation.ts": animationUtilities,
  "preset/utilities/index.ts": utilitiesIndex,
  "preset/index.ts": presetIndex,
  "preset/keyframes.ts": keyframes,
  "preset/semantic-tokens.ts": semanticTokens,
};
