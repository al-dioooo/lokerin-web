<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Repository rules

These follow the team's GitHub repository guideline (kept in `lokerin-docs`), with the sprint exceptions noted at the end.

**Commits.** Small and focused: one logical change, roughly 5 to 100 lines, easy to revert. Commit per function, fix or step (about every 15 to 60 minutes of work). Never mix a refactor with a feature, or a fix with formatting. No 1000+ line commits, no WIP commits on shared branches, no vague messages like "update code". Before committing, lint must pass and the change must work locally.

**Messages.** Conventional Commits for commit messages and PR titles: `type(scope): description`, e.g. `feat(ui): add LED countdown board`, `fix(peta): stop pins overlapping`. Types: feat, fix, refactor, docs, chore, test. Mark breaking changes with `!`, e.g. `feat(api)!: rename listing fields`.

**Branches.** Trunk-based. `main` is always release-ready; a `release` branch tracks production; no `develop` or `staging`. Work on short-lived `feature/<desc>`, `fix/<desc>` or `chore/<desc>` branches and merge through a PR. No direct commits to `main` except emergency hotfixes.

**Secrets.** Never commit `.env*` files, API keys, tokens, credentials or logs. Secrets live in Vercel and Convex environment settings; only `.env.example` with empty values is committed.

**README.** Keep these sections current: project overview, tech stack, setup and run, environment variables, deployment. Extra docs go in `docs/`: architecture diagram, API spec, ADR decision log.

**Sprint exceptions** (until the competition ends): TDD and new tests are not required, and PRs need no reviewer. Always ask Alice before merging any PR, and merge only after she says yes.

## Attribution

Never add AI attribution anywhere: no AI author or `Co-authored-by` trailers, no "Generated with" or "Written by" lines in commit messages, PR titles or descriptions, code comments, docs, or UI copy. Commits are authored by the human team only.

## Writing

All text people read (UI copy, headings, button labels, docs, commit messages, PR descriptions) must read as written by a person. Before committing text, check it against the unslop skill (`~/.claude/skills/unslop`): run `python3 ~/.claude/skills/unslop/scripts/banned_phrase_scan.py` and `structure_scan.py` on it, and cut formulaic framing, inflated words, empty slogans and filler. Keep copy short, concrete and in plain Bahasa Indonesia.
