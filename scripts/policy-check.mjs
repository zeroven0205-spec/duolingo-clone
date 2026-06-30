/**
 * Policy check script — blocks high-risk operations
 * Run: node scripts/policy-check.mjs <file> [...]
 *
 * Exit code 0 = allowed, 1 = blocked
 */

const { readFileSync } = await import('node:fs');

const RISKY_EXTENSIONS = new Set(['.env', '.pem', '.key', '.db', '.sqlite', '.credentials.json']);
const SECRET_PATTERNS = [
  /sk_live_[A-Za-z0-9_-]{20,}/i,
  /sk-[A-Za-z0-9_-]{24,}/,
  /api[_-]?key[\s]*[=:][\s]*['"`][A-Za-z0-9_-]{20,}['"`]/i,
  /password[\s]*[=:][\s]*['"`][^'"`\s]{8,}['"`]/i,
  /Bearer\s+[A-Za-z0-9_-]{20,}/,
];
const SKIP_PATHS = /^(?:node_modules|dist|build|coverage|\.git|scripts\/)/;

function checkFile(filePath) {
  const errors = [];

  // Skip exempt paths
  if (SKIP_PATHS.test(filePath)) return errors;

  // Block risky file extensions
  const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
  if (RISKY_EXTENSIONS.has(ext)) {
    errors.push(`BLOCKED: risky extension ${ext} — ${filePath}`);
    return errors;
  }

  // Scan for secret patterns in text files
  if (!/\.(ts|js|tsx|jsx|mjs|cjs|json|md|yml|yaml|toml)$/.test(filePath)) {
    return errors;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    for (const pattern of SECRET_PATTERNS) {
      if (pattern.test(content)) {
        const match = content.match(pattern);
        errors.push(`BLOCKED: secret pattern in ${filePath} — ${pattern}`);
        break;
      }
    }
  } catch {
    // binary / unreadable — skip
  }

  return errors;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/policy-check.mjs <file> [...]');
  process.exit(1);
}

let hasBlock = false;
for (const file of files) {
  const errors = checkFile(file);
  for (const err of errors) {
    console.error(err);
    hasBlock = true;
  }
}

process.exit(hasBlock ? 1 : 0);
