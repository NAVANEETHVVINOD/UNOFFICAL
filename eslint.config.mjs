import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    files: ["**/*.ts", "**/*.tsx"],
    extends: compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"),

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "react-hooks": fixupPluginRules(reactHooks),
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
    },
}, {
    files: ["**/*.js"],

    languageOptions: {
        globals: {
            ...globals.node,
        },
    },
}, {
    files: ["**/sw.js"],

    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },
},
{
    ignores: ["node_modules", "dist"],
}
]);