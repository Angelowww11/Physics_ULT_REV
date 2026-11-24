# Field Notes · Physics 2

[Open the website](https://angelowww11.github.io/Physics_ULT_REV/)

The website contains a detailed Physics 2 notebook, original course files, and numerical practice.

- Read ten chapters with worked examples, derivations, assumptions, units, and sign checks.
- Browse all 18 supplied PDFs and 492 page images.
- Choose 1–60 practice questions from one module or all modules.
- Use light, dark, or automatic mode with three color themes.
- Read the notes on a phone, or print them as a PDF.
- Export progress to move it between devices. Browser storage does not synchronize automatically.

The notes explain identified source errors. The original PDFs remain unchanged. Added extensions carry explicit labels. No finite notebook contains every possible exam derivation.

## Files

`notes/01.txt` through `notes/10.txt` contain the core notebook text and LaTeX. The corresponding `*-worked.txt` files contain the expanded explanations and solutions. The notes contain 69 worked-solution cards and 34 expanded derivation cards, plus the core explanations.

`reviewer.html` contains the generated reading page. The build renders its 96 display equations into HTML and MathML. Readers do not need a remote equation service.

`sources.js` records the source filenames, hashes, page text, and images. `audit/source-map.json` maps all 492 source pages to topics. Each module provides its source-page map beside the original file links. Covers, references, and blank pages remain in that map.

`practice-data.js` creates 600 numerical variants across 30 question families. `notebook.css` controls the reading layout. `palette.css` defines the three color themes and the light and dark modes.

The scanned companion PDFs contain embedded slides. Their PDF page numbers differ from the embedded slide numbers. Image-only pages retain their images; the website does not invent extracted text.

## Local preview

Run `python -m http.server 8098` from this directory. Open `http://localhost:8098`.

## Rebuild and checks

Install Python packages `markdown-it-py`, `pymupdf`, `Pillow`, and `sympy`. Install the equation renderer with `npm install --no-save --package-lock=false katex@0.19.1`.

Run `python tools/build_notes.py` after changes to the notes. Run these checks:

- `python tests/check_sources.py` checks the original files, page images, and source calculations.
- `python tests/check_expanded.py` checks 75 expanded calculations and the complete source-page map.
- `node tests/check_practice.cjs` checks the 600 practice variants and all 96 display equations.

Run `python tools/build_source_map.py` after changes to the source-page map definitions. Rebuild the notes after this command.

Run `python tools/prepare_sources.py` to rebuild the slide library. This command reads the original PDFs from the sibling `Module-ORG` directory.

GitHub Pages serves the `main` branch root. The website needs no server account or database. Fonts and KaTeX files are self-hosted. Their licenses accompany the assets. The supplied course materials belong to their respective owners.
