# Branch protection — Path A (founder setup, ~5 min)

Repo: `camp-web`. Nobody pushes to main; founder is the merge gate.

## GitHub → Settings → Branches → Add rule for `main`

1. ✅ Require a pull request before merging (0 approvals fine — founder merges manually)
2. ✅ Require status checks to pass before merging → select **typecheck-build-test**
3. ✅ Require branches to be up to date before merging
4. ✅ Do not allow bypassing the above settings
5. ❌ Allow force pushes / deletions — leave OFF

## Scoped token for merge agent

Fine-grained PAT, this repo only, permissions: **Contents: read/write, Pull requests: read/write**. No admin, no org scope. Store outside the repo.

## DoD closure (NUT-91)

Open a trivial PR (e.g. README touch), watch CI go green, merge through the gate → attach the PR link as evidence on NUT-91.
