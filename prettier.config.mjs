/** @type {import("prettier").Config} */
export default {
  arrowParens: "always",
  endOfLine: "lf",
  printWidth: 100,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "^react.*",
    "^next.*",
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "^@/.*",
    "^[./]",
  ],
};
