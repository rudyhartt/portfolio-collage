(() => {
  'use strict';

  const projects = [...(window.PORTFOLIO_PROJECTS || [])];
  if (window.LOVE_PROJECT && !projects.some(project => project.id === window.LOVE_PROJECT.id)) {
    projects.push(window.LOVE_PROJECT);
  }
  if (!projects.length) return;

  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const projectById = new Map(projects.map(project => [project.id, project]));
  const mediaCount = project => (project.images?.length || 0) + (project.videos?.length || 0);
  const image = (art, thumbnail = false, decorative = false) => `<img src="${escape(thumbnail ? art.thumb || art.src : art.src)}" alt="${decorative ? '' : escape(art.alt)}" width="${Number(art.width) || 1000}" height="${Number(art.height) || 1000}" loading="lazy" decoding="async"${art.background ? ` style="background-color:${escape(art.background)}"` : ''}>`;

  const index = document.createElement('dialog');
  index.id = 'collage-index';
  index.className = 'gallery-modal index-modal';
  index.setAttribute('aria-labelledby', 'collage-index-title');
  index.innerHTML = `<div class="gallery-toolbar"><span class="gallery-eyebrow">The complete collection</span><button class="gallery-close" type="button" data-close-index aria-label="Close collection index">Close <span aria-hidden="true">×</span></button></div><div class="index-intro"><h2 id="collage-index-title">All the work.</h2><p><span>${projects.length} collections</span><span>${projects.reduce((count, project) => count + mediaCount(project), 0)} works &amp; studies</span></p></div><div class="index-filters" role="group" aria-label="Filter collections"></div><p class="gallery-visually-hidden" id="collage-filter-status" aria-live="polite" aria-atomic="true"></p><div class="index-grid"></div>`;

  const projectDialog = document.createElement('dialog');
  projectDialog.id = 'collage-project';
  projectDialog.className = 'gallery-modal gallery-project';
  projectDialog.setAttribute('aria-labelledby', 'collage-project-title');
  projectDialog.innerHTML = `<div class="gallery-toolbar"><span class="gallery-eyebrow">A closer look</span><button class="gallery-close" type="button" data-close-project aria-label="Close project">Close <span aria-hidden="true">×</span></button></div><div class="gallery-project-content"></div><nav class="gallery-pagination" aria-label="More collections"><button type="button" data-project-step="-1">← Previous collection</button><button type="button" data-project-step="1">Next collection →</button></nav>`;

  const lightbox = document.createElement('dialog');
  lightbox.id = 'collage-lightbox';
  lightbox.className = 'gallery-lightbox';
  lightbox.setAttribute('aria-label', 'Enlarged artwork');
  lightbox.innerHTML = `<button class="gallery-close gallery-lightbox-close" type="button" data-close-lightbox aria-label="Close enlarged artwork">Close <span aria-hidden="true">×</span></button><button class="gallery-lightbox-prev" type="button" data-image-step="-1" aria-label="Previous artwork">←</button><figure><img class="gallery-full-image" alt=""><figcaption class="gallery-image-caption" aria-live="polite" aria-atomic="true"></figcaption></figure><button class="gallery-lightbox-next" type="button" data-image-step="1" aria-label="Next artwork">→</button>`;
  document.body.append(index, projectDialog, lightbox);

  let indexRendered = false;
  let currentProject = null;
  let currentImage = 0;
  let indexReturnFocus = null;
  let projectReturnFocus = null;
  let imageReturnFocus = null;
  let backgroundURL = history.state?.__rudyCollageGallery?.backgroundURL || location.pathname + location.search + (location.hash.startsWith('#project/') ? '' : location.hash);

  const updateScrollLock = () => {
    const open = index.open || projectDialog.open || lightbox.open;
    document.documentElement.classList.toggle('gallery-is-open', open);
    document.body.classList.toggle('gallery-is-open', open);
  };
  const restoreFocus = (target, preventScroll = true) => {
    if (target instanceof HTMLElement && target.isConnected && target.getClientRects().length && !target.closest('dialog:not([open])')) {
      target.focus({preventScroll});
    }
  };
  const pauseFilms = () => projectDialog.querySelectorAll('video').forEach(video => video.pause());

  function renderIndex() {
    if (indexRendered) return;
    indexRendered = true;
    const preferred = ['Identity', 'Digital', 'Objects', 'Spaces', 'Moving image', 'Visual studies'];
    const present = [...new Set(projects.map(project => project.category))];
    const categories = ['All work', ...preferred.filter(category => present.includes(category)), ...present.filter(category => !preferred.includes(category))];
    index.querySelector('.index-filters').innerHTML = categories.map((category, position) => `<button type="button" data-category="${escape(category)}" aria-pressed="${position === 0}">${escape(category)}</button>`).join('');
    index.querySelector('.index-grid').innerHTML = projects.map((project, position) => {
      const cover = project.cover || project.images?.[0];
      return `<article class="index-card" data-project-category="${escape(project.category)}"><a href="#project/${encodeURIComponent(project.id)}" aria-label="Explore ${escape(project.title)}"><div class="index-cover">${cover ? image(cover, true, true) : ''}<span class="index-cover-arrow" aria-hidden="true">↗</span></div><div class="index-card-heading"><h3>${escape(project.title)}</h3><span>${String(position + 1).padStart(2, '0')}</span></div><p>${escape(project.subtitle || project.category)}</p></a></article>`;
    }).join('');
    index.querySelector('#collage-filter-status').textContent = `${projects.length} collections shown.`;
  }

  function openIndex(trigger = document.activeElement) {
    renderIndex();
    if (index.open) return;
    indexReturnFocus = trigger;
    index.showModal();
    updateScrollLock();
    index.querySelector('[data-close-index]').focus({preventScroll: true});
  }

  function closeLightbox({focus = true} = {}) {
    if (!lightbox.open) return;
    lightbox.close();
    updateScrollLock();
    if (focus) restoreFocus(imageReturnFocus, false);
  }

  function closeProject({updateURL = true, focus = true} = {}) {
    if (!projectDialog.open) return;
    closeLightbox({focus: false});
    pauseFilms();
    projectDialog.close();
    if (updateURL && location.hash.startsWith('#project/')) {
      if (history.state?.__rudyCollageGallery) history.back();
      else history.replaceState(history.state, '', backgroundURL);
    }
    updateScrollLock();
    if (focus) {
      restoreFocus(projectReturnFocus);
      if (index.open && !index.contains(document.activeElement)) index.querySelector('[data-close-index]').focus({preventScroll: true});
    }
  }

  function closeIndex() {
    if (!index.open) return;
    closeProject({focus: false});
    index.close();
    updateScrollLock();
    restoreFocus(indexReturnFocus);
  }

  function showProject(id, trigger = document.activeElement) {
    const project = projectById.get(id);
    if (!project) return;
    if (projectDialog.open && currentProject?.id === id) return;
    closeLightbox({focus: false});
    pauseFilms();
    if (!projectDialog.open) projectReturnFocus = trigger;
    currentProject = project;
    const videos = (project.videos || []).map(video => `<figure class="gallery-video"><video controls playsinline preload="none" poster="${escape(video.poster)}" aria-label="${escape(video.title)}"><source src="${escape(video.src)}" type="video/mp4">Your browser does not support this film. <a href="${escape(video.src)}">Open the film</a>.</video><figcaption>${escape(video.title)}</figcaption></figure>`).join('');
    const stills = (project.images || []).map((art, position) => `<figure class="gallery-still${art.width > art.height * 1.5 ? ' gallery-wide' : ''}"><button type="button" class="gallery-artwork-button" data-image="${position}" aria-label="Enlarge: ${escape(art.alt)}">${image(art)}</button><figcaption>${escape(art.alt)}</figcaption></figure>`).join('');
    projectDialog.querySelector('.gallery-project-content').innerHTML = `<div class="gallery-project-heading"><div><p class="gallery-eyebrow">${escape(project.category)}</p><h2 id="collage-project-title">${escape(project.title)}</h2></div><div class="gallery-project-description"><p>${escape(project.summary)}</p>${project.note ? `<p class="gallery-project-note">${escape(project.note)}</p>` : ''}</div></div><div class="gallery-media-grid">${videos}${stills}</div>`;
    if (!projectDialog.open) projectDialog.showModal();
    projectDialog.scrollTop = 0;
    updateScrollLock();
    projectDialog.querySelector('[data-close-project]').focus({preventScroll: true});
  }

  function navigateProject(id, {replace = false, trigger = document.activeElement} = {}) {
    if (!projectById.has(id)) return;
    const replacingProject = replace || location.hash.startsWith('#project/');
    if (!replacingProject) backgroundURL = location.pathname + location.search + location.hash;
    const url = location.pathname + location.search + '#project/' + encodeURIComponent(id);
    if (location.hash !== '#project/' + encodeURIComponent(id)) {
      const state = history.state && typeof history.state === 'object' ? {...history.state} : {};
      if (!replacingProject) state.__rudyCollageGallery = {backgroundURL};
      history[replacingProject ? 'replaceState' : 'pushState'](state, '', url);
    }
    showProject(id, trigger);
  }

  function openWork(id, position, trigger = document.activeElement) {
    const project = projectById.get(id);
    if (!project || !Number.isInteger(position) || position < 0 || position >= (project.images?.length || 0)) return;
    navigateProject(id, {trigger});
    displayImage(position, projectDialog.querySelector(`[data-image="${position}"]`));
  }

  function displayImage(position, trigger = document.activeElement) {
    const images = currentProject?.images || [];
    if (!images.length) return;
    currentImage = (position + images.length) % images.length;
    const art = images[currentImage];
    const fullImage = lightbox.querySelector('.gallery-full-image');
    fullImage.src = art.src;
    fullImage.alt = art.alt || currentProject.title;
    fullImage.style.backgroundColor = art.background || '';
    lightbox.querySelector('.gallery-image-caption').textContent = `${currentImage + 1} / ${images.length} — ${art.alt || currentProject.title}`;
    lightbox.querySelectorAll('[data-image-step]').forEach(button => { button.disabled = images.length < 2; });
    if (!lightbox.open) {
      imageReturnFocus = trigger;
      lightbox.showModal();
      lightbox.querySelector('[data-close-lightbox]').focus({preventScroll: true});
    }
    updateScrollLock();
  }

  function route() {
    if (!location.hash.startsWith('#project/')) {
      closeProject({updateURL: false});
      backgroundURL = location.pathname + location.search + location.hash;
      return;
    }
    let id;
    try { id = decodeURIComponent(location.hash.slice(9)); } catch { closeProject({updateURL: false}); return; }
    if (projectById.has(id)) showProject(id);
    else closeProject({updateURL: false});
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const indexTrigger = event.target.closest('[data-open-index]');
    if (indexTrigger) {
      event.preventDefault();
      openIndex(indexTrigger);
      return;
    }
    const workTrigger = event.target.closest('[data-open-work]');
    if (workTrigger) {
      const value = workTrigger.dataset.openWork;
      const separator = value.lastIndexOf(':');
      const id = value.slice(0, separator);
      const position = Number(value.slice(separator + 1));
      if (separator > 0 && projectById.has(id) && Number.isInteger(position) && position >= 0 && position < (projectById.get(id).images?.length || 0)) {
        event.preventDefault();
        openWork(id, position, workTrigger);
        return;
      }
    }
    const link = event.target.closest('a[href^="#project/"]');
    if (!link) return;
    let id;
    try { id = decodeURIComponent(link.getAttribute('href').slice(9)); } catch { return; }
    if (!projectById.has(id)) return;
    event.preventDefault();
    navigateProject(id, {trigger: link});
  });

  index.querySelector('[data-close-index]').addEventListener('click', closeIndex);
  projectDialog.querySelector('[data-close-project]').addEventListener('click', () => closeProject());
  lightbox.querySelector('[data-close-lightbox]').addEventListener('click', () => closeLightbox());

  index.querySelector('.index-filters').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    const category = button.dataset.category;
    index.querySelectorAll('[data-category]').forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    let visible = 0;
    index.querySelectorAll('.index-card').forEach(card => {
      card.hidden = category !== 'All work' && card.dataset.projectCategory !== category;
      if (!card.hidden) visible++;
    });
    index.querySelector('#collage-filter-status').textContent = `${visible} ${visible === 1 ? 'collection' : 'collections'} shown for ${category}.`;
  });

  projectDialog.addEventListener('click', event => {
    const artwork = event.target.closest('[data-image]');
    if (artwork) displayImage(Number(artwork.dataset.image), artwork);
    const pagination = event.target.closest('[data-project-step]');
    if (pagination && currentProject) {
      const next = (projects.indexOf(currentProject) + Number(pagination.dataset.projectStep) + projects.length) % projects.length;
      navigateProject(projects[next].id, {replace: true});
    }
  });
  lightbox.addEventListener('click', event => {
    const button = event.target.closest('[data-image-step]');
    if (button) displayImage(currentImage + Number(button.dataset.imageStep));
  });
  lightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      displayImage(currentImage + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });

  for (const [dialog, close] of [[index, closeIndex], [projectDialog, () => closeProject()], [lightbox, () => closeLightbox()]]) {
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    dialog.addEventListener('close', updateScrollLock);
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);
  route();

  window.PortfolioGallery = Object.freeze({openIndex, openProject: navigateProject, openWork, projectCount: projects.length});
})();
