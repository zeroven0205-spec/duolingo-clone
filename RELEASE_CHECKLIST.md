# Release Checklist

## Pre-Release Verification
- [ ] All tests pass: `pnpm test --run`
- [ ] Type check passes: `pnpm run build`
- [ ] Lint clean: `pnpm lint`
- [ ] Full verify gate: `bash scripts/verify.sh`
- [ ] CHANGELOG.md updated with version and date
- [ ] No hardcoded secrets in codebase
- [ ] docs/README.md index current

## Release Steps
1. Update version in CHANGELOG.md
2. Commit: `git commit -m "chore(release): vX.Y.Z"`
3. Tag: `git tag vX.Y.Z`
4. Push: `git push origin main && git push origin vX.Y.Z`
