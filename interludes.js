(() => {
  'use strict';

  const projects = new Map((window.PORTFOLIO_PROJECTS || []).map(project => [project.id, project]));
  const compositions = {
    accidents: {
      number: 'I', title: ['Beautiful', 'accidents.'], line: 'A mark becomes a world.',
      works: [
        ['artist-process', 3, 'lines'],
        ['visual-experiments', 0, 'eye'],
        ['skateboard-graphics', 2, 'decks'],
        ['artist-process', 4, 'brush']
      ]
    },
    hours: {
      number: 'II', title: ['After', 'hours.'], line: 'Some ideas come alive when the lights go down.',
      works: [
        ['rudys', 10, 'room'],
        ['artist-elsewhere', 3, 'screens'],
        ['characters', 2, 'pixel']
      ]
    },
    souvenirs: {
      number: 'III', title: ['Impossible', 'souvenirs.'], line: 'Little things from places that do not quite exist.',
      works: [
        ['pool-objects-with-personality', 0, 'rabbit'],
        ['characters', 0, 'mug'],
        ['pool-wearable-graphics', 0, 'jersey'],
        ['pool-wearable-graphics', 4, 'phone']
      ]
    },
    thought: {
      number: 'IV', title: ['The shape', 'of a thought.'], line: 'An image, held somewhere between a memory and a material.',
      works: [
        ['artist-elsewhere', 0, 'relief'],
        ['pool-light-and-form', 2, 'portrait'],
        ['artist-process', 7, 'particles']
      ]
    }
  };

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

    composition.works.forEach(([id, index, role]) => {
      const project = projects.get(id);
      const artwork = project?.images?.[index];
      if (!artwork) return;
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
