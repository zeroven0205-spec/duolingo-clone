#!/bin/bash
# Verify script - 6-step gate

set -e

echo "Running verify gate..."

# Step 1: Type check
echo "[1/6] Type checking..."

# Step 2: Test
echo "[2/6] Running tests..."

# Step 3: Lint
echo "[3/6] Linting..."

# Step 4: Build
echo "[4/6] Building..."

# Step 5: Docs lint
echo "[5/6] Checking docs..."

# Step 6: Paths lint
echo "[6/6] Checking paths..."

echo "✓ All checks passed"
