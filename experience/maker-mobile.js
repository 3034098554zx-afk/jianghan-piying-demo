(() => {
  const $ = (selector, node=document) => node.querySelector(selector);
  const UI = window.ShadowCraftUI;
  const mat = (m) => 'matrix('+m.map(n=>Number(n.toFixed(5))).join(' ')+')';
  const project = (m,[x,y]) => [m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]];
  const attr = (value) => String(value??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');

  function assemblyPanel(panel, engine, advance) {
    const plan=engine.assembly();
    const filled=new Set(engine.describe().placed);
    const boardW=360, boardH=plan.parts.length>8?356:316;
    const b=plan.bounds;
    const scale=Math.min(174/b.w,(boardH-46)/b.h);
    const dx=boardW/2-(b.x+b.w/2)*scale,dy=boardH/2-(b.y+b.h/2)*scale;
    const parts=plan.parts.map((piece,index)=>{
      const [a,b,c,d,x,y]=piece.transform;
      const size=Math.min(64/piece.content.w,49/piece.content.h);
      const fitted=[a*scale,b*scale,c*scale,d*scale,x*scale+dx,y*scale+dy];
      const side=index%2,rows=Math.ceil((plan.parts.length-side)/2);
      const tray=[side?316:44,(boardH/(rows+1))*(Math.floor(index/2)+1)];
      const center=[piece.content.x+piece.content.w/2,piece.content.y+piece.content.h/2];
      const home=[size,0,0,size,tray[0]-center[0]*size,tray[1]-center[1]*size];
      const pin=piece.anchor?[piece.anchor.x,piece.anchor.y]:center;
      return {...piece,ref:'mp-'+index,tray,home,fitted,pin:project(fitted,pin)};
    });
    panel.innerHTML='<div class="assembly-mat">'+UI.waves+'<p class="assembly-tag">拖动部件完成连接</p>'+
      '<svg class="assembly-board" viewBox="0 0 '+boardW+' '+boardH+'" aria-label="皮影装配板"></svg></div>'+
      '<div class="assembly-meta"><span class="assembly-message" aria-live="polite"></span><span class="assembly-count"></span><button type="button" data-assembly-reset>拆开重装</button></div>'+
      '<div class="assembly-preview" hidden><span><strong>装配预览</strong><small>部件已归位，点亮灯幕吧。</small></span></div>';
    const matBoard=$('.assembly-mat',panel),board=$('.assembly-board',panel), message=$('.assembly-message',panel), count=$('.assembly-count',panel);
    const preview=$('.assembly-preview',panel), reset=$('[data-assembly-reset]',panel);
    const shapes=parts.map(p=>'<image id="'+p.ref+'" width="'+p.width+'" height="'+p.height+'" href="'+p.url+'"/>').join('');
    const use=(p,transform,cl='')=>'<use href="#'+p.ref+'" transform="'+mat(transform)+'" class="'+cl+'" aria-hidden="true"/>';
    let selected=null, drag=null, justPlaced=null;
    let copy='先选一片，拖到对应轮廓。';

    function paint() {
      const p=selected&&!filled.has(selected)?parts.find(q=>q.id===selected):null;
      const complete=filled.size===parts.length;
      const slots=parts.map(piece=>use(piece,piece.fitted,filled.has(piece.id)?
        'fitted'+(piece.id===justPlaced?' just-placed':''):'ghost')).join('');
      const outline=p?'<path d="M'+p.tray.join(' ')+' Q '+((p.tray[0]+p.pin[0])/2)+' '+(p.pin[1]-24)+' '+p.pin.join(' ')+'" fill="none" pointer-events="none" stroke="#b5673f" stroke-width="1.2" stroke-dasharray="4 4" opacity=".85"/>'+
        '<g class="target-area" data-place="'+attr(p.id)+'" role="button" tabindex="0" aria-label="连接'+attr(p.label)+'" transform="translate('+p.pin.join(' ')+')">'+
        '<circle r="23" fill="transparent"/><circle class="target-ring" r="9"/><circle r="3.5" fill="#fff8e8"/></g>':'';
      const loose=parts.filter(piece=>!filled.has(piece.id)).map(piece=>
        '<g data-piece="'+attr(piece.id)+'" class="part-tile'+(piece.id===selected?' active':'')+'" tabindex="0" role="button" aria-pressed="'+(piece.id===selected)+'" aria-label="拖动'+attr(piece.label)+'">'+
        '<rect class="tile-edge" x="'+(piece.tray[0]-35)+'" y="'+(piece.tray[1]-24)+'" width="70" height="48" rx="12"/>'+
        use(piece,piece.home)+'</g>').join('');
      board.innerHTML='<defs>'+shapes+'</defs>'+slots+loose+outline+'<g class="part-moving"></g>';
      matBoard.classList.remove('in-range');
      count.textContent=filled.size+' / '+parts.length+' 件';
      message.textContent=complete?'所有部件已连接。':copy;
      reset.disabled=filled.size===0;
      advance.disabled=!complete;
      preview.hidden=!complete;
      if (complete&&!$('svg',preview)) {
        const svg='<svg viewBox="'+[b.x-12,b.y-12,b.w+24,b.h+24].join(' ')+'" aria-label="已装配的皮影">'+
          parts.map(piece=>use(piece,piece.transform)).join('')+'</svg>';
        preview.insertAdjacentHTML('beforeend',svg);
      }
    }

    function setPart(id,focus=false) {
      const p=parts.find(q=>q.id===id);
      if (!p||filled.has(id)) return;
      selected=id;
      copy='把「'+p.label+'」拖到亮起的圆孔。';
      paint();
      if(focus)$('[data-place]',board)?.focus({preventScroll:true});
    }

    function place(id) {
      if(id!==selected||filled.has(id)) return;
      filled.add(id);
      justPlaced=id;
      engine.place([...filled]);
      copy='「'+parts.find(piece=>piece.id===id).label+'」已扣合。';
      selected=null;paint();
      justPlaced=null;
    }

    function coords(e) {
      const at=board.createSVGPoint();
      at.x=e.clientX;at.y=e.clientY;
      const local=at.matrixTransform(board.getScreenCTM().inverse());
      return [local.x,local.y];
    }

    function transfer(e) {
      const p=drag.piece,at=coords(e),delta=Math.hypot(at[0]-drag.start[0],at[1]-drag.start[1]);
      drag.moved ||= delta>3.5;
      if (!drag.moved) return;
      const target=$('[data-place]',board);
      const bounds=target.getBoundingClientRect();
      const near=Math.hypot(e.clientX-bounds.left-bounds.width/2,e.clientY-bounds.top-bounds.height/2)<=27;
      if (near!==drag.near) message.textContent=near?'圆孔已对齐，松手扣合。':copy;
      drag.near=near;
      const transform=[...p.fitted];
      if (!near) {transform[4]+=at[0]-p.pin[0];transform[5]+=at[1]-p.pin[1];}
      $('.part-moving',board).innerHTML=use(p,transform);
      matBoard.classList.toggle('in-range',drag.near);
      target.classList.toggle('in-range',drag.near);
    }

    board.addEventListener('pointerdown',e=>{
      if (e.button!==0||!e.isPrimary||drag) return;
      const tile=e.target.closest('[data-piece]');
      if (!tile) return;
      e.preventDefault();
      const piece=parts.find(p=>p.id===tile.dataset.piece);
      setPart(piece.id);
      drag={id:e.pointerId,piece,start:coords(e),moved:false,near:false};
      board.setPointerCapture(e.pointerId);
    });
    board.addEventListener('pointermove',e=>{if(drag?.id===e.pointerId)transfer(e);});
    board.addEventListener('pointerup',e=>{
      if (drag?.id!==e.pointerId) return;
      transfer(e);
      const {piece,moved,near}=drag;drag=null;
      if(moved&&near)place(piece.id);
      else {if(moved)copy='圆孔还未对齐，请移到高亮处松手。';paint();}
    });
    board.addEventListener('pointercancel',e=>{if(drag?.id===e.pointerId){drag=null;paint();}});
    board.addEventListener('click',e=>{
      const target=e.target.closest('[data-place]');
      if(target&&!drag)place(target.dataset.place);
    });
    board.addEventListener('keydown',e=>{
      if(!['Enter',' '].includes(e.key))return;
      const tile=e.target.closest('[data-piece]'),target=e.target.closest('[data-place]');
      if(!tile&&!target)return;
      e.preventDefault();
      if(tile)setPart(tile.dataset.piece,true);
      else {place(target.dataset.place);$('[data-piece]',board)?.focus({preventScroll:true});}
    });
    reset.addEventListener('click',()=>{
      filled.clear();selected=null;copy='先选一片，拖到对应轮廓。';engine.place([]);paint();
    });
    paint();
  }

  function mount({send,ready,waitFor}) {
    const engine=window.shadowMakerMobile;
    const query=new URLSearchParams(location.search);
    const editor=$('#editor'),workspace=$('.workspace',editor),tools=$('#stage-tools'),canvas=$('#work-canvas');
    const importing=query.get('mode')==='import';
    const standalone=query.get('mode')==='stage';
    const cameraMode=standalone&&query.get('camera')==='1';
    const ownWork=standalone&&query.get('work')==='1';
    const root=document.documentElement;
    root.classList.toggle('show-import',importing);
    root.classList.toggle('camera-room',cameraMode);
    editor.classList.add('mobile-step');
    const nav=document.createElement('header');
    nav.className='craft-inner-nav';
    nav.innerHTML='<button type="button" class="craft-back" aria-label="'+(standalone?'返回':'退出制影')+'">'+UI.icon('back')+'</button>'+
      '<span><strong>亲手制影</strong><small>五步体验 · 从一张皮到一出戏</small></span>'+
      '<button type="button" class="theatre-more" aria-label="戏台菜单" aria-expanded="false" hidden>'+UI.icon('more')+'</button>';
    const flow=document.createElement('div');
    flow.className='craft-editor-head';
    const dock=document.createElement('footer');
    dock.className='craft-footer';
    dock.innerHTML=UI.waves+'<button type="button" class="craft-outline" data-previous>上一步</button>'+
      '<button type="button" class="craft-primary" data-advance></button>';
    const next=$('[data-advance]',dock);
    const apart=document.createElement('section');
    apart.className='assembly-panel';
    apart.id='manual-assembly';
    apart.hidden=true;
    const meter=document.createElement('label');
    meter.className='craft-meters';
    meter.innerHTML='<span></span><progress value="0" max="1"></progress><output></output>';
    const overlay=document.createElement('div');
    overlay.className='mobile-canvas-tools';
    const inset=document.createElement('div');
    inset.className='board-reference';
    inset.innerHTML='<img alt="">';
    $('#canvas-wrap').append(inset,overlay);
    editor.prepend(nav,flow);
    editor.append(dock);
    workspace.append(apart,meter);
    let last=null, previousDraft=null, room=null;

    function previous() {
      const {stage}=engine.describe();
      const index=UI.steps.findIndex(step=>step[0]===stage);
      if(index<=1){send('craft-choose');return;}
      engine.openStep(UI.steps[index-1][0]);sync();
    }

    function instrument(stage, info) {
      overlay.replaceChildren();
      inset.hidden=stage==='perform'||stage==='assemble';
      if (!inset.hidden) $('img',inset).src='../assets/'+info.glyph+'.webp';
      const section=$('.tool-section',tools);
      if (stage==='carve') {
        for(const id of ['undo','redo']) {
          const button=$('#'+id);
          if(!button)continue;
          button.type='button';button.innerHTML=UI.icon(id);button.setAttribute('aria-label',id==='undo'?'撤销雕刻':'重做雕刻');
          overlay.append(button);
        }
        const free=$('[data-tool="knife"]',section), straight=$('[data-tool="line"]',section);
        if(free)free.innerHTML=UI.icon('carve')+'自由线';
        if(straight)straight.innerHTML=UI.icon('carve')+'直线刀';
        const details=document.createElement('details');
        details.className='maker-details';
        details.innerHTML='<summary>刻痕宽度与观察比例</summary>';
        for(const id of ['knife-width','zoom']){
          const input=$('#'+id);
          if(input?.previousElementSibling?.localName==='label')details.append(input.previousElementSibling);
          if(input)details.append(input);
        }
        const strip=$('.tool-buttons',section),feel=$('.craft-feel-tools',section);
        if(strip&&feel) {
          const buttons=Array.from(feel.querySelectorAll('button'));
          strip.append(...buttons);feel.remove();
        }
        const clear=$('#clear');if(clear)details.append(clear);
        section.append(details);
      } else if(stage==='color') {
        for(const [name,delta,label] of [['plus',.12,'放大'],['minus',-.12,'缩小']]) {
          const button=document.createElement('button');
          button.type='button';button.innerHTML=UI.icon(name);button.setAttribute('aria-label',label);
          button.onclick=()=>engine.zoom(delta);overlay.append(button);
        }
        $('#canvas-hint').textContent='点部件或拖入颜料，刻过的孔隙会透光。';
      }
    }

    function progress(info) {
      if (!['carve','color'].includes(info.stage)) return;
      const carving=info.stage==='carve';
      const done=carving?info.carved:info.colored;
      const completed=carving?info.carvedParts:info.coloredParts;
      $('span',meter).textContent=carving?'雕刻进度':'上色进度';
      $('progress',meter).max=info.count||1;
      $('progress',meter).value=done;
      $('output',meter).value=done+' / '+info.count+' 件';
      for (const button of editor.querySelectorAll('[data-part]')) {
        const finished=completed.includes(button.dataset.part);
        button.dataset.workState=finished?'finished':'ready';
        const name=button.querySelector('span')?.firstChild?.textContent;
        const label='选择'+name+(finished?(carving?'，已雕刻':'，已上色'):'');
        if(name&&button.getAttribute('aria-label')!==label)button.setAttribute('aria-label',label);
      }
    }

    function sync() {
      const s=engine.describe();
      if(!s.ready)return;
      if(s.stage==='choose') {
        ready();
        return;
      }
      if (importing) root.classList.remove('show-import');
      const key=s.glyph+'-'+s.stage;
      if (key!==last) {
        last=key;
        room?.destroy();room=null;
        editor.dataset.mobileStage=s.stage;
        apart.hidden=s.stage!=='assemble';
        flow.hidden=s.stage==='perform';
        dock.hidden=s.stage==='perform';
        meter.hidden=!['carve','color'].includes(s.stage);
        nav.querySelector('.theatre-more').hidden=s.stage!=='perform';
        if (s.stage==='perform') {
          nav.querySelector('strong').textContent=cameraMode?'镜头操纵':!standalone||ownWork?'作品戏台':'互动戏台';
          nav.querySelector('small').textContent=cameraMode?'双手牵杆，在旧灯幕上演一出戏':standalone&&!ownWork?'牵动笔画，让江汉字影上幕':'操控你的皮影，演一段光影戏';
          room=window.ShadowMobileTheatre.mount({engine,editor,workspace,canvas,nav,send,standalone,cameraMode,ownWork});
        } else {
          nav.querySelector('strong').textContent='亲手制影';
          nav.querySelector('small').textContent='五步体验 · 从一张皮到一出戏';
          flow.innerHTML=UI.heading(s.stage)+'<div class="craft-step-strip">'+UI.progress(s.stage)+'</div>';
          next.disabled=false;
          next.innerHTML=({carve:'完成雕刻',color:'完成上色',assemble:'完成装配'}[s.stage]||'下一步')+' '+UI.icon('next');
          if (s.stage==='assemble') assemblyPanel(apart,engine,next);
        }
        instrument(s.stage,s);
        window.scrollTo(0,0);
      }
      progress(s);
      if(!standalone && previousDraft!==key) {
        previousDraft=key;
        send('draft',{glyph:s.glyph,step:s.stage});
      }
      ready();
    }

    $('button.craft-back',nav).addEventListener('click',()=>send(standalone?'back':'craft-exit'));

    $('[data-previous]',dock).addEventListener('click',previous);
    next.addEventListener('click',()=>{
      const index=UI.steps.findIndex(step=>step[0]===engine.describe().stage);
      if(UI.steps[index+1]&&engine.openStep(UI.steps[index+1][0]))sync();
    });
    new MutationObserver(sync).observe(editor,{attributes:true,attributeFilter:['data-craft-stage','hidden']});
    new MutationObserver(sync).observe(tools,{childList:true});
    new MutationObserver(sync).observe($('#surface-meta'),{childList:true});
    editor.addEventListener('click',()=>queueMicrotask(sync));
    editor.addEventListener('pointerup',()=>queueMicrotask(sync));
    waitFor(()=>engine.describe().ready,sync);
  }
  window.ShadowMobileMaker={mount};
})();
