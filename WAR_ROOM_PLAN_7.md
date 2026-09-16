# WAR ROOM PLAN — Issue #7: Supply-chain hygiene

## Goal
- [ ] `npm audit` reports 0 high/moderate vulnerabilities
- [ ] `.github/workflows/ci.yml` runs `npm audit --audit-level=high`
- [ ] Dockerfile runs `npm audit --audit-level=high` as a build step
- [ ] SECURITY.md "Security Checks" wording matches what CI actually does

## Subtasks
- [x] Upgrade release-it from ^19.2.4 to a Node-20-compatible fixed version (^20.x, avoids breaking v21 with its Node 22.21+ engine requirement)
- [x] Verify `npm audit` reports 0 high/moderate vulnerabilities
- [x] Verify tests and lint still pass (`npm test`, `npm run lint`)
- [ ] Add `npm audit --audit-level=high` to ci.yml (replace the `--omit=dev` step; the vulns come via devDeps)
- [ ] Add `npm audit --audit-level=high` as a Dockerfile build step (dedicated stage or RUN)
- [ ] Update SECURITY.md wording to match CI behavior
- [ ] Delete plan file + final commit referencing #7 + push branch