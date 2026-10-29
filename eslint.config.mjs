import babelParser from "@babel/eslint-parser";
import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: ["coverage/**", "dist/**", "node_modules/**", "out/**", "reference/**"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.bunBuiltin,
      },
    },
  },
  eslint.configs.recommended,
  {
    rules: {
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "no-alert": "error",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          parserOpts: {
            plugins: ["typescript", "jsx"],
          },
          plugins: ["@babel/plugin-syntax-typescript", "@babel/plugin-syntax-jsx"],
        },
      },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  prettier,
];
