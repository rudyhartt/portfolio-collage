# RUDY HARTT — collage experiment

The test portfolio at https://rudyhartt.github.io/portfolio-collage/: one long visual journey through paper and ink, electric spaces, playful objects, sculptural studies and LOVE.

This repository, `rudyhartt/portfolio-collage`, hosts the collage experiment for further development. It deliberately has **no CNAME**. Every HTML entry point retains **noindex, nofollow**. The original portfolio design is restored at https://meet-love.com/ in `rudyhartt/portfolio`.

## Content

- 27 curated collections: 158 still images and 6 films (164 works).
- Every retained work appears once in the scrolling collage, including the interludes; films appear as playable project links. Fell and one duplicate pixel-rabbit presentation are omitted from the visible collection.
- Four new cross-collection compositions: Beautiful accidents, After hours, Impossible souvenirs, and The shape of a thought.
- A compact typographic masthead leading directly into Paper & ink, followed by the existing source images and panoramas.
- A filterable collection index, exact-image lightbox, keyboard navigation, project deep links, and lazy-loaded images.
- Responsive layouts and reduced-motion support; no external runtime dependencies.

## Files

`index.html` is the entry point. `collage.js` assembles the five continuous worlds from the existing data files. `collage.css` controls the composition. `curation.js` assigns unique artworks to the interludes; `interludes.js` and `interludes.css` supply the four original connecting sections. `gallery.js` and `gallery.css` manage the collection index, project galleries and lightbox.

Data loads in this order: `projects.js`, `pool-projects.js`, `artist-projects.js`, `love-project.js`. The old presentation files remain as source history but are not loaded by the current portfolio.

## Preview

Serve this folder using any static server, such as `python -m http.server 8000`. Open `/` for the portfolio, or `/preview.html` for 390px and 768px responsive review frames. GitHub Pages uses the `main` branch and repository root.

Click any still image in the collage to open it directly, use arrow keys to browse, and close or press Escape to return to the same place in the collage. Images opened from a collection gallery return to that gallery. Browser Back and Forward retain the direct-image view. The index button and five chapter markers provide shortcuts through the long page.

## Image provenance

The artist's provided media and existing approved project assets are preserved. `assets/continuous-world.webp` is an unused AI-assisted composition derived from the existing portfolio panoramas and LOVE reference; it is retained as a study and is no longer loaded by the page. The four new interludes are live HTML/CSS compositions of original provided works. `assets/love/love-banner-centred.webp` is a new AI-assisted LOVE portrait, composed with her full head around the vertical centre and displayed without a fade. Its prompt is recorded alongside the asset. `love-banner.css` keeps the portrait clear on wide and narrow screens. LOVE remains an imagined concept; its visuals are not photographs of working hardware. Source attribution and project notes remain in the data and galleries.

`assets/love/love-presence-profile.webp` is the distinct first LOVE gallery portrait, generated with the built-in image tool using the established LOVE images as identity and style references. Its final generation prompt is recorded in `assets/love/love-presence-profile-prompt.txt`.
