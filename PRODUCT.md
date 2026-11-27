# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A college Physics 2 student uses the website to study for examinations on phones and computers.

## Product Purpose

Explain the supplied physics modules accurately. Show the derivations and every calculation step. Provide practice that helps the student revisit mistakes.

## Operating Context

The user supplies 18 PDFs across ten modules. The website retains those files and their 492 page images.

The user chooses full reviewer notes as the opening experience, with practice alongside. The TOPCIT Sprint reference supplies review techniques, not course content or visual identity.

## Capabilities and Constraints

Preserve the complete notes, 69 worked solutions, 34 expanded derivations, source corrections, and mathematical typesetting.

Keep question sets at a maximum of 60. Preserve the original website, saved progress, source bookmarks, and appearance preferences.

Publish the static website to the existing GitHub Pages repository. Progress stays in the browser. Export and import support movement between devices.

## Product Principles

- Keep the full explanations available.
- Put practice beside the relevant module.
- Show correct physics when a slide contains an error.
- Separate recorded practice performance from examination readiness.
- Keep the controls clear and limited.

## Evidence on Hand

The course sources appear in `modules/`, `slides/`, `sources.js`, and `audit/source-map.json`.

The full notes appear in `notes/` and `reviewer.html`. The existing question bank contains 600 numerical variants across 30 families.

The user confirms the main flow: “Full reviewer notes, with practice alongside.”
