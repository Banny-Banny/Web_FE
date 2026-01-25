import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // TypeScript 관련 규칙
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      
      // React 관련 규칙
      "react/jsx-uses-react": "off", // React 17+ JSX Transform
      "react/react-in-jsx-scope": "off", // React 17+ JSX Transform
      "react-hooks/exhaustive-deps": "warn",
      
      // 일반적인 코드 품질 규칙
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error"
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**", 
    "build/**",
    "next-env.d.ts",
    // 추가 무시 파일
    "*.config.js",
    "*.config.mjs",
    "tailwind.config.js",
    "postcss.config.mjs"
  ]),
]);

export default eslintConfig;
