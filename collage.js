(() => {
  'use strict';
  const projects = [...window.PORTFOLIO_PROJECTS, window.LOVE_PROJECT];
  const reservedArt = new Set(Object.values(window.COLLAGE_INTERLUDES).flatMap(composition => composition.works.map(([src]) => src)));
  const byId = new Map(projects.map(project => [project.id, project]));
  const worlds = [
    {id:'paper', name:'Paper & ink.', kicker:'01 / Cut, print, repeat', copy:'A mark on a page. A character on a sleeve. An idea that refuses to stay flat.', image:'world-paper.webp', interlude:'accidents', projects:['visual-experiments','skateboard-graphics','dreamkid','pool-collage-studies','pool-wearable-graphics']},
    {id:'electric', name:'Electric dreams.', kicker:'02 / Step into the image', copy:'Screens, spaces and characters. A little light, a lot of possibility.', image:'world-electric.webp', interlude:'hours', projects:['rudys','ghibli','piccollage','waow','red-badger','film','digital-characters','pool-character-cast','pool-motion-studies']},
    {id:'dream', name:'Other possible\nworlds.', kicker:'03 / The ordinary, reimagined', copy:'A familiar shape. An unfamiliar life. Objects with somewhere else to be.', image:'world-hyperdream.webp', interlude:'souvenirs', projects:['characters','little-worlds','pool-objects-with-personality','pool-creatures-daydreams','pool-pop-fizz','pool-digital-gestures','pool-printed-imaginations']},
    {id:'sculpture', name:'Forms &\nfeelings.', kicker:'04 / Somewhere between', copy:'Faces become landscapes. Light becomes material. Something imagined begins to feel real.', image:'world-afterimage.webp', interlude:'thought', projects:['pool-portrait-fragments','pool-future-faces','pool-light-and-form','artist-elsewhere','artist-process']},
    {id:'love', name:'LOVE.', kicker:'05 / A companion with a story', copy:'Presence, movement, objects and a quiet moment. An imagined future, in soft pink.', image:'love/love-banner-centred.webp', projects:['love']}
  ];
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const flow = document.querySelector('#work');
  let artworkNumber = 0;
  worlds.forEach((world, worldIndex) => {
    // Interleave related projects so each composition becomes a conversation between works.
    const queues = world.projects.map(id => {
      const project = byId.get(id);
      return [...project.images.map((art,index) => ({art,index,project})), ...(project.videos || []).map(art => ({art,project,video:true}))]
        .filter(({art}) => !reservedArt.has(art.src));
    });
    const works = [];
    while (queues.some(queue => queue.length)) queues.forEach(queue => {if(queue.length) works.push(queue.shift());});
    const visibleWorkCount = works.length + (window.COLLAGE_INTERLUDES[world.interlude]?.works.length || 0);
    const section = document.createElement('section');
    section.className = `world world-${world.id}`;
    section.id = world.id;
    section.dataset.world = world.id;
    section.setAttribute('aria-labelledby',`${world.id}-title`);
    section.innerHTML = `<div class="world-intro"><img class="world-panorama" src="assets/${world.image}" alt="" loading="${worldIndex===0?'eager':'lazy'}" fetchpriority="${worldIndex===0?'high':'auto'}" decoding="async"><div class="world-heading"><span class="eyebrow">${world.kicker}</span><h2 id="${world.id}-title">${world.name.replace('\n','<br>')}</h2><p>${world.copy}</p><span class="world-count">${visibleWorkCount} works in this chapter</span></div></div>`;
    for(let start=0; start<works.length; start+=5){
      const batch=works.slice(start,start+5);
      const scene=document.createElement('div');
      scene.className=`art-scene arrangement-${(start/5 + worldIndex)%3} pieces-${batch.length}`;
      scene.setAttribute('aria-label',`${world.name.replace('\n',' ')} — composition ${start/5+1}`);
      batch.forEach(({art,index,project,video},slot) => {
        artworkNumber++;
        const ratio=(art.width||16)/(art.height||9);
        const figure=document.createElement('figure');
        figure.className=`art-piece slot-${slot}${ratio < .8 ? ' portrait' : ratio>1.6 ? ' wide' : ''}${video?' film-piece':''}`;
        figure.style.setProperty('--ratio',ratio);
        const src=video?art.poster:art.src;
        figure.innerHTML=`<a href="#project/${project.id}" ${video?'':`data-open-work="${project.id}:${index}"`} aria-label="${escape(video?`Play ${art.title}`:`View ${project.title}: ${art.alt}`)}"><img src="${escape(src)}" width="${art.width||1600}" height="${art.height||900}" alt="${escape(video?art.title:art.alt)}" loading="lazy" decoding="async">${video?'<span class="film-play" aria-hidden="true">▶</span>':''}<figcaption><span>${escape(project.title)}</span><span>${video?'Film ↗':String(artworkNumber).padStart(3,'0')+' ↗'}</span></figcaption></a>`;
        scene.append(figure);
      });
      section.append(scene);
    }
    if(world.id==='love')section.insertAdjacentHTML('beforeend','<p class="love-note">LOVE is a concept study for SYMB10. AI-assisted visualisations of an imagined companion and its objects.</p>');
    if(world.interlude){const interlude=document.createElement('div');interlude.dataset.interlude=world.interlude;section.append(interlude);}
    flow.append(section);
  });
  document.querySelector('#year').textContent=new Date().getFullYear();
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){document.querySelectorAll('[data-world-link]').forEach(link=>{const active=link.dataset.worldLink===entry.target.dataset.world;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}},{rootMargin:'-20% 0px -60% 0px'});
  document.querySelectorAll('[data-world]').forEach(world=>observer.observe(world));
  let scheduled=false;
  const progress=document.querySelector('.reading-progress span');
  function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;scheduled=false;}
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});
  updateProgress();
})();
