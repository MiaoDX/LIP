---
refactor_scope: consult-public-boundary
status: DONE
accepted_severities:
  - P0
  - P1
last_verified: 2026-06-08
---

# Refactor Scope: consult public boundary

## Status

DONE

## Target

Remove false-security consult output from the public GitHub Pages publish tree
and make the source ownership gate reject future client-side password
protection in standalone public HTML.

## Accepted Severities

- P0: static public output can expose material that appears password-protected.
- P1: publish/source ownership checks could pass while a future consult page
  relies on a client-side password constant.

## Accepted Cleanup Checklist

- Remove the Jingpaidang consult HTML/PDF bundle from `public/consult/`.
- Keep intentionally public consult pages, such as the ZhenFund pitch page.
- Add a source ownership check for client-side password constants and password
  inputs in standalone HTML source roots.
- Cover the new check in `scripts/publish-rules.test.mjs`.
- Update consult publishing guidance to state that `public/consult/` is public
  static output, not an access-control boundary.

## Parked Cross-Seam / Future Ideas

- Do not attempt history rewriting in this slice; removing the files prevents
  future GitHub Pages publication but cannot erase prior git history.
- Real private consult delivery needs an authenticated host outside this static
  GitHub Pages pipeline.

## Evidence Ladder

- L0: `rg -n "CORRECT_PWD|type=\"password\"|jingpaidang_bp_v3_final" public/consult scripts docs README.md`
- L1: `npm run test:publish-rules`
- L1: `npm run test:scripts`
- L2: `npm run build:all`
- L2: direct absence checks in `.vitepress/dist/consult/` after build.

## Stop Condition

Stop when the false-protected Jingpaidang bundle is absent from source and
fresh build output, source ownership rejects synthetic client-side password
HTML, and the full build gate passes.

## Execution Log

- 2026-06-08: Gate created from saturation audit after confirming
  `.github/workflows/deploy.yml` uploads static GitHub Pages output while
  `public/consult/jingpaidang_*.html` embeds `const CORRECT_PWD = 'jingpaidang'`
  and `public/consult/download.html` links the PDF directly.
