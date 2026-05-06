// @ts-nocheck
// Tooling configuration for ESLint — Node-side only, not shipped to clients.
// We disable type-checking here because the upstream `eslint-plugin-astro` /
// `@typescript-eslint` types are loose enough to produce noisy errors that
// don't reflect runtime behavior. Treat this file as plain JS config.
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tseslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    ignores: ["dist/", ".astro/", "node_modules/"],
  },
];
