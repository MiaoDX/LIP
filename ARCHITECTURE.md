# LIP Architecture

LIP is a VitePress/GitHub Pages content repository for Learn In Public writing,
standalone HTML decks, and AI Coding project pages. The repository is shaped
around publishing rules, not an application runtime.

## Source Surfaces

- Markdown site content lives in `index.md`, `now/`, `stories/`, `lessons/`,
  `openclaw/`, `ai-coding/`, `bestpractice/`, `resources/`, `share/`,
  `proposals/`, and the mirrored English entrypoints under `en/`.
- General standalone decks live in `presentations/`.
- AI Coding project decks live in `ai-coding/<slug>/index.html` with local
  `images/`, `screenshots/`, or `assets/`.
- Consult pages live in `public/consult/` and are public static output.
- Agent/process docs live under `docs/agents/`, `docs/plans/`, and
  `docs/status/`; they are excluded from public site output.
- Private interview preparation lives in the optional `interviews/` submodule.
  Its Markdown and local HTML are excluded from public output and are not
  required to build the site.
- Generated output lives in `.vitepress/dist/` and must not be edited directly.

## Configuration Owners

- `site-map.mjs` owns the site title, base path, navigation, sidebar groups,
  Marp scan directories, operational-doc exclusions, and index coverage policy.
- `.vitepress/config.mts` imports the shared site map and wires VitePress
  locales, base path, theme config, and analytics.
- `.vitepress/theme/` owns the custom editorial VitePress theme.
- `scripts/publish-rules.mjs` owns standalone publish copy/check behavior.
- `scripts/markdown-route-utils.mjs` owns markdown route/path translation.
- `scripts/file-utils.mjs`, `scripts/command-runner.mjs`, and
  `scripts/test-workspace.mjs` own shared script helpers.

## Build Flow

`npm run build:all` is the local and CI verification path:

1. run script tests and type checking;
2. run scoped local link checks;
3. build the VitePress site;
4. copy standalone decks and consult pages into `.vitepress/dist/`;
5. build Marp and Slidev decks;
6. verify standalone publish output and source ownership;
7. run the quality gate and refresh `.quality-report.md`.

GitHub Pages deployment is defined in `.github/workflows/deploy.yml` and calls
the same `npm run build:all` command before uploading `.vitepress/dist/`. CI
does not initialize the private `interviews/` submodule.

## Proof Boundaries

- `npm run test:scripts` covers JavaScript helper behavior and TypeScript
  checking.
- `npm run link:check` protects configured navigation, scoped first-read docs,
  and index coverage.
- `npm run publish:check` protects canonical standalone source locations and
  generated output consistency.
- `npm run quality:check` checks publish boundaries and content quality metrics
  after `.vitepress/dist` exists.
- `interviews/` is a forbidden public output path, whether or not the private
  submodule is initialized locally.
- Standalone deck visual changes require browser checks at `1440x900` and
  `390x844`; see `docs/agents/standalone-decks.md`.

## Extension Points

- Add public navigation or sidebar entries in `site-map.mjs`.
- Add Markdown content in the matching source directory and update the relevant
  index when the quality gate requires coverage.
- Add general HTML decks under `presentations/`.
- Add project-style AI Coding decks under `ai-coding/<slug>/`.
- Add longer agent-only procedures under `docs/agents/`.
- Add human-facing detail that would bloat root docs under `docs/human/`.
