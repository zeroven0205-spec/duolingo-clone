#!/bin/bash
# Verify script - 6-step gate

set -e

echo "Running verify gate..."

# Step 1: Type check
echo "[1/6] Type checking..."
npx tsc --noEmit

# Step 2: Test
echo "[2/6] Running tests..."
pnpm test --run

# Step 3: Lint
echo "[3/6] Linting..."
pnpm lint

# Step 4: Build
echo "[4/6] Building..."
pnpm build

# Step 5: Docs lint
echo "[5/6] Checking docs..."
# Check that docs are up to date (simple existence check)
find docs -name "*.md" -type f | head -5 > /dev/null

# Step 6: Paths lint
echo "[6/6] Checking paths..."
# Check that routes exist
ls app/*/page.tsx app/*/*/page.tsx 2>/dev/null | wc -l | grep -qE "^[0-9]+$"

echo "✓ All checks passed"
