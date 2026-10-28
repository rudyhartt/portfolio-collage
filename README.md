# Rudy Hartt — Previous portfolio design

A responsive portfolio of 27 curated collections, combining the original NewPortfolio archive, the 100-file artwork pool and the additional artist archive. The galleries contain 157 distinct still images, including process fragments, and six films.

## Site

This repository preserves the previous RUDY HARTT portfolio design at https://rudyhartt.github.io/portfolio-collage/. The current continuous-collage portfolio is published at https://meet-love.com/.

The portfolio keeps the original visual worlds in sequence: **Paper Riot → Electric Playground → Hyperdream → Afterimage**. Eight featured original projects sit between the first three worlds, under one RUDY HARTT masthead and one main navigation. The hero uses the original twisting graphic ribbon collage, restored before the skateboard edits. The **Cut Through** collage banner and four featured collections connect Paper Riot to Electric Playground, with two more featured collections before Hyperdream. Deeper cutouts run through the artwork and page transitions. The public location label is Worldwide.

The panoramas are AI-assisted collage interpretations of the supplied artwork. Gallery media retains the supplied work, using approved localized-blur copies in four cases. The 100 uploaded pool files resolve to 90 distinct stills and four distinct clips; six exact duplicate pairs are represented once, with every original filename retained in `sourceFiles` metadata.

The closing **Afterimage** chapter follows Hyperdream and introduces the final selection with a grayscale collage banner. The supplied artwork retains its original colour in the featured selection and galleries.

The 21-file `artist.zip` adds four presentation visuals and eight clearly labelled process fragments in **Elsewhere** and **Notes, marks & fragments**. Eight large artwork exports are alternate-resolution copies of compositions already shown, and the movie is an exact duplicate of the existing WAOW!! film; these are represented once. `window.ARTIST_SOURCE_MAP` accounts for all 21 filenames. Transparent process images use neutral display backgrounds without altering their pixels.

The **LOVE** feature follows the complete index and precedes About. Its light-pink layout retains the three approved feature views — Presence, Objects and Character — with native HTML headings and captions. Opening **Explore LOVE** reveals four new standalone images: Presence, In motion, Objects and A quiet moment. These AI-assisted product concept studies explore a fictional companion and accompanying objects; they are not photographs of working hardware.

A buildless static website with category filtering, deep links to projects, keyboard-accessible artwork viewers, native video playback, an about section and a closing portfolio sign-off. No framework, third-party scripts, tracking, backend or paid service is required.

GitHub Pages serves the root of `main` at the project-subdirectory URL above. This previous design has no `CNAME`; the custom domain remains attached to `rudyhartt/portfolio`, which now serves the continuous collage. Both sites retain `noindex, nofollow`.

The original design is preserved on the [V1 branch](https://github.com/rudyhartt/portfolio/tree/V1), at commit [`102b4fec8bdb5e9458d3a804ce076d67b3cb0a80`](https://github.com/rudyhartt/portfolio/tree/102b4fec8bdb5e9458d3a804ce076d67b3cb0a80).

## Editing

- `index.html`: four-chapter sequence, featured projects, biography, closing sign-off and metadata.
- `projects.js`: the original 13 project galleries, preserved.
- `pool-projects.js`: 12 new curated collections, descriptive captions, source-file mappings and four new films.
- `artist-projects.js`: two closing collections, featured selections and artist-archive duplicate mapping.
- `immersive.css`: the original three-world layout and responsive typography.
- `cut-through.css`: sharper cuts, new collage interlude and featured pool work.
- `afterimage.css`: the grayscale closing chapter and uncropped featured artwork.
- `love.css`: the light-pink LOVE feature and responsive three-shot layout.
- `love-project.js`: LOVE project details and four standalone gallery images.
- `style.css`: shared base styles, project dialogs and artwork viewer.
- `app.js`: filters, project dialogs, image viewer and hash navigation.
- `assets/`: optimised WebP images, H.264 MP4 films and a DejaVu Sans Bold display-font subset (`display.woff`, with `FONT-LICENSE.txt`).
- `assets/world-{paper,cut-through,electric,hyperdream,afterimage}.webp`: current collage panoramas with responsive variants.
- `assets/pool/`: web-optimized pool images, thumbnails, films and posters. Four sensitive source images are represented only by their approved blurred derivatives.
- `assets/artist/`: twelve additional presentation/process images and cover thumbnails, preserving original colour and transparency.
- `assets/love/approved-study.webp`: the approved LOVE composition used for its three product-shot image windows.
- `assets/love/love-*.webp`: four new full-frame LOVE studies shown in the project gallery and artwork viewer.
- `source-assets.csv`: a mapping back to original supplied asset filenames.

To add a project, add an entry to `window.PORTFOLIO_PROJECTS` in `projects.js`, include its assets, and choose an existing filter category. Gallery artwork is displayed without cropping; cover images are cropped for presentation.

For local preview, serve this directory with any static HTTP server, for example `python3 -m http.server 8000`, then open localhost:8000. No build step is needed.

## Source notes

Project groupings and descriptions were prepared from the supplied artwork and professional background documents. Unverified commissions are not presented as client relationships. Studio Ghibli is labelled as an independent concept. Existing brand and character rights remain with their respective owners.

The original ZIP, Pages document and profile/CV PDFs are not published. The biography draws on the professional documents. The public email address and email links have been removed at the artist’s request. Unused institutional logos are excluded from the deployed assets.

## Validation

Run `node --check app.js`, `node --check projects.js`, `node --check pool-projects.js`, `node --check artist-projects.js`, `node --check love-project.js`, and `python3 scripts/check_site.py`. The asset check covers all 100 pool source filenames and all 21 artist-archive entries, four distinct LOVE gallery images, duplicate grouping, the retained catalogue, one H1 and main navigation, chapter order, featured project links, responsive image sources and CSS asset URLs. All local links and asset paths must work within the GitHub Pages project subdirectory.

Before publishing, check desktop and 390px mobile layouts, filters, featured project links, gallery navigation, artwork enlargement, Escape handling, focus restoration and video playback. Invalid project URLs should return safely to the work section. These are verification instructions, not a claim that a particular revision has passed browser review.

Copyright © Rudy Hartt. All rights reserved for original portfolio artwork and content. No blanket licence is granted to third-party brands or characters. The bundled font retains its accompanying licence.
