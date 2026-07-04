/**
 * Verifies that messages/en.json and messages/zh.json have the same set of
 * keys at every nesting level. Exits non-zero on mismatch so this can be
 * wired into CI / `pnpm check-i18n`.
 *
 * Usage: `pnpm exec tsx scripts/check-i18n.ts`
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

function flatten(obj: Json, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    if (prefix) out[prefix] = String(obj);
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      Object.assign(out, flatten(v, key));
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

const root = resolve(__dirname, "..");
const en = JSON.parse(readFileSync(resolve(root, "messages/en.json"), "utf8")) as Json;
const zh = JSON.parse(readFileSync(resolve(root, "messages/zh.json"), "utf8")) as Json;

const enKeys = Object.keys(flatten(en));
const zhKeys = Object.keys(flatten(zh));

const missingInZh = enKeys.filter((k) => !zhKeys.includes(k));
const missingInEn = zhKeys.filter((k) => !enKeys.includes(k));

let ok = true;
if (missingInZh.length > 0) {
  console.error(`❌ ${missingInZh.length} key(s) missing in zh.json:`);
  for (const k of missingInZh) console.error(`   - ${k}`);
  ok = false;
}
if (missingInEn.length > 0) {
  console.error(`❌ ${missingInEn.length} key(s) missing in en.json:`);
  for (const k of missingInEn) console.error(`   - ${k}`);
  ok = false;
}

if (ok) {
  console.log(`✓ i18n keys aligned (${enKeys.length} keys)`);
  process.exit(0);
}

process.exit(1);