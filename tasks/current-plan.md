# Current Plan

Use this file for the one active task that is large enough to benefit from structured planning.

Do not create or update this file for tiny, low-risk edits.

## Title

Migrate `palette-generator` from GitHub Pages to Vercel.

## Goal

Keep the existing browser-only palette extractor intact while moving production hosting to Vercel with a branded URL, Git-triggered auto deploys, and repo/docs alignment.

## Success Criteria

- Production site is available at `https://shinbum-palette-generator.vercel.app/`.
- Pushes to `main` trigger automatic Vercel production deploys.
- Repo docs reflect Vercel as the live host.
- GitHub Pages is no longer the public source of truth.

## Constraints And Assumptions

- Constraint: browser-only runtime, no backend or external image APIs.
- Constraint: app continues to run directly from repo-root static files.
- Assumption: Vercel can serve the repo root without any custom build step.

## Implementation Approach

Keep the app static, add lightweight Vercel project metadata hygiene, update docs/memory, deploy from repo root, assign the branded alias, verify Git auto deploy, then make the GitHub repo private once the Vercel path is stable.

## Checklist

- [x] Confirm current behavior and relevant context
- [x] Update project docs for Vercel hosting
- [ ] Deploy to Vercel and assign branded alias
- [ ] Verify Git-triggered production deploy
- [ ] Make GitHub repo private after verification

## Verification Plan

- Open the branded Vercel URL and confirm the app loads.
- Confirm assets resolve from repo root with no missing static files.
- Push a migration commit to `main` and verify Vercel records a Git-sourced production deploy.
- Recheck the repo visibility after deployment is healthy.

## Outcome Notes

Migration is in progress. Static hosting assumptions remain unchanged; only the production delivery path is moving from GitHub Pages to Vercel.
