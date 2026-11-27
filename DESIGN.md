---
name: "Field Notes"
description: "An annotated physics notebook with a reading-first study workspace."
colors:
  bg: "#f0f5fe"
  surface: "#fff"
  surface-2: "#e9f0fc"
  surface-3: "#dee7f7"
  ink: "#172544"
  muted: "#5c6980"
  line: "#d4deee"
  accent: "#365bd8"
  accent-soft: "#e8edff"
  accent-ink: "#294ba9"
  positive-bg: "#e7f4ef"
  positive-ink: "#216449"
  danger-bg: "#fff0f0"
  danger-ink: "#9c3650"
  warning-bg: "#fff4d5"
  warning-ink: "#765617"
  marker: "#ffe8a3"
  accent-lagoon: "#087b82"
  accent-soft-lagoon: "#def1ee"
  accent-ink-lagoon: "#08636b"
  accent-peach: "#a64c37"
  accent-soft-peach: "#ffebe2"
  accent-ink-peach: "#923f2f"
  bg-dark: "#121b2e"
  surface-dark: "#19253b"
  surface-2-dark: "#1d2c44"
  surface-3-dark: "#253550"
  ink-dark: "#e5eeff"
  muted-dark: "#b1bfd7"
  line-dark: "#35455e"
  accent-dark: "#9ebaff"
  accent-soft-dark: "#253759"
  accent-ink-dark: "#b4caff"
  positive-bg-dark: "#193d35"
  positive-ink-dark: "#9de4c2"
  danger-bg-dark: "#462c3a"
  danger-ink-dark: "#ffc0cc"
  warning-bg-dark: "#3d3523"
  warning-ink-dark: "#f3d688"
  marker-dark: "#52472c"
  accent-lagoon-dark: "#81d7d1"
  accent-soft-lagoon-dark: "#1d3b43"
  accent-ink-lagoon-dark: "#9de8df"
  accent-peach-dark: "#ffbb9e"
  accent-soft-peach-dark: "#412f37"
  accent-ink-peach-dark: "#ffceb8"
typography:
  display:
    fontFamily: "Bricolage, sans-serif"
    fontSize: "34px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-.025em"
  headline:
    fontFamily: "Bricolage, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-.025em"
  title:
    fontFamily: "Bricolage, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-.025em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "16px"
    lineHeight: 1.88
  control:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "11px"
rounded:
  field: "6px"
  control: "7px"
  solution: "8px"
  panel: "12px"
spacing:
  choice-gap: "9px"
  action-gap: "12px"
  panel-inset: "27px"
  paper-inline: "30px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#fff"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  search-input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "9px 12px"
    width: "214px"
  navigation-current:
    textColor: "{colors.accent-ink}"
  count-chip:
    backgroundColor: "{colors.accent-soft}"
    rounded: "5px"
    padding: "0 4px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "27px"
  answer-choice:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px"
---

# Design System: Field Notes

## Overview

**Creative North Star: "Field Notes"**

Field Notes uses cool paper, clear rules, and restrained color. The study workspace extends the existing notebook identity. The full notes remain the main reading surface.

The existing palette and bundled fonts remain the visual authority. The earlier website and standalone notebook retain their own presentation.

**Key Characteristics:**

- Cool paper surfaces with thin rules.
- Bricolage headings with DM Sans reading text.
- Theme-aware accents and explicit answer states.
- A reading column with a narrower practice margin.

## Colors

The palette uses cool neutrals with one selected accent. `palette.css` owns the runtime values and theme selection.

### Primary

Daydream supplies the default accent. Lagoon and Peach supply the other accent preferences. Each preference has light and dark variants.

Use the accent for primary actions, active navigation, and selected answers. Use the soft accent for selected backgrounds. Use accent ink for readable accent text.

### Neutral

Use background for the outer workspace and paper for reading panels. Use secondary surfaces for contained explanations and hover states.

Use ink for content, muted ink for supporting text, and rules for boundaries. The frontmatter records explicit dark variants with the `-dark` suffix.

### Feedback

Use the positive pair for correct answers, the danger pair for incorrect answers, and the warning pair for caution states.

Pair answer colors with visible text. Keep marker color available for text selection and source annotations.

### Named Rules

**The Shared Palette Rule.** Use the selected theme’s semantic variables for new surfaces.

## Typography

**Display Font:** Bricolage, with a sans-serif fallback.

**Body Font:** DM Sans, with a sans-serif fallback.

**Mathematical Font:** Bundled KaTeX fonts.

The bundled files in `assets/fonts` provide the heading and body faces. Mathematical notation retains the existing KaTeX presentation.

### Hierarchy

- **Display:** Use the recorded display role for workspace page headings. Reading chapter headings use 32px on wide screens.
- **Headline:** Use the recorded headline role for reading section headings.
- **Title:** Use the recorded title role for smaller workspace headings. Solution headings use 21px.
- **Body:** Use the recorded body role for the wide reading column. The general workspace uses 15px text with a 1.65 line height.
- **Control:** Use the recorded control role for standard workspace buttons.
- **Label:** Use the recorded label size as the floor for new workspace labels.

Reading text uses 15px between 1051px and 1250px, and at widths of 480px or less. Other workspace widths use 16px.

Reading line height is 1.88, or 1.9 at widths of 480px or less. Worked solutions use 14px text before the reading scale.

The roomier-reading preference multiplies notes and solution text by 1.12. The standalone notebook retains its existing 16–17px reading scale.

### Named Rules

**The Reading Scale Rule.** Apply the saved reading scale to notes and worked solutions. Keep control text independent of that scale.

## Layout

The study workspace has a course index, a reading column, and a practice margin. This layout belongs to the workspace extension.

The shell stops at 1800px. The course index uses 216px, or 185px at widths of 1250px or less.

The main area uses a flexible reading column and a 286px practice margin. The reading text stops at 69ch.

At 1600px and above, the margin increases to 310px and the column gap increases to 40px.

At 1050px and below, the course index disappears. The persistent module selector remains available in the reading panel.

At 820px and below, the practice margin moves after the notes. A Practice button opens the focused check view.

At the same breakpoint, the main navigation moves to a fixed bottom bar. The mobile header is 69px high.

At 480px and below, forms use one column and panel padding decreases. A further 360px breakpoint adjusts narrow controls.

The desktop header is 76px high. The reading panel uses a thin border, restrained rounding, and generous internal space.

The first study viewport contains actual notes and a related question. Other workspace pages use a centered column that stops at 1030px.

## Elevation & Depth

The workspace uses surface changes and thin rules for depth. Search results and the appearance dialog use neutral black shadows.

### Shadow Vocabulary

- **Search results:** `0 16px 34px #00000018` separates the search popup from the page.
- **Workspace appearance dialog:** `0 18px 48px #00000030` separates the modal from the workspace.

The shared appearance backdrop uses `#0c1729a8` with 4px blur. This backdrop remains distinct from the neutral workspace shadows.

### Named Rules

**The Workspace Depth Rule.** Keep the workspace flat at rest. Use neutral shadows for search results and the appearance dialog.

## Shapes

Use softly rounded rectangles for workspace controls and panels. The frontmatter records the repeated field, control, solution, and panel radii.

Use circular appearance controls and small rounded count chips. Use one-pixel semantic rules for reading panels, choices, and section boundaries.

Keep source images at their original aspect ratio. Allow equations and tables to scroll within their containers.

## Components

### Buttons

Workspace buttons use compact, clear text and a minimum height of 40px. Small buttons use a minimum height of 34px.

Primary buttons use the selected accent with white text. Dark mode uses dark text on the lighter selected accent.

Secondary buttons use paper, ink, and a thin rule. Hover changes the surface and border. Pressed controls use the soft accent and accent border.

Button transitions use 0.16s ease-out for background and border color. Keyboard focus uses a two-pixel accent outline with a four-pixel offset.

### Chips

Navigation counts use a compact soft-accent chip. They report a count and do not act as a separate control.

### Cards / Containers

Reading paper and workspace panels use the panel radius. The paper uses a larger horizontal inset than the standard panel.

Keep ordinary panels flat. Use surface changes for nested explanations and answer feedback.

### Inputs / Fields

Search and form fields use paper, ink, a thin rule, and compact rounding. Use visible focus outlines for keyboard access.

Keep native select behavior. Apply the existing muted color to placeholder and supporting text.

### Navigation

The main navigation contains Study, Practice, Review, and Originals. The active item uses accent ink and a two-pixel accent line.

On phones, place the active line above the bottom navigation item. Keep module navigation separate from the main navigation.

### Reading Margin Check

Use the narrower practice column for a related question. Show the explanation after the answer. Place confidence controls after the explanation.

Answer choices use full-width bordered controls. Correct and incorrect states use their feedback colors and visible answer labels.

### Reading Sources and Solutions

Preserve the complete source content and mathematical notation. Hide redundant chapter labels within the workspace.

Keep solution-type labels visually hidden within the workspace reading area. Preserve their text for assistive technology.

Keep source links and source figures available. Preserve the original solution-label presentation in the standalone notebook.

## Do's and Don'ts

### Do:

- Do use the existing semantic color variables.
- Do keep the bundled heading and body fonts.
- Do preserve source figures and full explanations.
- Do keep new workspace labels at or above 11px.
- Do keep solution-type text available to assistive technology in the workspace.
- Do obey saved and system reduced-motion preferences.

### Don't:

- Don’t copy workspace size overrides into the standalone notebook.
- Don’t use the practice margin as the main reading column.
- Don’t use color alone to identify correct and incorrect answers.
- Don’t use inherited small labels or offset shadows as patterns for new surfaces.

Pre-existing drift remains in the earlier website, standalone notebook, and shared appearance controls. It includes sub-11px labels, decorative labels, offset shadows, and symbol controls.

These details are not design rules for new surfaces. This documentation pass preserves them because the authorized work extends the existing system.
