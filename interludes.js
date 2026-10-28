(() => {
  'use strict';

  const artworkBySource = new Map();
  (window.PORTFOLIO_PROJECTS || []).forEach(project => {
    project.images.forEach((artwork, index) => artworkBySource.set(artwork.src, {project, artwork, index}));
  });
  const compositions = window.COLLAGE_INTERLUDES;

  document.querySelectorAll('[data-interlude]').forEach(slot => {
    const key = slot.dataset.interlude;
    const composition = compositions[key];
    if (!composition || slot.dataset.interludeReady) return;
    slot.dataset.interludeReady = 'true';
    const section = document.createElement('section');
    section.className = `interlude interlude-${key}`;
    section.setAttribute('aria-labelledby', `interlude-title-${key}`);

    const scenery = document.createElement('div');
    scenery.className = 'interlude-scenery';
    scenery.setAttribute('aria-hidden', 'true');
    scenery.innerHTML = '<span class="interlude-orbit"></span><span class="interlude-orbit interlude-orbit-second"></span>';
    section.append(scenery);

    const heading = document.createElement('header');
    heading.className = 'interlude-copy';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'interlude-eyebrow';
    eyebrow.textContent = `${composition.number} / A collected world`;
    const title = document.createElement('h2');
    title.className = 'interlude-title';
    title.id = `interlude-title-${key}`;
    composition.title.forEach(line => {
      const span = document.createElement('span');
      span.textContent = line;
      title.append(span);
    });
    const description = document.createElement('p');
    description.className = 'interlude-description';
    description.textContent = composition.line;
    heading.append(eyebrow, title, description);
    section.append(heading);

    composition.works.forEach(([src, role]) => {
      const match = artworkBySource.get(src);
      if (!match) return;
      const {project, artwork, index} = match;
      const id = project.id;
      const link = document.createElement('a');
      link.className = `interlude-art interlude-art-${role}`;
      link.href = `#project/${id}`;
      link.dataset.openWork = `${id}:${index}`;
      link.setAttribute('aria-label', `Open ${artwork.alt || project.title}`);
      const image = document.createElement('img');
      image.src = artwork.src;
      image.alt = artwork.alt || project.title;
      image.width = artwork.width || 1200;
      image.height = artwork.height || 1200;
      image.loading = 'lazy';
      image.decoding = 'async';
      link.append(image);
      const caption = document.createElement('span');
      caption.className = 'interlude-art-caption';
      caption.textContent = `${project.title} ↗`;
      link.append(caption);
      section.append(link);
    });
    const note = document.createElement('p');
    note.className = 'interlude-hint';
    note.textContent = 'Fragments from the collection. Open any image to look closer.';
    section.append(note);
    slot.append(section);
  });
})();
