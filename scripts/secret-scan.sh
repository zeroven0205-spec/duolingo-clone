#!/bin/bash
# Secret scan - detect potential secrets in code

set -e

echo "Running secret scan..."

# Check for common secret patterns
PATTERNS=(
  "sk_live_[A-Za-z0-9_-]{20,}"
  "sk-[A-Za-z0-9_-]{24,}"
  "api[_-]?key[\s]*[=:][\s]*['\"][A-Za-z0-9_-]{20,}['\"]"
)

FOUND=0
for pattern in "${PATTERNS[@]}"; do
  if grep -rqE "$pattern" src/ --include="*.ts" --include="*.js" 2>/dev/null; then
    echo "Warning: potential secret pattern found: $pattern"
    FOUND=1
  fi
done

if [ $FOUND -eq 1 ]; then
  echo "Secret scan: warnings found"
  exit 1
fi

echo "✓ Secret scan passed"
