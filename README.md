# Subject One — China driving practice

Complete static React / TypeScript / Vite application for Mainland China Subject 1 study. Includes the full bilingual bank and images, 100-question / 45-minute exams, timestamp-based resume and auto-submit, scoring, answer review, filtered practice and browsing, a bilingual rules reference, bookmarks, wrong-question mastery, local history, summary cookies, JSON import/export with merge/replace, language and appearance settings, and accessible keyboard controls.

## Run

Requires Node.js 22 or newer. Run `npm install`, then `npm run dev`. Build using `npm run build`; serve the production output with `npm run preview`. Deploy `dist/` to any static host. Relative asset paths support repository subpaths; views use hash navigation so no server route rewrites are required.

`npm test` runs domain and backup validation tests. `npm run build` validates every dataset record and referenced image before TypeScript checking and bundling. Browser acceptance tests are in `tests/acceptance.spec.ts` and run against the preview URL via `npx playwright test`.

## Rules reference

The **Rules reference** page (`#rules`) collects the China-specific facts the bank keeps testing, separately from the questions: point deductions (12 / 9 / 6 / 3 / 1), how the 12-month scoring cycle clears and how `学法减分` gives points back, alcohol and drug thresholds and penalties, default and expressway speed limits, probation-period restrictions, licence classes, and breakdown and crash procedure. Every entry is bilingual and follows the language setting; search and topic filters work across English and Chinese.

The content lives in `src/lib/rules.ts` as plain data — edit or extend it there. It is summarised for study from the Ministry of Public Security point system (Order No. 163, in force 1 April 2022), the Road Traffic Safety Law and its implementing regulations. Every source consulted, the compilation method and the known limits are recorded in [`docs/RULES-SOURCES.md`](docs/RULES-SOURCES.md). It is not official text and not legal advice; verify against current official sources before relying on it.

## Dataset and attribution

Question bank: [Chinese Driver’s License Test in English — Subject 1 Practice Questions](https://github.com/AgostonBodoAiGaoShi/china-drivers-license-subject1-en), copyright 2026 Agoston Bodo, MIT licensed. Derived from doupoa/DrivingTestSubjectOne. The original license and upstream provenance are preserved in `public/data/LICENSE.txt` and `public/data/SOURCES.md`. Import metadata and the exact upstream commit are recorded in `public/data/manifest.json`.

This is unofficial educational material based on a July 2022 community snapshot. Laws and question wording may be outdated. English study translations may differ from official exam terminals. The source bank is preserved without silently changing disputed answers. Some single-choice records have fewer than four options; validation accepts two to four choices.

To refresh the dataset, clone the source repository into `dataset-source` (ignored by Git), pull updates there, and run `npm run update-dataset`. Alternatively run `node scripts/update-dataset.mjs PATH_TO_SOURCE`. The update copies questions, images, license and provenance, records the source revision, and validates all referenced assets. Review source changes before publishing.

## Persistence and privacy

No backend, analytics or ads. Versioned `subject1.*.v1` localStorage keys store settings, history, wrong questions, bookmarks, mastery streaks, practice count and active exam. `subject1_results` contains a compact cookie summary only. Exported JSON includes all progress and any active exam. Import validates identifiers, answer choices, timestamps, preferences and exam structure before writing; scores are recomputed from the bank. Merge deduplicates result IDs and retains the newer settings. Storage failures are shown with a backup action.

The timer continues while the app is closed and auto-submits an expired saved exam when reopened. Study mode never counts as a correct practice attempt. Wrong questions require a configurable consecutive-correct streak (default two) to clear. A practice answer is counted only once per question per session.

Use one active study tab at a time; separate tabs and devices do not synchronize. Export backups before clearing browser data. Optional PWA/offline installation, spaced repetition and cloud sync are outside this release.

Application code is licensed separately under the MIT license in `LICENSE`.
