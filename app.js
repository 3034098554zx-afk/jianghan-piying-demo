
(() => {
  'use strict';
  const data = window.JianghanCatalog;
  const Craft = window.ShadowCraftUI;
  const $ = (selector) => document.querySelector(selector);
  const app = $('#app');
  const view = $('#view');
  const content = $('#view-content');
  const glyphs = Object.assign(Object.create(null),Object.fromEntries(data.glyphs.map(glyph => [glyph.id,glyph])));
  const threeFilm = 'stage/watch/film-three';
  const tabs = [
    ['stage','首页','home'], ['make','亲手制作','knife'], ['play','戏台','curtain'],
    ['shop','文创','gift'], ['case','我的','profile']
  ];
  const paths = {
    home:'<path d="m3 10 9-7 9 7M5 10v10h5v-5h4v5h5V10"/>',
    gift:'<path d="M3 8h18v4H3zM5 12v8h14v-8M12 8v12"/><path d="M12 8H8.6a2.9 2.9 0 1 1 2.1-4.7L12 8Zm0 0h3.4a2.9 2.9 0 1 0-2.1-4.7L12 8Z"/>',
    profile:'<circle cx="12" cy="7" r="4"/><path d="M4.5 21v-1.3a7.5 7.5 0 0 1 15 0V21z"/>',
    lens:'<circle cx="12" cy="12" r="8.3"/><circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none"/>',
    river:'<path fill="currentColor" stroke="none" d="M2.2 15.9c5.1-2.8 7.6-3.2 11.1-1.5 3 1.5 5.9 2.2 8.5 1.6-3.3 2.2-6.5 1.6-10.4-.1-3-1.3-5.8-.6-9.2.1Zm3.4-5.6C9 7.1 12.7 6 16.5 7.5c2 .9 3.8 1.9 5.6 1.9-2.4.9-4.6.5-7.1-.4-2.8-.9-5.9 0-9.4 1.3Z"/><path d="M2 12.9c4.5-.6 7.8-3.5 12.6-1.7 3.9 1.5 6 1.6 8.2.4M3.3 18.7c4.5-.5 6.1-1.2 9.9.3" stroke-width=".7" opacity=".65"/>',
    chisel:'<path fill="currentColor" stroke="none" d="m14.7 8.3 5.2-5.5a1.5 1.5 0 0 1 2.2 2.1l-5.2 5.5zM11 12.5l3-3.4 2.1 2-3 3.3zM2.4 20.2l4.7-2.1 3.1-4.6 2.1 2-3.4 4.8L2 22z"/>',
    type:'<path d="M3.6 5.1h15.9M5.5 12.2h15M8 3v17m6.2-5.8v4.3l-2 2.4h-3M18.7 3.8v16.7"/><path d="M15.2 6.7h5.4M16.1 13.9h5.8" stroke-width=".75" opacity=".5"/>',
    curtain:'<path d="M2 4h20l-1 3c-3.1 2-6.9 1.7-9 0-2.1 1.7-5.9 2-9 0zM3 8c2 .8 3.1.8 4.9.5-.8 4-2.4 6.3-4.9 7.6L2 20h4.5l.6-3.5C8.1 14.8 9 12.4 9.3 9a7 7 0 0 1-1.5-.2M21 8c-2 .8-3.1.8-4.9.5.8 4 2.4 6.3 4.9 7.6L22 20h-4.5l-.6-3.5c-1-1.7-1.9-4.1-2.2-7.5a7 7 0 0 0 1.5-.2" fill="currentColor" stroke="none"/>',
    stage:'<path d="M3 5h18v14H3zM3 8c4 0 7-1 9-3 2 2 5 3 9 3M7 9c0 4-1 6-4 8m14-8c0 4 1 6 4 8M8 19v2m8-2v2"/>',
    hand:'<path d="m8 14-3-3c-1.4-1.2-3 .4-2 1.7L7 19c.7 1.1 2 2 3.5 2H14c3 0 5-2 5-5V9a1.5 1.5 0 0 0-3 0v4-7a1.5 1.5 0 0 0-3 0v6-8a1.5 1.5 0 0 0-3 0v8-5a1.5 1.5 0 0 0-3 0v5"/>',
    knife:'<path d="M4 18 14 5l5-2-1 6L7 21 4 18Zm7-9 5 4M3 22h10"/>',
    bag:'<path d="M5 8h14l2 13H3L5 8Zm3 2V6a4 4 0 0 1 8 0v4M8 17h8"/>',
    box:'<path d="m3 8 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V8M12 12v10m-4-11 8-4"/>',
    book:'<path d="M12 6c-2-2-5-3-9-3v15c4 0 7 1 9 3 2-2 5-3 9-3V3c-4 0-7 1-9 3Zm0 0v15"/>',
    arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',
    back:'<path d="M19 12H5m5-5-5 5 5 5"/>',
    next:'<path d="m9 5 7 7-7 7"/>',
    video:'<path d="M3 6h18v12H3zM3 9h18M7 6l2 3m5-3 2 3"/><path d="m10 11 5 2.5-5 2.5z" fill="currentColor" stroke="none"/>',
    camera:'<path d="M3 6h13v12H3zM16 10l5-3v10l-5-3"/><circle cx="9.5" cy="12" r="2.3"/>',
    lamp:'<path d="M8 14a6 6 0 1 1 8 0c-1 .8-1 1.5-1 3H9c0-1.5 0-2.2-1-3Zm2 6h4m-2-8v4M12 1v1M3 4l2 2m14 0 2-2"/>',
    mark:'<path d="M12 1.9c2.3 2.9 4.8 4.4 8.6 4.3-1 3.7-.5 6.5 1 9.4-3.5.9-5.8 2.6-7.4 6.3-2.9-2.2-5.7-2.9-9.3-2.2.3-3.7-.6-6.5-3.1-9.2C5.5 9 8.4 6.2 12 1.9Z"/><circle cx="12" cy="12" r="4.3"/><circle cx="12" cy="12" r="1.25" fill="currentColor"/>',
    play:'<path d="m8 4 13 8-13 8z" fill="currentColor" stroke="none"/>',
    pause:'<path d="M9 5v14m6-14v14" stroke-width="2.6"/>',
    close:'<path d="m6 6 12 12M18 6 6 18"/>',
    heart:'<path d="M12 20.3 4.2 12.8a4.85 4.85 0 0 1 6.9-6.8l.9 1 .9-1a4.85 4.85 0 0 1 6.9 6.8Z"/>',
    history:'<path d="M3 11a9 9 0 1 1 2.4 7M3 5v6h6m3-3v5l3 2"/>',
    edit:'<path d="m4 16-1 5 5-1L20 8l-4-4zm10-10 4 4"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M10 2h4l.7 3 2 .9L19.5 5l2 3.5-2 2.2v2.6l2 2.2-2 3.5-2.8-.9-2 .9-.7 3h-4l-.7-3-2-.9-2.8.9-2-3.5 2-2.2v-2.6l-2-2.2L4.5 5l2.8.9 2-.9z"/>'
  };
  const icon = (name) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';
  const goButton = (route, inner, classes = '') => '<button type="button" class="'+classes+'" data-go="'+route+'">'+inner+'</button>';
  const brand = '<svg class="brand-mark" viewBox="0 0 45 42" aria-hidden="true"><defs><linearGradient id="brand-drape" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#782d20"/><stop offset="1" stop-color="#ab5c38" stop-opacity="0"/></linearGradient><linearGradient id="brand-light" x2="0" y2="1" gradientUnits="objectBoundingBox"><stop stop-color="#e9b46b"/><stop offset="1" stop-color="#f7e5b8" stop-opacity="0"/></linearGradient></defs><path d="M13 4h19l11 35H2z" fill="url(#brand-drape)"/><path d="M17.7 12h9.6L34.6 39H10.4z" fill="url(#brand-light)"/><path d="m21.8 4-1.6 4.8h4.6L23.2 4z" fill="#fff2d0"/></svg>';
  const sealShape = '<path d="M32 2.7c8.4 0 14.7 4.8 17.6 11.8C56.6 17.4 61.3 23.6 61.3 32c0 8.4-4.7 14.6-11.7 17.5C46.7 56.6 40.4 61.3 32 61.3s-14.7-4.7-17.6-11.8C7.4 46.6 2.7 40.4 2.7 32s4.7-14.6 11.7-17.5C17.3 7.5 23.6 2.7 32 2.7Z"/>';
  const seal = (name, prominent = false) => '<span class="seal"><svg viewBox="0 0 64 64" class="seal-shape" aria-hidden="true">'+
    (prominent?'<defs><linearGradient id="stage-seal" x2="0" y2="1"><stop stop-color="#a04834"/><stop offset=".65" stop-color="#822e1e"/><stop offset="1" stop-color="#ae5832"/></linearGradient></defs>':'')+
    sealShape+'</svg>'+icon(name)+'</span>';
  const navSurface = '<svg class="nav-surface" viewBox="0 0 400 86" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="nav-paper" x2="0" y2="1"><stop stop-color="#fff7eb"/><stop offset="1" stop-color="#f4e9da"/></linearGradient></defs><path d="M0 39C0 23 12 13 30 13H158C179 13 183 1 200 1S221 13 242 13H370C388 13 400 23 400 39V86H0Z"/></svg>';
  const asset = (name) => 'assets/'+name;
  const read = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch { return false; }
  };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const stepNames = {carve:'雕刻',color:'上色',assemble:'装配',perform:'成影'};
  const scrollPositions = new Map();
  let route, frame, stageFrame, frameTimer, noticeTimer, pageMotion, category = 'all';
  const drafts = {...read('jh-mobile-drafts', {})};
  let makerChoice = null;
  let lastGlyph = read('jh-mobile-recent', null);
  let basket = read('jh-mobile-basket', {});
  const itemFor = (id) => data.products.find(item => item.id === id);
  const artwork = (id) => data.posters.find(item => item[0] === id);
  const filmFor = (id) => data.films.find(item => item[0] === id);
  const homePosters = data.glyphs.map(({id,label}) => {
    const [image,title] = artwork('poster-'+id);
    return {id,label,image,title,film:'film-'+id};
  });
  let activePoster = homePosters[0].id, homeVideo, finishedPoster;
  let homeMediaObserver, productMediaObserver;
  const posterPosition = () => (homePosters.findIndex(poster=>poster.id===activePoster)+1)+' / '+homePosters.length;
  const posterLabel = (id,label) => id===activePoster?'播放'+label+'字动态海报':'查看'+label+'字海报';
  const photoGroups = [['all','全部'],['figure','人物造型'],['group','同台与组合']];
  let photoGroup = 'all', photoView;
  const photoThumb = id => asset('photo-'+id+'-thumb.webp');
  const visiblePhotos = () => data.photos.filter(p=>photoGroup==='all'||photoGroup===p.group);
  const variantFor = (item, id) => item.set ? 'set' : glyphs[id] ? id : 'pi';
  const productImage = (item, id) => asset('product-'+item.id+'-'+variantFor(item,id)+'.webp');
  const checkoutCount = () => Object.values(basket).reduce((sum, count) => sum + (Number(count)||0), 0);

  const personal = window.ShadowPersonal.mount({
    app,read,write,notify,asset,icon,goButton,detail:personalContent,drafts:savedDrafts,bagCount:checkoutCount,
    lastStage:()=>glyphs[lastGlyph],refresh:()=>render(route,true),back
  });
  const reduceInterface = () => reduced.matches||personal.lessMotion();

  const tabbar = $('#tabbar');
  tabbar.innerHTML = navSurface + '<span class="tab-marker" aria-hidden="true"></span>' + tabs.map(([id,label,symbol]) =>
    goButton(id,'<span class="tab-icon">'+(id==='play'?seal(symbol,true):icon(symbol))+'</span><span>'+label+'</span>',
      id==='play'?'nav-tab nav-stage':'nav-tab')
  ).join('');

  function notify(copy) {
    const notice = $('#notice');
    notice.textContent = copy;
    notice.classList.add('show');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => notice.classList.remove('show'), 2100);
  }

  function heading(title, copy, extra = '') {
    return '<section class="page-heading"><h1>'+title+'</h1><p>'+copy+'</p>'+extra+'</section>';
  }

  function row(route, symbol, title, note) {
    return goButton(route,'<span class="row-mark">'+icon(symbol)+'</span><span class="row-copy"><strong>'+title+'</strong><small>'+note+'</small></span>'+icon('next'),'action-row');
  }

  function stage() {
    const shortcuts = [
      ['explore','river','文化溯源'], ['make','chisel','亲手制作'],
      ['play/characters','type','动态汉字'], ['play','curtain','互动戏台']
    ];
    const slides = homePosters.map(({id,label,image,title}) =>
      '<div class="poster-slide" data-poster="'+id+'"'+(id===activePoster?' data-current':'')+'><button type="button" class="poster-sheet" data-reel-play="'+id+'" aria-label="'+posterLabel(id,label)+'"><img data-home-src="'+asset(image+'-preview.webp')+'" alt="'+title+'" width="1055" height="1491" decoding="async" fetchpriority="low"></button></div>'
    ).join('');
    return '<div class="home-opening"><section class="home-hero" aria-labelledby="home-title"><div class="home-intro">'+
      '<h1 id="home-title">让光影，<br>被重新看见</h1><span class="hero-rule" aria-hidden="true"></span>'+
      '<p>走进江汉平原的皮影世界，<br>在光影与匠心中，感受一门流传百年的民间艺术。</p>'+
      goButton('explore','走进皮影 '+icon('next'),'primary-button hero-enter')+'</div></section>'+
      '<section class="quick-grid" aria-label="皮影体验">'+shortcuts.map(([target,symbol,label])=>
        goButton(target,seal(symbol)+'<span>'+label+'</span>','shortcut')).join('')+'</section></div>'+
      '<section class="home-reel" aria-labelledby="reel-title"><div class="home-reel-heading rule-heading"><div class="reel-title-group"><h2 id="reel-title">双杆光影</h2><output class="reel-position" aria-label="海报页位" aria-live="polite">'+posterPosition()+'</output></div>'+
      goButton(threeFilm,icon('play')+'<span>《一幕三字》</span>','home-feature-link')+'</div>'+
      '<div class="poster-track" aria-label="双杆光影海报">'+slides+'</div>'+
      '<div class="reel-controls"><div class="reel-picker" aria-label="选择海报">'+
      homePosters.map(({id,label})=>'<button type="button" data-poster-tab="'+id+'" aria-label="'+label+'字海报" aria-pressed="'+(id===activePoster)+'">'+label+'</button>').join('')+
      '</div><div class="reel-actions"><button type="button" class="reel-play" data-poster-play>'+icon(finishedPoster===activePoster?'history':'play')+'<span>'+(finishedPoster===activePoster?'重播动态':'播放动态')+'</span></button>'+
      personal.favoriteButton('stage/poster/poster-'+activePoster,true)+'</div></div></section>'+
      '<section class="home-explore section"><div class="section-heading rule-heading"><h2>探索江汉</h2>'+
      goButton('explore','文化溯源 '+icon('next'),'text-button')+'</div>'+photoCover(true)+'</section>';
  }

  function updatePosterAction() {
    const button = view.querySelector('[data-poster-play]');
    if (!button) return;
    const playing = homeVideo && !homeVideo.paused;
    const [symbol,label] = playing ? ['pause','暂停播放'] : homeVideo ? ['play','继续播放'] :
      finishedPoster===activePoster ? ['history','重播动态'] : ['play','播放动态'];
    if (button.textContent!==label) button.innerHTML = icon(symbol)+'<span>'+label+'</span>';
  }

  function stopHomeVideo() {
    if (!homeVideo) return;
    const video = homeVideo;
    homeVideo = null;
    const slide = video.parentElement;
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.remove();
    slide?.querySelector('[data-reel-close]')?.remove();
    slide?.querySelector('.poster-sheet').removeAttribute('hidden');
    updatePosterAction();
  }

  function setActivePoster(id) {
    if (id===activePoster) return;
    stopHomeVideo();
    activePoster = id;
    view.querySelector('.reel-position').value = posterPosition();
    view.querySelectorAll('[data-poster]').forEach(slide=>{
      const poster=slide.dataset.poster;
      slide.toggleAttribute('data-current',poster===id);
      slide.querySelector('.poster-sheet').setAttribute('aria-label',posterLabel(poster,glyphs[poster].label));
    });
    const favorite=view.querySelector('.reel-actions [data-favorite]');
    if (favorite) personal.refreshFavorite(favorite,'stage/poster/poster-'+id);
    view.querySelectorAll('[data-poster-tab]').forEach(button=>
      button.setAttribute('aria-pressed',String(button.dataset.posterTab===id)));
    updatePosterAction();
  }

  function movePoster(track, id, smooth) {
    const slide = track.querySelector('[data-poster="'+id+'"]');
    if (!slide) return;
    const left = slide.offsetLeft+(slide.offsetWidth-track.clientWidth)/2;
    const moving = smooth&&!reduceInterface();
    track.dataset.snapTarget = moving&&Math.abs(track.scrollLeft-left)>2 ? id : '';
    setActivePoster(id);
    track.scrollTo({left,behavior:moving?'smooth':'instant'});
  }

  function connectHomeImages() {
    const images=[...content.querySelectorAll('[data-home-src]')];
    const start=image=>{
      image.src=image.dataset.homeSrc;
      delete image.dataset.homeSrc;
    };
    if (!('IntersectionObserver' in window)) {
      for (const image of images) {
        image.loading='lazy';
        start(image);
      }
      return;
    }
    homeMediaObserver=new IntersectionObserver((entries,observer)=>{
      for (const entry of entries) {
        if (entry.intersectionRatio<.22) continue;
        observer.unobserve(entry.target);
        start(entry.target);
      }
    },{root:view,rootMargin:'0px 0px 80px',threshold:.22});
    for (const image of images) homeMediaObserver.observe(image);
  }

  function connectPosterTrack() {
    const track = view.querySelector('.poster-track');
    const slides = [...track.children];
    let pending = false;
    movePoster(track,activePoster,false);
    const interrupt = () => { track.dataset.snapTarget = ''; };
    track.addEventListener('pointerdown',interrupt,{passive:true});
    track.addEventListener('wheel',interrupt,{passive:true});
    track.addEventListener('scroll',()=>{
      if (pending) return;
      pending = true;
      requestAnimationFrame(()=>{
        pending = false;
        if (!track.isConnected) return;
        const center = track.scrollLeft+track.clientWidth/2;
        const distance = slide=>Math.abs(slide.offsetLeft+slide.offsetWidth/2-center);
        const nearest = slides.reduce((a,b)=>distance(a)<=distance(b)?a:b);
        const id = nearest.dataset.poster;
        if (track.dataset.snapTarget&&track.dataset.snapTarget!==id) return;
        interrupt();
        setActivePoster(id);
      });
    },{passive:true});
  }

  function playHomeVideo(id) {
    const item = homePosters.find(p=>p.id===id);
    const track = view.querySelector('.poster-track');
    if (!item||!track) return;
    if (id!==activePoster) { movePoster(track,id,true); return; }
    stopHomeVideo();
    const slide = track.querySelector('[data-poster="'+id+'"]');
    const sheet = slide.querySelector('.poster-sheet');
    const video = document.createElement('video');
    homeVideo = video;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.poster = asset(item.image+'-preview.webp');
    video.setAttribute('aria-label',item.label+'字动态海报');
    video.addEventListener('play',()=>personal.track('stage/watch/'+item.film),{once:true});
    video.addEventListener('play',updatePosterAction);
    video.addEventListener('pause',updatePosterAction);
    video.addEventListener('ended',()=>{
      if (homeVideo!==video) return;
      finishedPoster=id;
      stopHomeVideo();
    });
    video.addEventListener('error',()=>{
      if (homeVideo!==video) return;
      stopHomeVideo();
      notify('视频暂时无法播放');
    });
    const hadFocus = document.activeElement===sheet;
    sheet.hidden = true;
    slide.append(video);
    slide.insertAdjacentHTML('beforeend','<button type="button" class="reel-close craft-back" data-reel-close aria-label="返回静态海报">'+icon('close')+'</button>');
    if (hadFocus) video.focus({preventScroll:true});
    video.src = asset(item.film+'.mp4');
    video.play().catch(()=>{});
    updatePosterAction();
  }

  function sourceLink(key) {
    const [name,url] = data.heritage.sources[key];
    return '<a class="heritage-source" href="'+url+'" target="_blank" rel="noopener noreferrer">'+name+' ↗</a>';
  }

  function exploreCard(route,image,title,copy) {
    return goButton(route,'<img src="'+asset(image)+'" alt="" loading="lazy">'+
      '<span class="explore-card-copy"><span><strong>'+title+'</strong><small>'+copy+'</small></span><span class="explore-arrow">'+icon('next')+'</span></span>','explore-card');
  }

  function photoCover(defer=false) {
    return goButton('explore/photos','<span class="photo-cover-copy"><strong>影偶实拍</strong><small>'+data.photos.length+' 幅 · 人物造型与同台</small></span>'+
      '<img '+(defer?'data-home-src':'src')+'="'+photoThumb('three-poses')+'" alt="" loading="lazy" decoding="async"><span class="explore-arrow">'+icon('next')+'</span>','photo-cover');
  }

  function explore() {
    return '<div class="explore-page">'+heading('探索江汉','从影偶的纹样、唱腔和关节，读懂一场皮影戏。')+
      '<section class="heritage-card"><img src="'+asset('backstage.webp')+'" alt="灯幕背后的皮影戏台">'+
      '<div><h2>江汉平原的灯幕</h2><p>江汉平原皮影戏主要流传在潜江、天门、沔阳（今仙桃）一带。2006 年，湖北潜江申报的江汉平原皮影戏进入第一批国家级非遗名录。</p>'+
      sourceLink('listing')+'</div></section>'+
      '<section class="section"><div class="section-heading rule-heading"><h2>唱腔与工艺</h2></div><div class="explore-grid">'+
      exploreCard('explore/stagecraft','stage-room.webp','从幕后到台前','听唱腔，看操偶')+
      exploreCard('explore/process','craft-hero.webp','影偶怎么做','潜江汤格皮影八道工序')+'</div></section>'+
      '<section class="section"><div class="section-heading rule-heading"><h2>影偶与影像</h2></div>'+
      photoCover()+filmLink()+row('stage/gallery','video','海报与影像','看原创海报和字影演示')+'</section></div>';
  }

  function stagecraft() {
    return '<article class="heritage-article">'+heading('从幕后到台前','顺着一根操纵杆，看看一场戏是怎么演起来的。')+
      '<img class="heritage-banner" src="'+asset('backstage.webp')+'" alt="灯幕与幕后光影">'+
      '<div class="heritage-notes">'+data.heritage.stagecraft.map(([title,copy,source])=>
        '<section><h2>'+title+'</h2><p>'+copy+'</p>'+sourceLink(source)+'</section>').join('')+'</div>'+
      '<div class="heritage-action">'+goButton('play','到戏台试一试 '+icon('next'),'primary-button')+'</div></article>';
  }

  function exploreProcess() {
    return '<article class="heritage-article">'+heading('影偶怎么做','潜江汤格皮影的八道传统工序')+
      '<img class="heritage-banner process-banner" src="'+asset('craft-hero.webp')+'" alt="皮影镂花和刻刀">'+
      '<div class="heritage-notes"><p class="process-lead">江汉平原皮影的雕镂有汤格、郭格等传承。这里以潜江传承人汤先成演示的汤格工艺为例。</p>'+
      '<ol class="process-list">'+data.heritage.process.map(([title,copy])=>'<li><div><strong>'+title+'</strong><p>'+copy+'</p></div></li>').join('')+'</ol>'+
      sourceLink('process')+'</div><div class="heritage-action">'+goButton('make','亲手制作一个字影 '+icon('next'),'primary-button')+'</div></article>';
  }

  function photoTiles() {
    return visiblePhotos().map(photo=>'<button type="button" class="photo-tile" data-photo="'+photo.id+'" aria-label="查看'+photo.title+'大图">'+
      '<span class="photo-tile-image"><img src="'+photoThumb(photo.id)+'" alt="" loading="lazy" decoding="async"></span>'+
      '<span class="photo-tile-title">'+photo.title+icon('next')+'</span></button>').join('');
  }

  function photoGallery() {
    return '<section class="photo-gallery">'+heading('影偶实拍','点开大图，细看衣纹、关节和操纵杆。')+
      '<div class="photo-filter"><div class="category-tabs" aria-label="影偶实拍分类">'+
      photoGroups.map(([id,label])=>'<button type="button" data-photo-group="'+id+'" aria-pressed="'+(photoGroup===id)+'">'+label+'</button>').join('')+
      '</div><output class="photo-count">'+visiblePhotos().length+' 幅</output></div>'+
      '<div class="photo-grid">'+photoTiles()+'</div><p class="photo-credit">图片由项目提供。</p></section>';
  }

  function selectPhotoGroup(group) {
    photoGroup = group;
    view.querySelectorAll('[data-photo-group]').forEach(button=>
      button.setAttribute('aria-pressed',String(button.dataset.photoGroup===group)));
    view.querySelector('.photo-count').value = visiblePhotos().length+' 幅';
    view.querySelector('.photo-grid').innerHTML = photoTiles();
  }

  function showPhoto(delta) {
    const {items} = photoView;
    photoView.index = (photoView.index+delta+items.length)%items.length;
    const photo = items[photoView.index];
    const picture = $('#photo-image');
    zoomMedia(false);
    $('#media-title').textContent = photo.title;
    picture.alt = photo.title;
    picture.dataset.photoId = photo.id;
    picture.src = photoThumb(photo.id);
    const caption = $('#photo-caption');
    caption.textContent = photo.caption;
    if (!(reduceInterface()&&photo.image.endsWith('.gif'))) {
      const fullSize = new Image();
      fullSize.src = asset(photo.image);
      fullSize.decode().then(()=>{
        if (picture.isConnected&&picture.dataset.photoId===photo.id) picture.src = fullSize.src;
      }).catch(()=>{
        if (picture.isConnected&&picture.dataset.photoId===photo.id) caption.textContent = photo.caption+' · 当前为预览图';
      });
    }
    $('#photo-position').value = (photoView.index+1)+' / '+items.length;
  }

  function openPhoto(id) {
    const items = visiblePhotos(), index = items.findIndex(photo=>photo.id===id);
    if (index<0) return;
    photoView = {items,index};
    const dialog = $('#media-dialog');
    dialog.classList.add('photo-dialog');
    dialog.setAttribute('aria-label','影偶实拍大图');
    $('#media-content').innerHTML = '<figure class="photo-lightbox"><div class="media-viewport" aria-label="实拍图片"><img id="photo-image" alt="" draggable="false"></div>'+
      '<figcaption id="photo-caption"></figcaption></figure><div class="photo-pages">'+
      '<button type="button" class="craft-back" data-photo-step="-1" aria-label="上一张实拍">'+Craft.icon('back')+'</button>'+
      '<output id="photo-position" aria-live="polite"></output>'+
      '<button type="button" class="craft-back" data-photo-step="1" aria-label="下一张实拍">'+Craft.icon('next')+'</button>'+
      mediaZoomButton+'</div>';
    showPhoto(0);
    dialog.showModal();
  }

  function characterCards() {
    return '<div class="character-row">'+data.glyphs.map(g=>
      goButton('play/solo/'+g.id,'<img src="'+asset(g.id+'.webp')+'" alt=""><strong>'+g.label+'</strong>','character')
    ).join('')+'</div>';
  }

  function filmLink() {
    return goButton(threeFilm,'<span class="film-thumb"><img src="'+asset('film-three.webp')+'" alt="">'+icon('play')+'</span>'+
      '<span class="row-copy"><strong>三字同台</strong><small>《一幕三字》 · 20 秒</small></span>'+icon('next'),'action-row film-link');
  }

  function characters() {
    return heading('让汉字动起来','选一个字上台，试试牵杆和摆关节。')+
      '<section class="section">'+characterCards()+filmLink()+'</section>';
  }

  function savedDrafts() {
    return Object.entries(drafts).filter(([id,step])=>glyphs[id]&&Object.hasOwn(stepNames,step)).reverse().map(([id,stage])=>{
      const complete=stage==='perform',title='「'+glyphs[id].label+'」字皮影';
      return {stage,step:stepNames[stage],title,complete,route:(complete?'play/work/':'make/work/')+id,
        image:asset((complete?id:'blank-'+id)+'.webp')};
    });
  }

  function craftWorksCards(saved) {
    if (!saved.length) return '<div class="craft-empty">'+Craft.waves+'<img src="'+asset('xi.webp')+'" alt="">'+
      '<strong>还没有创作作品</strong><p>选一张皮，完成你的第一件皮影。</p></div>';
    return '<div class="craft-work-list">'+saved.map(item=>
      goButton(item.route,'<img src="'+item.image+'" alt="">'+
        '<span><strong>'+item.title+'</strong><small><b class="work-badge'+(item.complete?' finished':'')+'">'+(item.complete?'已成影':'制作中')+'</b>'+
        (item.complete?'上戏台':item.step)+'</small></span>'+Craft.icon('next'),'craft-work-link')
    ).join('')+'</div>';
  }

  function make() {
    const saved=savedDrafts(),ongoing=saved.find(item=>!item.complete);
    return '<div class="craft-landing"><p class="craft-deck">体验五步工艺，亲手制作一件皮影</p>'+
      '<section class="craft-progress-card"><h2>制作进度</h2>'+Craft.progress(ongoing?.stage||'')+
      (ongoing?'<p class="craft-progress-note">'+ongoing.title+' · '+ongoing.step+'</p>':'')+'</section>'+
      '<section class="craft-hero-card"><div><h1>五步制影<br>亲手体验</h1><p>从一张皮开始，<br>雕刻、上色、装配，<br>再让字影登上灯幕。</p></div>'+
      Craft.waves+goButton(ongoing?.route||'make/choose',(ongoing?'继续制作':'开始制作')+' '+Craft.icon('next'),'craft-primary craft-start')+'</section>'+
      (ongoing?'<div class="craft-another">'+goButton('make/choose','换个字制作 '+Craft.icon('next'),'text-button')+'</div>':'')+
      '<section class="craft-works-card"><div class="section-heading rule-heading"><h2>我的作品</h2>'+
      (saved.length?goButton('case/works','全部作品 '+Craft.icon('next'),'text-button'):'')+
      '</div>'+craftWorksCards(saved)+'</section></div>';
  }

  function chooseCraft() {
    const g=glyphs[makerChoice],previous=g&&Object.hasOwn(stepNames,drafts[g.id])?drafts[g.id]:null;
    const action=previous==='perform'?'查看作品':previous?'继续'+stepNames[previous]:'确认选皮';
    const confirm=g?goButton((previous==='perform'?'play/work/':'make/work/')+g.id,action+' '+Craft.icon('next'),'craft-primary'):
      '<button type="button" class="craft-primary" disabled>确认选皮 '+Craft.icon('next')+'</button>';
    const traits=[['layers','透光','灯亮时，刻口显影'],['wave','韧性','皮片可随关节转动'],['weave','纹理','保留天然的纹理']];
    return '<div class="craft-choose"><div class="craft-content">'+
      Craft.heading('choose','从「皮、影、戏」中挑一字，选定牛皮毛坯。')+
      '<div class="craft-step-strip">'+Craft.progress('choose')+'</div>'+
      '<div class="leather-preview'+(g?'':' is-empty')+'" aria-live="polite">'+(g?
        '<img src="'+asset('blank-'+g.id+'.webp')+'" alt="'+g.label+'字牛皮毛坯"><span>「'+g.label+'」字毛坯 · '+g.parts+' 件部件</span>':
        Craft.seal('choose')+'<span>请选择下方字形，查看专属牛皮毛坯</span>')+'</div>'+
      '<div class="leather-options" aria-label="选择牛皮字稿">'+data.glyphs.map(glyph=>
        '<button class="leather-option" type="button" data-craft-pick="'+glyph.id+'" aria-pressed="'+(g?.id===glyph.id)+'">'+
        '<span class="leather-thumb"><img src="'+asset('blank-'+glyph.id+'.webp')+'" alt="">'+
        (g?.id===glyph.id?'<span class="leather-check">'+Craft.icon('check')+'</span>':'')+
        '</span><strong>'+glyph.label+'</strong></button>').join('')+'</div>'+
      '<section class="craft-material"><h2>牛皮毛坯</h2><div>'+
      traits.map(([symbol,title,copy])=>'<div>'+Craft.seal(symbol)+'<strong>'+title+'</strong><small>'+copy+'</small></div>').join('')+
      '</div></section></div>'+
      '<footer class="craft-footer">'+Craft.waves+'<button type="button" class="craft-outline" data-back>上一步</button>'+
      confirm+'</footer></div>';
  }

  function worksCraft() {
    const saved=savedDrafts();
    return '<div class="personal-page personal-detail"><section class="profile-works">'+craftWorksCards(saved)+
      '<div class="craft-works-actions">'+goButton('make/choose','开始制作 '+Craft.icon('next'),'primary-button')+
      goButton('make/import','导入制作稿','outline-button')+'</div></section></div>';
  }

  function personalContent(path) {
    const [tab,sub,id,variant,extra]=path.split('/');
    if(extra!==undefined) return null;
    if(tab==='stage'&&variant===undefined){
      if(sub==='poster'&&artwork(id)) return {key:path,title:artwork(id)[1],note:'原创海报',image:asset(id+'.webp')};
      if(sub==='watch'&&filmFor(id)){
        const [,title,,cover,duration]=filmFor(id);
        return {key:path,title,note:'影片 · '+duration+' 秒',image:asset((cover||id)+'.webp')};
      }
    }
    if(tab==='shop'&&sub==='item'&&itemFor(id)&&variant!==undefined){
      const item=itemFor(id);
      if (variantFor(item,variant)!==variant) return null;
      const file='product-'+item.id+'-'+variant+'.webp';
      return {key:'shop/item/'+id,title:item.name,note:item.set?'文创 · 三字一套':'文创 · '+glyphs[variant].label+'字款',
        image:asset(data.productImages?.[file]?.card||file)};
    }
    if(tab==='play'&&sub==='solo'&&glyphs[id]&&variant===undefined)
      return {key:path,title:'「'+glyphs[id].label+'」字戏台',note:'互动戏台',image:asset(id+'.webp')};
    const entries={
      'explore/stagecraft':['从幕后到台前','stage-room.webp'],
      'explore/process':['影偶怎么做','guide-carved.webp'],
      'explore/photos':['影偶实拍','photo-'+data.photos[0].id+'-thumb.webp']
    };
    if(Object.hasOwn(entries,path)){
      const [title,image]=entries[path];
      return {key:path,title,note:'探索江汉',image:asset(image)};
    }
    return null;
  }

  function gallery() {
    return heading('灯下影像','双杆的长影、纸上的字形和幕上的动作。')+
      '<section class="section"><div class="section-heading"><h2>动态演示</h2><span>'+data.films.length+' 部</span></div><div class="poster-grid films">'+
      data.films.map(([id,title,,cover,duration])=>goButton('stage/watch/'+id,'<img src="'+asset((cover||id)+'.webp')+'" loading="lazy" alt=""><span class="play-disc">'+icon('play')+'</span><span class="poster-name">'+title+'<small>'+duration+' 秒</small></span>','poster-card')).join('')+
      '</div></section><section class="section"><div class="section-heading"><h2>原创海报</h2><span>'+data.posters.length+' 张</span></div><div class="poster-grid">'+
      data.posters.map(([id,title])=>goButton('stage/poster/'+id,'<img src="'+asset(id+'.webp')+'" loading="lazy" alt=""><span class="poster-name">'+title+'</span>','poster-card')).join('')+'</div></section>';
  }

  function watch(id) {
    const [,title,,cover] = filmFor(id);
    const actor=homePosters.find(item=>item.film===id);
    return '<section class="film-view"><video src="'+asset(id+'.mp4')+'" poster="'+asset((cover||id)+'.webp')+
      '" controls playsinline preload="metadata" aria-label="'+title+'"></video><div class="content-actions">'+
      personal.favoriteButton('stage/watch/'+id)+goButton(actor?'play/solo/'+actor.id:'play','到戏台试一试 '+icon('next'),'outline-button')+
      '</div></section>';
  }

  function poster(id) {
    const index = data.posters.findIndex(item=>item[0]===id);
    const previous = data.posters[(index-1+data.posters.length)%data.posters.length][0];
    const next = data.posters[(index+1)%data.posters.length][0];
    const moving=homePosters.find(item=>item.image===id);
    return '<section class="poster-view"><img src="'+asset(id+'.webp')+'" alt="'+artwork(id)[1]+'"><div class="content-actions">'+
      personal.favoriteButton('stage/poster/'+id)+
      (moving?goButton('stage/watch/'+moving.film,icon('play')+' 播放动态','outline-button'):'')+
      '</div><div class="poster-pages">'+
      '<button type="button" data-replace="stage/poster/'+previous+'" class="outline-button" aria-label="上一张">'+icon('back')+'</button>'+
      '<span>'+(index+1)+' / '+data.posters.length+'</span>'+
      '<button type="button" data-replace="stage/poster/'+next+'" class="outline-button" aria-label="下一张">'+icon('arrow')+'</button></div></section>';
  }

  function categoryNames() {
    return '<div class="category-tabs" aria-label="文创分类">'+data.categories.map(([id,label])=>
      '<button type="button" data-category="'+id+'" aria-pressed="'+(id===category)+'">'+label+'</button>').join('')+'</div>';
  }

  function productPicture(file,label='',size='card') {
    const media=data.productImages?.[file], original=asset(file);
    if (!media) return '<img src="'+original+'" alt="'+label+'" decoding="async" loading="lazy">';
    return '<img src="'+media.preview+'" data-product-src="'+asset(media[size])+
      '" data-product-original="'+original+'" alt="'+label+'" decoding="async">';
  }

  async function loadProductPicture(image) {
    const target=image.dataset.productSrc;
    if (!target||image.getAttribute('src')===target) return true;
    const decoded=new Image();
    decoded.decoding='async';
    decoded.src=target;
    try {
      await decoded.decode();
      if (!image.isConnected||image.dataset.productSrc!==target) return false;
      image.src=target;
      return true;
    } catch {
      return false;
    }
  }

  function connectProductImages() {
    productMediaObserver?.disconnect();
    const images=[...content.querySelectorAll('[data-product-src]')];
    if (!('IntersectionObserver' in window)) {
      for (const image of images) loadProductPicture(image);
      return;
    }
    productMediaObserver=new IntersectionObserver((entries,observer)=>{
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        loadProductPicture(entry.target);
      }
    },{root:view,rootMargin:'0px 0px 70px',threshold:.01});
    for (const image of images) productMediaObserver.observe(image);
  }

  async function loadProductOriginal() {
    const image=$('#media-content img');
    if (!image?.dataset.productOriginal) return;
    const status=$('#product-media-status'), retry=$('#product-media-retry');
    status.textContent='正在加载清晰大图';
    retry.hidden=true;
    image.dataset.productSrc=image.dataset.productOriginal;
    const loaded=await loadProductPicture(image);
    if (!image.isConnected) return;
    status.textContent=loaded?'':'清晰大图暂未加载';
    retry.hidden=loaded;
  }

  function shop() {
    const shown = data.products.filter(item=>category==='all'||item.cat===category);
    return heading('江汉文创','把一幕戏，带回日常。')+
      (['all','gift'].includes(category)?goButton('shop/item/magnet/pi',
        productPicture('product-magnet-pi.webp','','screen')+'<div><span>可动磁贴礼盒</span><h2>字动成戏</h2><span class="store-more">看三款礼盒 '+icon('arrow')+'</span></div>','shop-feature'):'')+
      categoryNames()+'<div class="product-grid">'+shown.map(item=>
        goButton('shop/item/'+item.id+'/'+variantFor(item,'pi'),
          '<span class="product-photo '+(item.cover?'is-cover':item.cat==='gift'?'is-photo':'')+'">'+
          productPicture(item.cover||'product-'+item.id+'-'+variantFor(item,'pi')+'.webp')+'</span>'+
          '<span class="product-card-text"><strong>'+item.name+'</strong><small>'+(item.set?'三字一套':'皮 / 影 / 戏')+'</small>'+icon('next')+'</span>','product-card')
      ).join('')+'</div>';
  }

  function product(id, variant) {
    const item = itemFor(id);
    const picked = variantFor(item, variant);
    const show3D = item.models?.includes(picked);
    const firstPhoto = item.detailPhotos?.[0];
    const label = firstPhoto?firstPhoto[1]:item.set?'皮影戏三字一套':'「'+glyphs[picked].label+'」字款';
    const photo = firstPhoto?firstPhoto[2]:'product-'+item.id+'-'+picked+'.webp';
    const variants = firstPhoto
      ? '<div class="variant-tabs product-photo-tabs" aria-label="选择书签图样">'+item.detailPhotos.map(([id,label],index)=>
          '<button type="button" data-product-shot="'+id+'" aria-pressed="'+(index===0)+'">'+label+'</button>').join('')+'</div>'
      : item.set?'':'<div class="variant-tabs" aria-label="选择款式">'+data.glyphs.map(g=>
          '<button type="button" data-replace="shop/item/'+id+'/'+g.id+'" aria-pressed="'+(g.id===picked)+'">'+g.label+'字</button>').join('')+'</div>';
    return '<section class="product-page" data-product="'+id+'">'+
      '<button class="product-hero '+(firstPhoto?'is-bookmark':item.cat==='gift'?'is-photo':'')+'" type="button" data-enlarge aria-label="放大'+item.name+'图片">'+productPicture(photo,item.name+' '+label,'screen')+'<span>查看大图 ↗</span></button>'+
      '<div class="product-detail"><div class="product-title-row"><div><span class="muted" data-product-label>'+label+'</span><h1>'+item.name+'</h1></div><span class="preview-tag">设计展示</span></div>'+
      '<p>'+item.note+'</p>'+variants+
      (show3D?row('shop/object/'+picked,'box','360° 立体赏物','可旋转、缩放，牵动圆孔关节'):'')+
      '</div><div class="product-bar">'+personal.favoriteButton('shop/item/'+id+'/'+picked)+
      '<button type="button" class="primary-button" data-add="'+id+'/'+picked+'">'+icon('bag')+' 加入购物袋</button></div></section>';
  }

  function selectProductShot(button) {
    const page=button.closest('.product-page');
    const item=itemFor(page.dataset.product);
    const shot=item?.detailPhotos?.find(([id])=>id===button.dataset.productShot);
    if (!shot) return;
    const [id,label,file]=shot, image=page.querySelector('.product-hero img');
    image.outerHTML=productPicture(file,item.name+' '+label,'screen');
    connectProductImages();
    page.querySelector('[data-product-label]').textContent=label;
    page.querySelectorAll('[data-product-shot]').forEach(option=>
      option.setAttribute('aria-pressed',String(option.dataset.productShot===id)));
  }

  function basketView() {
    const items = Object.entries(basket).flatMap(([key,quantity])=>{
      const [id,variant] = key.split('/'), item = itemFor(id);
      return item&&Number.isInteger(quantity)&&quantity>0&&variantFor(item,variant)===variant?[{item,variant,key,quantity}]:[];
    });
    return heading('购物袋',items.length?'已收好 '+checkoutCount()+' 件文创。':'你还没有加入文创。')+
      (items.length?'<div class="bag-items">'+items.map(({item,variant,key,quantity})=>
        '<div class="bag-item">'+goButton('shop/item/'+key,productPicture('product-'+item.id+'-'+variant+'.webp'),'bag-image')+
        '<div class="bag-copy"><h2>'+item.name+'</h2><p>'+(item.set?'三字一套':glyphs[variant].label+'字款')+'</p>'+
        '<div class="bag-quantity"><button type="button" data-quantity="'+key+'" data-delta="-1" aria-label="减少'+item.name+'数量">−</button><output>'+quantity+'</output><button type="button" data-quantity="'+key+'" data-delta="1" aria-label="增加'+item.name+'数量">＋</button></div></div>'+
        '<button type="button" data-remove="'+key+'" class="bag-remove" aria-label="移除'+item.name+'">移除</button></div>'
      ).join('')+'</div><p class="order-note">文创为设计展示，暂未开放下单。</p>':
      '<div class="empty-bag">'+icon('bag')+goButton('shop','去看看文创 '+icon('arrow'),'primary-button')+'</div>');
  }

  const pages = {
    stage:{title:'首页',view:stage},explore:{title:'文化溯源',view:explore,parent:'stage'},play:{title:'互动戏台',parent:'stage'},
    shop:{title:'文创',view:shop},case:{title:'我的',view:personal.overview},
    make:{title:'亲手制影',view:make,parent:'stage'},
    'make/choose':{title:'亲手制影',view:chooseCraft,parent:'make'},
    'make/import':{title:'导入制作稿',parent:'case/works'},
    'stage/gallery':{title:'灯下影像',view:gallery,parent:'stage'},
    'explore/stagecraft':{title:'从幕后到台前',view:stagecraft,parent:'explore'},
    'explore/process':{title:'影偶怎么做',view:exploreProcess,parent:'explore'},
    'explore/photos':{title:'影偶实拍',view:photoGallery,parent:'explore'},
    'play/touch':{title:'触屏操偶',parent:'play'},
    'play/camera':{title:'镜头操纵',parent:'play'},
    'play/characters':{title:'动态汉字',view:characters,parent:'play'},
    'shop/bag':{title:'购物袋',view:basketView,parent:'shop'},
    'case/works':{title:'我的作品',view:worksCraft,parent:'case'},
    'case/edit':{title:'编辑资料',view:personal.edit,parent:'case'},
    'case/favorites':{title:'我的收藏',view:()=>personal.list('favorites'),parent:'case'},
    'case/recent':{title:'最近浏览',view:()=>personal.list('recent'),parent:'case'},
    'case/settings':{title:'体验设置',view:personal.settings,parent:'case'},
    'case/help':{title:'使用帮助',view:personal.help,parent:'case'}
  };

  function validRoute(input) {
    if (typeof input!=='string') return 'stage';
    if (input==='play/show') return threeFilm;
    if (input==='stage/guide') return 'make';
    if (input==='make/works') return 'case/works';
    if (Object.hasOwn(pages,input)||personalContent(input)) return input;
    const parts=input.split('/'),[tab,sub,id,variant]=parts;
    if(tab==='play'&&glyphs[id]){
      if(sub==='camera'&&parts.length===3) return input;
      if(sub==='camera'&&parts.length===4&&variant==='work') return drafts[id]==='perform'?input:'play/camera/'+id;
      if(sub==='work'&&parts.length===3) return drafts[id]==='perform'?input:'case/works';
    }
    if(tab==='make'&&sub==='work'&&glyphs[id]&&(parts.length===3||parts.length===4&&variant==='start')) return 'make/work/'+id;
    if(tab==='shop'&&sub==='object'&&parts.length===3&&itemFor('magnet').models?.includes(id)) return input;
    return 'stage';
  }

  function parentFor(next) {
    const [tab,sub,id]=next.split('/');
    if (pages[next]?.parent) return pages[next].parent;
    if (!sub) return 'stage';
    if (tab==='stage') return 'stage/gallery';
    if (tab==='play'&&sub==='solo') return 'play/characters';
    if (tab==='play'&&sub==='work') return 'case/works';
    if (tab==='shop'&&sub==='object') return 'shop/item/magnet/'+id;
    return tab;
  }

  function frameFor(next) {
    const [tab,sub,id,variant] = next.split('/');
    if (tab==='play') {
      if (!sub) return {url:'maker.html?mode=stage&glyph=xi',title:'互动戏台',stageRoom:true};
      if (sub==='solo') return {url:'maker.html?mode=stage&glyph='+id,title:'「'+glyphs[id].label+'」字戏台',stageRoom:true};
      if (sub==='work') return {url:'maker.html?mode=stage&work=1&glyph='+id,title:'「'+glyphs[id].label+'」字作品戏台',stageRoom:true};
      if (sub==='touch') return {url:'stage.html?mode=touch&experience=1#puppeteer',title:'触屏操偶'};
      if (sub==='camera') return {url:'maker.html?mode=stage&camera=1&glyph='+(id||'xi')+(variant==='work'?'&work=1':''),title:'镜头操纵',camera:true,stageRoom:true};
    }
    if (tab==='make'&&sub==='work') return {url:'maker.html?slot='+glyphs[id].slot,title:'制作「'+glyphs[id].label+'」'};
    if (tab==='make'&&sub==='import') return {url:'maker.html?mode=import',title:'导入制作稿'};
    if (tab==='shop'&&sub==='object') return {url:'object.html?model='+id,title:'「'+glyphs[id].label+'」字 · 立体赏物'};
    return null;
  }

  function titleFor(next, embedded) {
    if (embedded) return embedded.title;
    const [,sub,id] = next.split('/');
    if (sub==='watch'&&id==='film-three') return '一幕三字';
    return pages[next]?.title||personalContent(next)?.title||'江汉皮影戏';
  }

  function updateHeader(deep, title, tab) {
    const bagAction = '<button class="top-action" type="button" data-go="shop/bag" aria-label="购物袋 '+checkoutCount()+' 件">'+icon('bag')+
      (checkoutCount()?'<span class="bag-count">'+Math.min(checkoutCount(),99)+'</span>':'')+'</button>';
    const top = $('#topbar');
    if (tab==='make'&&route!=='make/import'&&!app.classList.contains('craft-work')) {
      top.innerHTML = '<button type="button" class="craft-back" data-back aria-label="返回">'+Craft.icon('back')+'</button>'+
        '<span class="craft-nav-title"><span aria-hidden="true"></span>'+title+'<span aria-hidden="true"></span></span>'+
        (route==='make'?goButton('case/works',Craft.icon('works')+'<span>我的作品</span>','craft-works-button'):'<span></span>');
      return;
    }
    if (deep) {
      const right=tab==='shop'&&route!=='shop/bag'?bagAction:
        tab==='explore'&&personalContent(route)?personal.favoriteButton(route,true):'<span class="top-plug"></span>';
      top.innerHTML = '<button type="button" class="craft-back" data-back aria-label="返回">'+Craft.icon('back')+'</button><span class="sub-title">'+title+'</span>'+right;
    } else if (tab==='stage') {
      top.innerHTML = '<button type="button" class="brand-button" data-go="stage">'+brand+
        '<span><strong>江汉皮影</strong><small>江汉平原皮影戏 · 非遗数字体验</small></span></button>'+
        '<div class="home-tools"><div class="tool-capsule">'+
        '<button type="button" id="home-menu-toggle" data-menu aria-label="更多入口" aria-expanded="false" aria-controls="home-menu"><span class="more-dots" aria-hidden="true"></span></button>'+
        '<button type="button" data-go="stage/gallery" aria-label="灯下影像">'+icon('lens')+'</button></div>'+
        '<div id="home-menu" class="home-menu" hidden>'+
        goButton('make',icon('chisel')+' 亲手制作')+
        goButton('stage/gallery',icon('video')+' 海报与影像')+
        goButton('case',icon('profile')+' 个人中心')+'</div></div>';
    } else {
      const label = tabs.find(([id])=>id===tab)[1];
      top.innerHTML = '<span class="top-plug"></span><span class="sub-title">'+label+'</span>'+
        (tab==='shop'?bagAction:'<span class="top-plug"></span>');
    }
  }

  function sendFrameSettings(target) {
    target.contentWindow?.postMessage({app:'jianghan-mobile',type:'interface-options',lessMotion:personal.lessMotion()},
      location.protocol==='file'?'*':location.origin);
  }

  function showStage(visible) {
    if (!stageFrame||stageFrame.hidden===!visible) return;
    stageFrame.hidden = !visible;
    stageFrame.contentWindow.postMessage({app:'jianghan-mobile',type:'stage-visibility',visible},
      location.protocol==='file:'?'*':location.origin);
    if (visible) sendFrameSettings(stageFrame);
  }

  function showFrameRetry(message) {
    const loading = $('#frame-loading');
    if (loading) loading.innerHTML = '<p>'+message+'</p><button type="button" class="outline-button" id="reload-frame">重新打开</button>';
  }

  function mountFrame(config, keepStage) {
    if (keepStage&&stageFrame) {
      frame = stageFrame;
      showStage(true);
    } else {
      frame = document.createElement('iframe');
      frame.title = config.title;
      if (config.camera) frame.allow = "camera 'self'; autoplay 'self'; fullscreen 'self'";
      frame.className = 'experience';
      const frameUrl=new URL('experience/'+config.url,location.href);
      frameUrl.searchParams.set("v","350f2ba1e6");
      frame.src=frameUrl.href;
      if (keepStage) {
        stageFrame = frame;
        view.prepend(frame);
      } else content.prepend(frame);
    }
    if (frame.classList.contains('ready')) return;
    content.insertAdjacentHTML('beforeend','<div id="frame-loading" class="frame-loading" role="status"><span>'+icon('mark')+'</span><p>正在展开灯幕</p></div>');
    frameTimer = setTimeout(()=>showFrameRetry('网络较慢，仍在加载'),14000);
  }

  function animatePage(previous,next) {
    pageMotion?.cancel();
    if (reduceInterface()||!previous||previous===next) return;
    const from = tabs.findIndex(([id])=>id===previous);
    const to = tabs.findIndex(([id])=>id===next);
    const shift = from>=0&&to>=0 ? (to>from?'5px 0':'-5px 0') : '0 3px';
    pageMotion = view.animate([{opacity:.92,translate:shift},{opacity:1,translate:'0 0'}],
      {duration:185,easing:'cubic-bezier(.2,.75,.22,1)'});
  }

  function render(next, restore = false) {
    const previous = route;
    if (route) scrollPositions.set(route, view.scrollTop);
    route = next;
    personal.track(next);
    frame = null;
    clearTimeout(frameTimer);
    homeMediaObserver?.disconnect();
    homeMediaObserver=null;
    productMediaObserver?.disconnect();
    productMediaObserver=null;
    stopHomeVideo();
    if (next!=='play') showStage(false);
    content.replaceChildren();
    const [tab,sub,id,variant] = next.split('/');
    const tabIndex = tabs.findIndex(([id])=>id===next);
    const deep = tabIndex<0, embedded = frameFor(next);
    app.classList.toggle('is-home',next==='stage');
    app.classList.toggle('is-explore',tab==='explore');
    app.classList.toggle('is-shop',tab==='shop');
    app.classList.toggle('is-account',tab==='case');
    app.classList.remove('home-scrolled');
    const craftPage=(tab==='make'&&sub!=='import')||Boolean(embedded?.stageRoom);
    app.classList.toggle('craft-flow',craftPage);
    app.classList.toggle('craft-work',craftPage&&Boolean(embedded));
    app.classList.toggle('in-detail', deep);
    app.classList.toggle('in-experience', Boolean(embedded));
    tabbar.hidden = deep;
    if (!deep) {
      tabbar.classList.toggle('stage-selected',tab==='play');
      tabbar.style.setProperty('--tab-index',tabIndex);
    }
    tabbar.querySelectorAll('[data-go]').forEach(b=>{
      if (b.dataset.go===tab) b.setAttribute('aria-current','page');
      else b.removeAttribute('aria-current');
    });
    const title = titleFor(next,embedded);
    document.title = deep?title+' · 江汉皮影戏':'江汉皮影戏';
    updateHeader(deep,title,tab);

    if (embedded) {
      if (sub==='solo') {
        lastGlyph = id;
        write('jh-mobile-recent', id);
      }
      mountFrame(embedded,next==='play');
      animatePage(previous,next);
      return;
    }

    const show=pages[next]?.view;
    if (show) content.innerHTML=show();
    else if (tab==='shop') content.innerHTML=product(id,variant);
    else if (sub==='watch') content.innerHTML=watch(id);
    else if (sub==='poster') content.innerHTML=poster(id);
    if (next==='stage') {
      connectPosterTrack();
      connectHomeImages();
    }
    view.scrollTop = restore?(scrollPositions.get(next)||0):0;
    if (tab==='shop') connectProductImages();
    animatePage(previous,next);
  }

  function isCraftStep(next) {
    return next==='make/choose'||Boolean(next?.startsWith('make/work/'));
  }

  function previousPage() {
    const state=history.state;
    return state?.jianghan&&state.page===route&&state.previous!==route&&validRoute(state.previous)===state.previous
      ?state.previous:null;
  }

  function go(input, options = {}) {
    const next=validRoute(input);
    app.querySelector('dialog[open]')?.close();
    if (next===route&&!options.refresh) { view.scrollTo({top:0,behavior:reduceInterface()?'auto':'smooth'}); return; }
    if (next==='make/choose') makerChoice=glyphs[options.pick]?.id||null;
    const replace=options.replace||isCraftStep(route)&&isCraftStep(next);
    const previous=replace?previousPage():route;
    (replace?history.replaceState:history.pushState).call(history,{jianghan:true,page:next,previous},'','#'+next);
    render(next,options.restore);
    if (options.play&&next.startsWith('stage/watch/')) view.querySelector('video')?.play().catch(()=>{});
  }

  function back() {
    const dialog=app.querySelector('dialog[open]');
    if (dialog) { dialog.close(); return; }
    if (previousPage()) { history.back(); return; }
    go(parentFor(route),{replace:true,restore:true});
  }

  function updateBasket(key, change) {
    const [id,variant] = key.split('/'), item = itemFor(id);
    if (!item||variant!==variantFor(item,variant)) return;
    const count = Math.min(99,Math.max(0,change===null?0:(basket[key]||0)+change));
    if (count) basket[key] = count;
    else delete basket[key];
    write('jh-mobile-basket',basket);
    if (route==='shop/bag') render(route,true);
    else updateHeader(true,titleFor(route),'shop');
  }

  function toggleMenu() {
    const menu = $('#home-menu');
    if (!menu) return;
    const expanded = menu.hidden;
    menu.hidden = !expanded;
    $('#home-menu-toggle').setAttribute('aria-expanded',String(expanded));
  }

  app.addEventListener('pointerdown',event=>{
    const menu = $('#home-menu');
    if (menu && !menu.hidden && !event.target.closest('.home-tools')) toggleMenu();
  });
  app.addEventListener('keydown',event=>{
    const menu = $('#home-menu');
    if (event.key==='Escape' && menu && !menu.hidden) {
      toggleMenu();
      $('#home-menu-toggle').focus();
    }
  });
  view.addEventListener('scroll',()=>{
    if (route==='stage') app.classList.toggle('home-scrolled',view.scrollTop>20);
  },{passive:true});

  app.addEventListener('click', event=>{
    const button = event.target.closest('button');
    if (!button||button.disabled) return;
    const d = button.dataset;
    if (button.matches('[data-back]')) back();
    else if (personal.action(button,route)) return;
    else if (button.matches('[data-menu]')) toggleMenu();
    else if (d.go) go(d.go,{restore:d.go!=='make'&&button.matches('.nav-tab'),play:true});
    else if (d.replace) go(d.replace,{replace:true});
    else if (d.posterTab) movePoster(view.querySelector('.poster-track'),d.posterTab,true);
    else if (d.reelPlay) playHomeVideo(d.reelPlay);
    else if (button.hasAttribute('data-reel-close')) {
      stopHomeVideo();
      view.querySelector('[data-reel-play="'+activePoster+'"]')?.focus({preventScroll:true});
    }
    else if (button.hasAttribute('data-poster-play')) {
      if (homeVideo?.paused) homeVideo.play().catch(()=>{});
      else if (homeVideo) homeVideo.pause();
      else playHomeVideo(activePoster);
    } else if (d.craftPick) {
      makerChoice=d.craftPick;
      const scroll=view.scrollTop;
      content.innerHTML=chooseCraft();
      view.scrollTop=scroll;
      view.querySelector('[data-craft-pick="'+makerChoice+'"]').focus({preventScroll:true});
    } else if (d.category) {
      category = d.category;
      const y = view.scrollTop;
      content.innerHTML = shop();
      view.scrollTop = y;
      view.querySelector('[data-category="'+category+'"]')?.focus({preventScroll:true});
      connectProductImages();
    } else if (d.productShot) selectProductShot(button);
    else if (d.add) {
      updateBasket(d.add,1);
      notify('已加入购物袋');
    } else if (d.quantity) updateBasket(d.quantity,Number(d.delta));
    else if (d.remove) updateBasket(d.remove,null);
    else if (d.photoGroup) selectPhotoGroup(d.photoGroup);
    else if (d.photo) openPhoto(d.photo);
    else if (d.photoStep && photoView) showPhoto(Number(d.photoStep));
    else if (button.hasAttribute('data-media-zoom')) zoomMedia(button.getAttribute('aria-pressed')!=='true');
    else if (button.id==='product-media-retry') loadProductOriginal();
    else if (button.hasAttribute('data-enlarge')) {
      const image=button.querySelector('img').cloneNode();
      image.draggable=false;
      $('#media-title').textContent=image.alt;
      $('#media-content').innerHTML='<div class="media-viewport" aria-label="商品图片"></div>'+
        '<div class="product-image-tools"><span id="product-media-status" role="status"></span>'+
        '<button type="button" class="outline-button" id="product-media-retry" hidden>重新加载大图</button>'+mediaZoomButton+'</div>';
      $('#media-content .media-viewport').append(image);
      $('#media-dialog').showModal();
      loadProductOriginal();
    } else if (button.id==='close-media') $('#media-dialog').close();
    else if (button.id==='reload-frame') {
      if (route==='play') { stageFrame?.remove(); stageFrame = null; }
      render(route);
    }
  });

  const mediaDialog = $('#media-dialog');
  const mediaZoomButton='<button type="button" class="outline-button media-zoom" data-media-zoom aria-pressed="false">'+Craft.icon('zoom')+'<span>放大细节</span></button>';
  let mediaPointer;
  function zoomMedia(zoom) {
    const viewport = mediaDialog.querySelector('.media-viewport'), button = mediaDialog.querySelector('[data-media-zoom]');
    const img = viewport.querySelector('img');
    if (zoom&&!img.naturalWidth) return;
    if (zoom) {
      const {width,height} = img.getBoundingClientRect();
      img.style.width = (width*2)+'px';
      img.style.height = (height*2)+'px';
    } else img.removeAttribute('style');
    viewport.classList.toggle('zoomed',zoom);
    viewport.tabIndex = zoom?0:-1;
    viewport.scrollLeft = zoom?(viewport.scrollWidth-viewport.clientWidth)/2:0;
    viewport.scrollTop = zoom?(viewport.scrollHeight-viewport.clientHeight)/2:0;
    button.setAttribute('aria-pressed',String(zoom));
    button.querySelector('span').textContent = zoom?'恢复全图':'放大细节';
  }
  mediaDialog.addEventListener('close',()=>{
    photoView = null;
    mediaPointer = null;
    mediaDialog.classList.remove('photo-dialog');
    mediaDialog.setAttribute('aria-label','作品预览');
    $('#media-content').replaceChildren();
  });
  mediaDialog.addEventListener('keydown',event=>{
    if (!photoView||event.target.closest('.media-viewport.zoomed')||!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    showPhoto(event.key==='ArrowLeft'?-1:1);
  });
  mediaDialog.addEventListener('pointerdown',event=>{
    const viewport = event.target.closest('.media-viewport');
    if (!viewport||!event.isPrimary||event.button!==0) return;
    const zoomed=viewport.classList.contains('zoomed');
    const pan=zoomed&&event.pointerType==='mouse';
    if (!pan&&!(photoView&&!zoomed&&event.pointerType==='touch')) return;
    mediaPointer = {viewport,pan,x:event.clientX,y:event.clientY,id:event.pointerId,left:viewport.scrollLeft,top:viewport.scrollTop};
    if(pan) viewport.setPointerCapture(event.pointerId);
  });
  mediaDialog.addEventListener('pointermove',event=>{
    if (!mediaPointer?.pan||event.pointerId!==mediaPointer.id) return;
    const {viewport,left,top,x,y} = mediaPointer;
    viewport.scrollLeft = left+x-event.clientX;
    viewport.scrollTop = top+y-event.clientY;
  });
  mediaDialog.addEventListener('pointerup',event=>{
    if (!mediaPointer||event.pointerId!==mediaPointer.id) return;
    const {pan,x,y} = mediaPointer;
    mediaPointer = null;
    const dx = event.clientX-x, dy = event.clientY-y;
    if (!pan&&photoView&&Math.abs(dx)>46&&Math.abs(dx)>Math.abs(dy)*1.5) showPhoto(dx<0?1:-1);
  });
  mediaDialog.addEventListener('pointercancel',()=>{mediaPointer=null;});

  window.addEventListener('message', event=>{
    if (location.protocol!=='file:'&&event.origin!==location.origin) return;
    const message = event.data;
    if (message?.app!=='jianghan-mobile') return;
    const current = frame&&event.source===frame.contentWindow;
    if (message.type==='ready') {
      if (current) {
        clearTimeout(frameTimer);
        $('#frame-loading')?.remove();
        frame.classList.add('ready');
        sendFrameSettings(frame);
      } else if (stageFrame&&event.source===stageFrame.contentWindow) stageFrame.classList.add('ready');
      return;
    }
    if (!current) return;
    if (message.type==='load-error') {
      clearTimeout(frameTimer);
      showFrameRetry('页面暂未加载完成，请重试');
    } else if (message.type==='back') back();
    else if (message.type==='craft-exit'&&route.startsWith('make/')) back();
    else if (message.type==='craft-choose'&&route.startsWith('make/work/')) {
      go('make/choose',{replace:true,pick:route.split('/')[2]});
    }
    else if (message.type==='draft'&&glyphs[message.glyph]&&Object.hasOwn(stepNames,message.step)) {
      delete drafts[message.glyph];
      drafts[message.glyph] = message.step;
      write('jh-mobile-drafts',drafts);
    } else if (message.type==='make') {
      if (glyphs[message.glyph]) go('make/choose',{pick:message.glyph});
      else go('make');
    } else if (message.type==='work-stage'&&route.startsWith('make/work/')&&
      route.split('/')[2]===message.glyph&&drafts[message.glyph]==='perform') {
      go('play/work/'+message.glyph,{replace:true});
    }
    else if (message.type==='works') go('case/works');
    else if (message.type==='home') go('stage');
    else if (message.type==='stage-link') {
      const target={film:threeFilm,camera:'play/camera',touch:'play/touch',characters:'play/characters'}[message.target];
      if (target) go(target,{play:true});
    } else if (message.type==='cast'&&glyphs[message.glyph]) {
      lastGlyph=message.glyph;
      write('jh-mobile-recent',lastGlyph);
      personal.track('play/solo/'+lastGlyph);
    }
    else if (message.type==='camera') {
      const glyph = glyphs[message.glyph]?message.glyph:null;
      go(glyph?'play/camera/'+glyph+(message.work?'/work':''):'play/camera');
    } else if (message.type==='touch-return'&&route.startsWith('play/camera')) {
      const previous=previousPage(), [, ,lensGlyph='xi',variant]=route.split('/');
      if (message.glyph===lensGlyph&&message.work===(variant==='work')&&previous&&
        /^(play(?:\/(?:solo|work)\/\w+)?|make\/work\/\w+)$/.test(previous)) back();
      else {
        const id=glyphs[message.glyph]?.id||lensGlyph;
        go((message.work&&drafts[id]==='perform'?'play/work/':'play/solo/')+id,{replace:true});
      }
    }
  });
  function syncHistory() {
    const requested=location.hash.slice(1),next=validRoute(requested),current=history.state;
    if (requested!==next||current?.page!==next) {
      const previous=current?.jianghan&&(!current.page||current.page===requested)&&validRoute(current.previous)===current.previous
        ?current.previous:null;
      history.replaceState({jianghan:true,page:next,previous},'','#'+next);
    }
    if (next!==route) {
      app.querySelector('dialog[open]')?.close();
      render(next,true);
    }
  }
  window.addEventListener('popstate',syncHistory);
  window.addEventListener('hashchange',syncHistory);
  syncHistory();
})();
