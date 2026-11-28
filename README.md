# Field Notes · Physics 2

[Open the website](https://angelowww11.github.io/Physics_ULT_REV/)

The website opens with the full Physics 2 notes and a practice question beside them. The design keeps the Field Notes identity.

- Read ten chapters with worked examples, derivations, assumptions, units, and sign checks.
- Browse all 18 supplied PDFs and 492 page images.
- Choose 1–60 practice questions from one module or all modules.
- Use smart practice, new questions, mistakes, due reviews, guessed or unrated answers, and saved questions.
- Record confidence after answering. Revisit wrong answers and scheduled reviews.
- Use a timed practice exam with saved answers, flags, and explanations after submission.
- Search all module notes and save reading sections.
- Use light, dark, or automatic mode with three color themes.
- Read the notes on a phone, or print them as a PDF.
- Export progress to move it between devices. Browser storage does not synchronize automatically.

The notes explain identified source errors. The original PDFs remain unchanged. Added extensions carry explicit labels. No finite notebook contains every possible exam derivation.

The [earlier website](https://angelowww11.github.io/Physics_ULT_REV/classic.html) and the [full printable notebook](https://angelowww11.github.io/Physics_ULT_REV/reviewer.html) remain available.

The supplied [TOPCIT Sprint reference](https://tpct-reviewer.onrender.com/) informs the review cycle. It supplies no physics questions or course content.

## Files

`notes/01.txt` through `notes/10.txt` contain the core notebook text and LaTeX. The corresponding `*-worked.txt` files contain the expanded explanations and solutions. The notes contain 69 worked-solution cards and 34 expanded derivation cards, plus the core explanations.

`reviewer.html` contains the generated reading page. The build renders the display equations and inline equations into HTML and MathML. Use `$...$` for inline mathematics and `$$...$$` for display mathematics. Long calculation chains use aligned rows. Readers do not need a remote equation service.

`sources.js` records the source filenames, hashes, page text, and images. `audit/source-map.json` maps all 492 source pages to topics. Each module provides its source-page map beside the original file links. Covers, references, and blank pages remain in that map.

`practice-data.js` creates 600 numerical variants across 30 question families. `practice-math.js` supplies the formatted laws and substitutions. `concept-data.js` supplies 60 original concept checks, including an explanation for every choice.

`challenge-data.js` adds 600 situational questions: 60 per module, with 45 calculation questions and 15 conceptual situations. `practice-solutions.js` adds full working to the existing 600 numerical variants. The combined study bank contains 1,260 questions.

Choose **Situational challenges** in the practice menu to select the harder questions. Sets remain limited to 60 questions. Each module also contains 60 fully open worked situations in the complete notes. The original 20 note files and all 18 PDFs remain unchanged.

The expansion uses 50 added scenario families. Each family has four calculation targets, a reasoning check, and two parameter sets. New questions change the requested quantity or numerical conditions. The original 100 challenge IDs and their answer choices remain intact.

Edit `tools/challenge-source.cjs` and `tools/challenge-expansion.cjs` to change the added questions. `python tools/build_notes.py` regenerates the added question data, supplementary notes, lesson exports, and full notebook.

`study-core.js` manages question selection, confidence, review scheduling, exam state, and backup compatibility. `desk.js` provides the study workspace. `study-desk.css` extends the existing visual system. `notebook.css` controls the full notebook. `palette.css` defines the themes.

The notes build also writes `study-index.json` and `lessons/01.html` through `lessons/10.html`. Each lesson contains the complete chapter and its original mathematics. The study desk loads one chapter at a time.

The earlier browser-storage key remains in use for question records and original-page bookmarks. The study desk stores its extra state under `field-notes-learning-v2`. It supports earlier Field Notes backup files.

Wrong answers become due after five minutes. Smart mix and Mistakes permit earlier retries. Correct guesses and unrated correct answers return after one day. Confident correct answers use 1, 3, 7, 14, then 30 days. These intervals guide review; they do not measure examination readiness.

Smart selection preserves mistake-first priority and spreads new questions across concept and calculation families. Timed exams balance modules and alternate conceptual and numerical questions within each module.

The scanned companion PDFs contain embedded slides. Their PDF page numbers differ from the embedded slide numbers. Image-only pages retain their images; the website does not invent extracted text.

## Local preview

Run `python -m http.server 8098` from this directory. Open `http://localhost:8098`.

## Rebuild and checks

Install Python packages `markdown-it-py`, `pymupdf`, `Pillow`, and `sympy`. Install the equation renderer with `npm install --no-save --package-lock=false katex@0.19.1`.

Run `python tools/build_notes.py` after changes to the notes. Run these checks:

- `python tests/check_sources.py` checks the original files, page images, and source calculations.
- `python tests/check_expanded.py` checks 75 expanded calculations and the complete source-page map.
- `python tests/check_math_format.py` checks that the notes contain rendered equations without raw formulas.
- `node tests/check_practice.cjs` checks the 600 practice variants and the display and inline equations.
- `node tests/check_challenges.cjs` checks the 1,260-question bank, mathematical rendering, old progress, and preserved notes.
- `python tests/check_challenge_physics.py` independently checks the original 50 challenge calculations.
- `python tests/check_expanded_challenges.py` independently checks all 400 added calculation answers, phase conditions, vectors, and reachable motion.
- `node tests/check_study.cjs` checks the legacy 660-question bank, complete lesson exports, scheduling, storage compatibility, smart selection, exam persistence, and backups.

`tests/sixty-browser-flow.js` checks 60 challenge questions in each module through the interface, full working, and every choice explanation.

`tests/study-browser-flow.js` checks the study desk through its interface in an isolated browser. `tests/browser-flow.js` checks all 600 questions on `classic.html`.

Run `python tools/build_source_map.py` after changes to the source-page map definitions. Rebuild the notes after this command.

Run `python tools/prepare_sources.py` to rebuild the slide library. This command reads the original PDFs from the sibling `Module-ORG` directory.

GitHub Pages serves the `main` branch root. The website needs no server account or database. Fonts and KaTeX files are self-hosted. Their licenses accompany the assets. The supplied course materials belong to their respective owners.

The added loop-energy and source-power applications use the standard models described by [OpenStax: current-loop torque and energy](https://openstax.org/books/university-physics-volume-2/pages/11-5-force-and-torque-on-a-current-loop) and [OpenStax: emf and internal resistance](https://openstax.org/books/university-physics-volume-2/pages/10-1-electromotive-force). The questions state their additional assumptions.
