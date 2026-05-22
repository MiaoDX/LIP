# Deck templates

Reusable starting points for standalone HTML / PPT-style slide decks in this
repo. **Start every new deck from here** so all decks share the same fonts,
theme switching, paging, image pop-up, and speaker-notes behavior.

Distilled from the canonical deck `ai-coding/ultrathink-to-goal/index.html`.

## Files

- `deck/index.html` — the template. A complete, runnable skeleton with a
  catalogue of common slide layouts and inline comments explaining each piece.

## What you get

| Feature | How it works |
| --- | --- |
| **Font + style switching** | Three themes (`terminal`, `newspaper`, `navy`) via `body[data-style]`. Each theme defines its colors **and** a font triple (display / body / mono). A top-right pill switches live and remembers the choice in `localStorage`. |
| **Paging** | `←/→`, `Space`, `PageUp/Down`, `Home/End`, and click-left/right zones. Progress bar, slide counter, and `#N` hash deep-link all update automatically. |
| **Image pop-up** | Click any `.screenshot img` to open a full-screen lightbox; `Esc` or click-background to close. Caption is read from the `.ss-cap` text. |
| **Speaker notes** | `.speaker-note` blocks are hidden by default; the bottom-left `NOTES` button toggles them. |
| **Responsive** | Laptop layout by default; a `@media (max-width: 900px)` branch stacks columns for phones. |

Paging, the toggles, and theme persistence live in the shared
`assets/deck-runtime.js`. Image pop-up is a small `installImageLightbox()`
function inlined in the template (extend its selector if you add new image
containers).

## How to use

1. **Copy the template to its final home.** Final decks must live in a
   published source folder (see `CLAUDE.md` → *Canonical source locations*):

   - **AI Coding deck** → `ai-coding/<slug>/index.html`
     Same depth as the template, so keep the
     `../../assets/deck-runtime.js` path as-is.

   - **General deck** → `presentations/<name>.html`
     One level shallower — change the script src to
     `../assets/deck-runtime.js`.

2. **Replace the placeholder content.** Swap the title, sections, and slide
   bodies. Keep the first slide's `class="slide title active"` — exactly one
   slide starts `active`.

3. **Add real images.** Put assets in the deck's own `images/` folder and
   reference them with relative paths, e.g. `<img src="images/your-shot.png">`.
   Replace the inline-SVG placeholders. Do not depend on sibling folders or
   `raw.githubusercontent.com`.

   **Do NOT inline real images as base64 data URIs.** The placeholder SVGs
   that ship with the template are inline by design (they encode short labels,
   not photos, and exist only until you swap in real files). Real screenshots
   and photos must stay as separate files because:

   - PR diffs stay reviewable — inlined base64 blobs balloon the diff and
     hide content changes.
   - The HTML file stays small enough for chat-app and IDE previews to
     render — once the file crosses ~1 MB, many previewers silently bail.
   - The publish pipeline (`npm run publish:copy`) copies the `images/`
     folder as a sibling alongside `index.html`, which is the convention
     `/LIP/ai-coding/<slug>/` expects.

4. **Verify in a real browser** at both `1440x900` and `390x844` before
   declaring done — static inspection misses layout regressions (see
   `CLAUDE.md` → *Visual verification* and the `.slide-2col` grid gotcha).

5. **Run `npm run quality:check`** after adding the deck to a published
   folder. It verifies local asset references and that no publish output was
   committed as source.

## Slide layouts included

`title` · `section` divider (with optional `section-metric`) · content +
`cards` row · `quote` + `data-row` · two-column (`slide-2col`) with a
clickable screenshot · `compare-table` · closing / `qa`.

## Conventions to keep

- **Slide copy punctuation:** prefer fragment-style text without trailing
  `。` / `.` / `；`. Keep punctuation inside quotes, URLs, version numbers,
  decimals, filenames, and code.
- **`.slide-2col` is CSS grid, not flex.** To change the column split,
  override `grid-template-columns` on `.slide-2col` — setting `flex` on the
  children is silently ignored.
- **Adding a theme:** copy a `body[data-style="..."]` token block, then add
  the name to both the `styles: [...]` array in the `createDeckRuntime(...)`
  call and a matching `<button data-style="...">` in the style-toggle nav.
