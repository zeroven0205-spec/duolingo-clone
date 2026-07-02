import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**"],
  },
  {
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
    },
  },
];
