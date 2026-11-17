(() => {
  const steps = [
    ['choose','选皮','挑一个字，用它的牛皮毛坯开始制影。'],
    ['carve','雕刻','在牛皮部件上落刀，让光从刻痕里透出来。'],
    ['color','上色','点选部件，再挑一种颜色敷在皮面上。'],
    ['assemble','装配','拖动散片，对准灯幕上的轮廓与圆孔。'],
    ['perform','成影','点亮灯幕，操控亲手制作的皮影。']
  ];
  const shape = '<path d="M30 2.5c7.8 0 13.6 4.4 16.4 11 6.7 2.8 11.1 8.7 11.1 16.5s-4.4 13.7-11.1 16.5C43.6 53 37.8 57.5 30 57.5S16.4 53 13.6 46.5C7 43.7 2.5 37.8 2.5 30S7 16.3 13.6 13.5C16.4 6.9 22.2 2.5 30 2.5Z"/>';
  const shapes = {
    choose:'<path d="M8 3.6c2 1.5 6 1.5 8 0l2.8 2.7-1.2 3.5c-.6 1.7-.6 2.8 0 4.5l1.2 3.4-2.8 2.7c-2-1.5-6-1.5-8 0l-2.8-2.7 1.2-3.4c.6-1.7.6-2.8 0-4.5L5.2 6.3z"/>',
    carve:'<path d="m14.7 9 5-5a1.4 1.4 0 0 1 2 2l-5.1 5.1zM11.5 12.1l3-3 2 2-3 3zM2.5 21l5-2.5 4.1-5.7 1.9 1.8-4.3 5.9Z" fill="currentColor" stroke="none"/>',
    color:'<path d="M7.2 16.2c3.4-.2 4.6-1.6 5.2-4l6.5-8.5a1.6 1.6 0 0 1 2.5 2l-6.7 8.7c-1.6 3-4.7 5-9.1 5-.9 0-1.8-.1-2.5-.4 2.4-.6 2.3-2.6 4.1-2.8z" fill="currentColor" stroke="none"/><path d="m13.2 11.2 2 1.6" stroke="#fbdfaa"/>',
    assemble:'<path d="m6 17 6-11 6 11M6 17h12"/><circle cx="12" cy="5.5" r="2.1" fill="var(--seal-infill,#f8e8d1)"/><circle cx="5.7" cy="17.7" r="2.1" fill="var(--seal-infill,#f8e8d1)"/><circle cx="18.3" cy="17.7" r="2.1" fill="var(--seal-infill,#f8e8d1)"/>',
    perform:'<path d="M3 4h18v3H3zM4 8c4 1 6 1 8-1 2 2 4 2 8 1-2.6 1.9-5.8 2.2-8 .6-2.3 1.6-5.5 1.3-8-.6zM4 9c2 0 3.3.7 4.5.7-1 4.6-2.5 6.4-4.8 8.8H3zM20 9c-2 0-3.3.7-4.5.7 1 4.6 2.5 6.4 4.8 8.8H21z" fill="currentColor" stroke="none"/>',
    back:'<path d="m14 4-8 8 8 8"/>',
    next:'<path d="m9 5 7 7-7 7"/>',
    check:'<path d="m5 12 4.5 4.5L19 7"/>',
    works:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M6 3h12M3 17l5-5 4 4 3-2.5 6 5.5"/><circle cx="16" cy="10" r="1.3"/>',
    layers:'<path d="m12 3 9 5-9 5-9-5 9-5zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
    wave:'<path d="M2.6 7.4c6.1-5.5 12.5 5.3 18.8 0M2.6 12c6.1-5.5 12.5 5.3 18.8 0M2.6 16.6c6.1-5.5 12.5 5.3 18.8 0"/>',
    weave:'<path d="M7 3v18M12 3v18M17 3v18M3 7h18M3 12h18M3 17h18"/>',
    undo:'<path d="M8 5 3 10l5 5m-5-5h10a5 5 0 0 1 0 10h-3"/>',
    redo:'<path d="m16 5 5 5-5 5m5-5H11a5 5 0 0 0 0 10h3"/>',
    reset:'<path d="M4 11a8 8 0 1 1 2 7M4 5v6h6"/>',
    zoom:'<path d="M4 20 20 4M14 4h6v6M4 14v6h6"/>',
    plus:'<path d="M5 12h14M12 5v14"/>',
    minus:'<path d="M5 12h14"/>',
    move:'<path d="M12 2v20M2 12h20m-13-7 3-3 3 3m-6 14 3 3 3-3M5 9l-3 3 3 3m14-6 3 3-3 3"/>',
    spin:'<path d="M6 6a8 8 0 0 1 13 3m1-4v5h-5M18 18a8 8 0 0 1-13-3m-1 4v-5h5"/>',
    sound:'<path d="M9 17V5l11-2v12M9 7l11-2"/><ellipse cx="6" cy="17.5" rx="3" ry="2.3"/><ellipse cx="17" cy="15.5" rx="3" ry="2.3"/>',
    play:'<path d="m8 5 13 7-13 7Z" fill="currentColor" stroke="none"/>',
    camera:'<path d="M3 6h13v12H3zM16 10l5-3v10l-5-3"/>',
    more:'<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>'
  };
  const icon = (name) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shapes[name]+'</svg>';
  const seal = (name) => '<span class="craft-seal"><svg class="craft-seal-bg" viewBox="0 0 60 60" aria-hidden="true">'+shape+'</svg>'+icon(name)+'</span>';
  const progress = (stage) => {
    const current=steps.findIndex(([id])=>id===stage);
    return '<ol class="craft-steps" aria-label="制作进度">'+steps.map(([id,title],index)=>
      '<li class="'+(index===current?'current':index<current?'passed':'pending')+'"'+(index===current?' aria-current="step"':'')+'>'+
      seal(id)+'<span class="craft-step-label">'+title+'</span></li>').join('')+'</ol>';
  };
  const heading = (stage, description) => {
    const index=steps.findIndex(([id])=>id===stage);
    const [,title,copy]=steps[index];
    return '<div class="craft-intro"><div class="craft-heading-row"><h1>'+title+'</h1>'+
      '<span class="craft-index">步骤 <strong>'+String(index+1).padStart(2,'0')+'</strong> / 05</span></div>'+
      '<p>'+(description||copy)+'</p></div>';
  };
  const waves = '<svg class="craft-waves" aria-hidden="true" viewBox="0 0 400 46" preserveAspectRatio="none"><path d="M0 21C34 0 60 15 98 33s70 14 103 1c49-19 84-16 120-9 33 6 63-8 79-16v37H0Z"/><path d="M0 31c38-20 64-8 108 9s71 2 102-8c71-23 90 10 144 0l46-16M0 40c36-17 63-8 101 6M294 46c43-25 76 4 106-17"/></svg>';
  window.ShadowCraftUI = {steps,icon,seal,progress,heading,waves};
})();
