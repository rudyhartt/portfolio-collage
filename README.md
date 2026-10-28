# RUDY HARTT — continuous collage experiment

An independent test version of the portfolio: one long visual journey through paper and ink, electric spaces, playful objects, sculptural studies and LOVE.

This repository is separate from `rudyhartt/portfolio`, which serves meet-love.com. It deliberately has **no CNAME**, and every HTML entry point includes **noindex, nofollow**. Do not attach the production custom domain to this experiment.

## Content

- All 28 collections: 161 still images and 6 films (167 works).
- Every original work appears in the scrolling collage; films appear as playable project links.
- Four new cross-collection compositions: Beautiful accidents, After hours, Impossible souvenirs, and The shape of a thought.
- A compact typographic masthead leading directly into Paper & ink, followed by the existing source images and panoramas.
- A filterable collection index, exact-image lightbox, keyboard navigation, project deep links, and lazy-loaded images.
- Responsive layouts and reduced-motion support; no external runtime dependencies.

## Files

`index.html` is the entry point. `collage.js` assembles the five continuous worlds from the existing data files. `collage.css` controls the composition. `interludes.js` and `interludes.css` supply the four original connecting sections. `gallery.js` and `gallery.css` manage the collection index, project galleries and lightbox.

Data loads in this order: `projects.js`, `pool-projects.js`, `artist-projects.js`, `love-project.js`. The old presentation files remain as source history but are not loaded by this experiment.

## Preview

Serve this folder using any static server, such as `python -m http.server 8000`. Open `/` for the portfolio, or `/preview.html` for 390px and 768px responsive review frames. GitHub Pages uses the `main` branch and repository root.

Click any still image to open it, use arrow keys to browse, and Escape to step back through the viewer. The index button and five chapter markers provide shortcuts through the long page.

## Image provenance

The artist's provided media and existing approved project assets are preserved. `assets/continuous-world.webp` is an unused AI-assisted composition derived from the existing portfolio panoramas and LOVE reference; it is retained as a study and is no longer loaded by the page. The four new interludes are live HTML/CSS compositions of original provided works. LOVE remains an imagined concept; its visuals are not photographs of working hardware. Source attribution and project notes remain in the data and galleries.
