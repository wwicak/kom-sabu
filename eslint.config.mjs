import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Relax TypeScript rules while maintaining security
      "@typescript-eslint/no-explicit-any": "warn", // Change from error to warning
      "@typescript-eslint/no-unused-vars": "warn", // Change from error to warning
      "@typescript-eslint/no-unsafe-function-type": "warn", // Change from error to warning

      // Relax React rules
      "react/no-unescaped-entities": "warn", // Change from error to warning
      "react-hooks/exhaustive-deps": "warn", // Change from error to warning

      // Relax Next.js rules
      "@next/next/no-img-element": "warn", // Change from error to warning

      // Keep security-critical rules as errors
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",

      // Allow console for development
      "no-console": "off",

      // Relax prefer-const rule
      "prefer-const": "warn"
    }
  }
];

export default eslintConfig;
