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
    bg: { value: "var(--bg)" },
    fg: { value: "var(--fg)" },
    primary: {
      DEFAULT: { value: "var(--primary)" },
      fg: { value: "var(--primary-fg)" },
    },
    secondary: {
      DEFAULT: { value: "var(--secondary)" },
      fg: { value: "var(--secondary-fg)" },
    },
    accent: {
      DEFAULT: { value: "var(--accent)" },
      fg: { value: "var(--accent-fg)" },
    },
    muted: {
      DEFAULT: { value: "var(--muted)" },
      fg: { value: "var(--muted-fg)" },
    },
    danger: { value: "var(--danger)" },
    surface: {
      DEFAULT: { value: "var(--surface)" },
      fg: { value: "var(--surface-fg)" },
    },
    card: {
      DEFAULT: { value: "var(--card)" },
      fg: { value: "var(--card-fg)" },
    },
    popover: {
      DEFAULT: { value: "var(--popover)" },
      fg: { value: "var(--popover-fg)" },
    },
    border: { value: "var(--border)" },
    input: { value: "var(--input)" },
    ring: { value: "var(--ring)" },
    chart: {
      1: { value: "var(--chart-1)" },
      2: { value: "var(--chart-2)" },
      3: { value: "var(--chart-3)" },
      4: { value: "var(--chart-4)" },
      5: { value: "var(--chart-5)" },
    },
    sidebar: {
      DEFAULT: { value: "var(--sidebar)" },
      fg: { value: "var(--sidebar-fg)" },
      primary: {
        DEFAULT: { value: "var(--sidebar-primary)" },
        fg: { value: "var(--sidebar-primary-fg)" },
      },
      accent: {
        DEFAULT: { value: "var(--sidebar-accent)" },
        fg: { value: "var(--sidebar-accent-fg)" },
      },
      border: { value: "var(--sidebar-border)" },
      ring: { value: "var(--sidebar-ring)" },
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
