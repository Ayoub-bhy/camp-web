# camp-web

Web app for **Camp Pilot 01** — Arabic online summer camp, children 7–10, KSA + Jordan (Aug 16–27, 2026).

**Scope (HARD CAP, charter A4):** landing page · registration + parental consent · checkout · parent-lite view. Nothing else.

## Stack

Vite + vanilla TypeScript + Vitest. Static output, RTL Arabic-first. Boring on purpose.

## Commands

```
npm ci            # install
npm run dev       # local dev server
npm run typecheck # tsc --noEmit
npm run build     # production build → dist/
npm test          # vitest run
```

CI runs typecheck + build + test on every PR (`.github/workflows/ci.yml`).

## Rules

- Ship via PR; no direct pushes to main (Path A — see `docs/branch-protection.md`).
- Payments / child-data changes need SEC sign-off in Linear before merge.
- Registration data is capped at: child first name, age, parent name, parent phone.
- Board: Linear project **edtech-school** (team NUT).
