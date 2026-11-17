
(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const root = document.documentElement;
  const mode = root.dataset.mode;
  const query = new URLSearchParams(location.search);
  let notified = false;
  function send(type, extra = {}) {
    if (window.top !== window) {
      parent.postMessage({app:'jianghan-mobile',type,...extra},
        location.protocol === 'file:' ? '*' : location.origin);
    }
  }
  function ready() {
    if (!notified) { notified = true; send('ready'); }
  }
  function waitFor(predicate, action, until = performance.now()+50000) {
    if (predicate()) action();
    else if (performance.now()<until&&!root.dataset.frameFailed) setTimeout(()=>waitFor(predicate,action,until),120);
    else send('load-error');
  }
  function button(id,text,action) {
    const node=document.createElement('button');
    node.type='button';
    if (id) node.id=id;
    node.textContent=text;
    if (action) node.addEventListener('click',action);
    return node;
  }
  function details(name,className) {
    const node=document.createElement('details');
    node.className=className;
    const label=document.createElement('summary');
    label.textContent=name;
    node.append(label);
    return node;
  }

  function solo() {
    const panel=document.createElement('section');
    panel.className='solo-controls';
    panel.setAttribute('aria-label','字影操控');
    const toolbar=document.createElement('div');
    toolbar.className='solo-toolbar';
    const guide=document.createElement('p');
    guide.className='solo-help';
    guide.textContent='拖动笔画或操纵杆，松手看它回摆。';
    const canvas=$('#screen');
    const rod = button('mobile-rod','牵杆',()=>toggleLamp(false));
    const lamp = button('mobile-lamp','移灯',()=>toggleLamp(true));
    const scatter = button('mobile-scatter','拆开',()=>$('#explode').click());
    toolbar.append(rod,lamp,scatter);
    const settings=details('调光与字影大小','solo-sheet');
    settings.append($('.view-tools'));
    const motions=details('关节、动作与江汉故事','solo-sheet solo-sheet-motion');
    motions.append($('.stage-modes'),$('.sidebar'));
    panel.append(toolbar,guide,$('.stage-footer'),settings,motions);
    $('#theatre').after(panel);
    for (const old of ['#back','.craft-return','.shop-entry','.make-entry','#assembly-caption']) {
      for (const node of document.querySelectorAll(old)) node.hidden=true;
    }
    const cue = document.createElement('span');
    cue.className='mobile-light-cue';
    cue.setAttribute('aria-hidden','true');
    $('#theatre').append(cue);
    let lampMode=false, lampPointer=null;
    function toggleLamp(on) {
      lampMode=on;
      rod.setAttribute('aria-pressed',String(!on));
      lamp.setAttribute('aria-pressed',String(on));
      root.classList.toggle('is-moving-light',on);
      guide.textContent=on?'沿幕布拖动灯光，看投影的方向和长短变化。':'拖动笔画或操纵杆，松手看它回摆。';
      if (!on) cue.classList.remove('on');
    }
    toggleLamp(false);
    function moveLight(event) {
      const box=canvas.getBoundingClientRect();
      const x=event.clientX-box.left,y=event.clientY-box.top;
      cue.style.left=x+'px';
      cue.style.top=y+'px';
      cue.classList.add('on');
      window.shadowTheatre?.moveLight(x,y,false);
    }
    canvas.addEventListener('pointerdown',event=>{
      if (!lampMode||event.button!==0) return;
      event.stopImmediatePropagation();
      event.preventDefault();
      lampPointer=event.pointerId;
      canvas.setPointerCapture(event.pointerId);
      moveLight(event);
    },true);
    canvas.addEventListener('pointermove',event=>{
      if (!lampMode||event.pointerId!==lampPointer) return;
      event.stopImmediatePropagation();
      moveLight(event);
    },true);
    for (const name of ['pointerup','pointercancel','lostpointercapture']) {
      canvas.addEventListener(name,event=>{
        if (event.pointerId!==lampPointer) return;
        event.stopImmediatePropagation();
        lampPointer=null;
        cue.classList.remove('on');
      },true);
    }
    const explode=$('#explode');
    new MutationObserver(()=>{
      const on=explode.getAttribute('aria-pressed')==='true';
      scatter.textContent=on?'合拢':'拆开';
      scatter.setAttribute('aria-pressed',String(on));
    }).observe(explode,{attributes:true,attributeFilter:['aria-pressed']});
    const more=button(null,'制作这一个字 →',()=>send('make',{glyph:window.shadowTheatre?.state.glyphId}));
    more.className='mobile-more';
    panel.append(more);
    waitFor(()=>window.shadowTheatre?.state.ready, ready);
  }

  function frontStage() {
    if (mode==='solo') { solo(); return; }
    if (mode==='show') {
      $('#ensemble-back').addEventListener('click',()=>send('back'));
      const progress=$('.ensemble-progress');
      const timeline=document.createElement('input');
      timeline.type='range';timeline.min='0';timeline.max='8.4';timeline.step='.02';timeline.value='0';
      timeline.setAttribute('aria-label','拖动演出进度');
      timeline.id='mobile-ensemble-seek';
      progress.after(timeline);
      const sync=()=>{
        if (document.activeElement!==timeline) timeline.value=progress.getAttribute('aria-valuenow')||0;
      };
      new MutationObserver(sync).observe(progress,{attributes:true,attributeFilter:['aria-valuenow']});
      timeline.addEventListener('input',()=>{
        if (window.shadowEnsemble?.state.loaded) window.shadowEnsemble.seek(Number(timeline.value));
      });
      $('#ensemble-play').querySelector('span').textContent='开演';
      waitFor(()=>window.shadowEnsemble?.state.open,ready);
      return;
    }
    $('#puppet-back').addEventListener('click',()=>send('back'));
    if (mode==='touch') {
      $('#puppet-invitation h2').textContent='轮到你来操偶';
      $('#puppet-invitation p').textContent='开场后，在幕上拖动手指。';
      $('.puppet-manual-hint').textContent='在幕上拖动字影。按住「蓄力」松手跳跃，或点「齐亮相」。';
      const next=button(null,'切换到镜头操偶 →',()=>send('camera'));
      next.className='mobile-more';
      $('.puppet-controls').append(next);
    } else {
      $('#puppet-invitation h2').textContent='张开手掌，启幕';
      $('#puppet-invitation p').textContent='开启镜头后，把手掌举到镜头前。';
      $('#puppet-manual').textContent='先用手指在幕上练习';
      const camera = $('#puppet-camera');
      $('.puppet-header').prepend(camera);
      $('.puppet-controls').prepend($('.puppet-camera-status'),$('#puppet-camera-error'));
      if (!navigator.mediaDevices?.getUserMedia) {
        $('#puppet-camera').disabled=true;
        $('#puppet-camera-status').textContent='当前预览未开启镜头权限';
        const status=$('#puppet-camera-error');
        status.hidden=false;
        status.textContent='镜头操偶需在支持摄像头权限的页面打开。下方的触屏操偶可以直接试。';
      }
    }
    $('#puppet-charge').textContent='按住蓄力';
    $('#puppet-replay').textContent='再演一场';
    waitFor(()=>window.shadowPuppeteer?.state.loaded,()=>{
      if (mode==='touch') $('#puppet-act').textContent='候场 · 点「开场」';
      ready();
    });
  }

  function maker() {
    window.ShadowMobileMaker.mount({send,ready,waitFor});
  }

  function object() {
    const dialog=$('#object-dialog');
    dialog.addEventListener('close',()=>send('back'));
    waitFor(()=>dialog.open,ready);
  }

  if (root.classList.contains('mobile-stage')) frontStage();
  else if (root.classList.contains('mobile-maker')) maker();
  else if (root.classList.contains('mobile-object')) object();
  window.addEventListener('message',event=>{
    if(event.source!==parent||(location.protocol!=='file:'&&event.origin!==location.origin)) return;
    if(event.data?.app==='jianghan-mobile'&&event.data.type==='interface-options') {
      root.classList.toggle('reduce-interface-motion',event.data.lessMotion===true);
    }
  });
  window.addEventListener('keydown',event=>{
    if (event.key==='Escape'&&!event.defaultPrevented&&!document.querySelector('dialog[open]:not(#puppet-dialog)')) send('back');
  });
})();
