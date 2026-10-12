# Subject One — China driving practice

Complete static React / TypeScript / Vite application for Mainland China Subject 1 study. Includes the full bilingual bank and images, 100-question exams with optional 45-minute limits and instant feedback, timestamp-based resume and auto-submit, scoring, answer review, filtered practice and browsing with derived sub-topics, an optional question limit, question order and practice timer, a bilingual rules reference, bookmarks, wrong-question mastery, local history, summary cookies, JSON import/export with merge/replace, language and appearance settings, and accessible keyboard controls.

## Run

Requires Node.js 22 or newer. Run `npm install`, then `npm run dev`. Build using `npm run build`; serve the production output with `npm run preview`. Deploy `dist/` to any static host. Relative asset paths support repository subpaths; views use hash navigation so no server route rewrites are required.

`npm test` runs domain and backup validation tests. `npm run build` validates every dataset record and referenced image before TypeScript checking and bundling. Browser acceptance tests are in `tests/acceptance.spec.ts` and run against the preview URL via `npx playwright test`.

## Sub-topics

The source bank carries only the seven official chapters, and their labels are unreliable — the chapter named "Traffic Signals" holds 24% sign, marking and signal questions, while "Traffic Safety Laws" holds 48% of them. `src/lib/topics.ts` therefore derives 20 sub-topic tags (signs, markings, signal lights, hand signals, points and penalties, alcohol, licensing, speed, expressway, junctions, lanes, parking, visibility, vulnerable users, difficult roads, crashes and first aid, vehicle controls, loads, motorcycles, habits) by matching the Chinese question, option and explanation text; the English translations are study renderings and are not matched. Tags overlap — a question averages three — so a sub-topic is a filter, not a category, and 97% of the bank carries at least one. Counts shown in the dropdown respect the other active filters. Edit the taxonomy in `src/lib/topics.ts`; `src/lib/topics.test.ts` guards coverage and guards against a tag becoming a catch-all.

## Rules reference

The **Rules reference** page (`#rules`) collects the China-specific facts the bank keeps testing, separately from the questions: point deductions (12 / 9 / 6 / 3 / 1), how the 12-month scoring cycle clears and how `学法减分` gives points back, alcohol and drug thresholds and penalties, default and expressway speed limits, probation-period restrictions, licence classes, and breakdown and crash procedure. Every entry is bilingual and follows the language setting; search and topic filters work across English and Chinese.

The content lives in `src/lib/rules.ts` as plain data — edit or extend it there. It is summarised for study from the Ministry of Public Security point system (Order No. 163, in force 1 April 2022), the Road Traffic Safety Law and its implementing regulations. Every source consulted, the compilation method and the known limits are recorded in [`docs/RULES-SOURCES.md`](docs/RULES-SOURCES.md). It is not official text and not legal advice; verify against current official sources before relying on it.

## Question scope

Exams, practice and browsing exclude city-specific restrictions, named local streets and regional-only procedures. The source bank is retained for backup compatibility and historical scores. See [the exclusion audit](docs/QUESTION-EXCLUSIONS.md) for the reviewed references and question list. General urban-road rules remain included. Saved and imported unfinished exams replace excluded questions while preserving other answers and exam settings.

## Dataset and attribution

Question bank: [Chinese Driver’s License Test in English — Subject 1 Practice Questions](https://github.com/AgostonBodoAiGaoShi/china-drivers-license-subject1-en), copyright 2026 Agoston Bodo, MIT licensed. Derived from doupoa/DrivingTestSubjectOne. The original license and upstream provenance are preserved in `public/data/LICENSE.txt` and `public/data/SOURCES.md`. Import metadata and the exact upstream commit are recorded in `public/data/manifest.json`.

This is unofficial educational material based on a July 2022 community snapshot. Laws and question wording may be outdated. English study translations may differ from official exam terminals. The source bank is preserved without silently changing disputed answers. Some single-choice records have fewer than four options; validation accepts two to four choices.

To refresh the dataset, clone the source repository into `dataset-source` (ignored by Git), pull updates there, and run `npm run update-dataset`. Alternatively run `node scripts/update-dataset.mjs PATH_TO_SOURCE`. The update copies questions, images, license and provenance, records the source revision, and validates all referenced assets. Review source changes before publishing.

## Persistence and privacy

No backend, analytics or ads. Versioned `subject1.*.v1` localStorage keys store settings, history, wrong questions, bookmarks, mastery streaks, practice count and active exam. `subject1_results` contains a compact cookie summary only. Exported JSON includes all progress and any active exam. Import validates identifiers, answer choices, timestamps, preferences and exam structure before writing; scores are recomputed from the bank. Merge deduplicates result IDs and retains the newer settings. Storage failures are shown with a backup action.

Mock exams default to no time limit and instant feedback after each answer, including the correct answer and explanation. Instant feedback locks the first answer for scoring. Choose a 45-minute limit and feedback after submission on the overview or mock-exam start page for a timed simulation. An optional auto-stop setting (enabled by default for new exams) ends and scores the attempt at 10 wrong answers. It can also be toggled during an unfinished exam. Unanswered questions receive no points, and only attempted mistakes are added to the wrong-answer bank when auto-stop occurs. The selected modes are saved with the exam and backups. Untimed exams resume without expiring and record the full elapsed time. Timed exams continue while the app is closed and auto-submit an expired saved exam when reopened. Existing saved exams retain their original timing and feedback behavior. Practice sessions can be capped to 10, 20, 30, 50 or 100 questions, run in bank order or shuffled, and given a 5 to 45 minute timer; all three are saved in settings and apply to every practice start. Shuffling picks a random sample of the capped size from the whole filtered set. When a practice timer expires the session stops, answers are revealed and nothing further is recorded. Practice sessions are not resumable across reloads. Study mode never counts as a correct practice attempt. Wrong questions require a configurable consecutive-correct streak (default two) to clear. A practice answer is counted only once per question per session.

Use one active study tab at a time; separate tabs and devices do not synchronize. Export backups before clearing browser data. Optional PWA/offline installation, spaced repetition and cloud sync are outside this release.

Application code is licensed separately under the MIT license in `LICENSE`.
