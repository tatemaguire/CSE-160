import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig({
    languageOptions: {
        globals: {
            ...globals.browser
        }
    },
    plugins: {
        js
    },
    extends: ["js/recommended"],
    rules: {
        "no-unused-vars": "warn"
    }
})