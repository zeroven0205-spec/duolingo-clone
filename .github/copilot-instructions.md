# GitHub Copilot Instructions

## Project Context
This project follows a structured development workflow with AI agent collaboration.

## Commands
- `pnpm run build` — Type check and compile
- `pnpm test --run` — Run tests
- `pnpm lint` — Lint code
- `bash scripts/verify.sh` — Full verification gate

## AI Collaboration Rules
- Always run verify.sh before committing
- Follow the AGENTS.md guidelines for task execution
- Do not skip the verify gate with --no-verify
