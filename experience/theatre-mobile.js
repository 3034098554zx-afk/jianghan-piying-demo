(() => {
 const U=window.ShadowCraftUI;
 const $=(s,r=document)=>r.querySelector(s);
 const icon=U.icon;
 const button=(id,img,label)=>'<button type="button" data-room="'+id+'">'+icon(img)+'<span>'+label+'</span></button>';
 const glyphs=[['pi','皮'],['ying','影'],['xi','戏']];
 const dialPicture='<svg class="theatre-dial-art" viewBox="0 0 120 120" aria-hidden="true">'+
  '<circle cx="60" cy="60" r="57" class="dial-face"/><path d="M14 60a46 46 0 0 1 92 0" class="dial-track"/>'+
  '<path d="M14 60a46 46 0 0 1 92 0" pathLength="100" class="dial-fill" stroke-dasharray="50 100"/>'+
  '<circle cx="60" cy="60" r="10" class="dial-center"/><circle cx="60" cy="14" r="5.7" class="dial-thumb"/></svg>';
 function mount({engine,editor,workspace,canvas,nav,send,standalone,cameraMode,ownWork}) {
  editor.classList.toggle('is-result',!standalone);
  const create=(tag,cls,html,parent)=>{const n=document.createElement(tag);n.className=cls;n.innerHTML=html;parent.append(n);return n;};
  const backdrop=document.createElement('img');
  backdrop.className='theatre-backdrop';backdrop.alt='';backdrop.setAttribute('aria-hidden','true');
  backdrop.src=cameraMode?(location.protocol==='file:'?window.ShadowCameraArt:'../assets/camera-cloth.webp'):window.ShadowRoomArt||'../assets/stage-room.webp';editor.prepend(backdrop);
  const overlay=create('div','theatre-overlay',
   '<div class="theatre-rail theatre-left" aria-label="操作方式">'+button('move','move','移动')+button('turn','spin','旋转')+
   button('scale','zoom','缩放')+button('layer','layers','图层')+'</div><div class="theatre-rail theatre-right" aria-label="戏台设置">'+
   button('roles','works','角色')+button('backdrops','perform','幕布')+button('sounds','sound','音效')+'</div>',$('#canvas-wrap'));
  const entry=(id,symbol,title,caption)=>'<button type="button" class="theatre-entry" data-room="'+id+'">'+icon(symbol)+
   '<span><strong>'+title+'</strong><small>'+caption+'</small></span>'+icon('next')+'</button>';
  const lensEntry=entry('camera','camera','镜头操纵','双手捏杆操控');
  const entries=cameraMode?'':standalone?'<div class="theatre-entries">'+
   entry('make','carve','亲手制作','做自己的皮影')+lensEntry+'</div>':lensEntry;
  const result=standalone?'':'<section class="theatre-result" aria-label="成影">'+
   '<header><h2>成影 <span>步骤 05 / 05</span></h2><button type="button" data-room="review-assembly">返回装配</button></header>'+
   '<div><button type="button" class="craft-outline" data-room="save-work">保存作品</button>'+
   '<button type="button" class="craft-primary" data-room="work-stage">带我的皮影登台 '+icon('next')+'</button></div></section>';
  const controls=create('section','theatre-controls',
   '<div class="stage-toggle" aria-label="姿态操控">'+button('move','move','整体移动')+button('joint','assemble','关节操控')+'</div>'+
   '<p class="theatre-instruction" aria-live="polite"></p>'+result+entries+'<div class="theatre-work-area"><div class="theatre-templates"><h2>动作模板</h2><div>'+
   ['亮相','舞袖','收势'].map((label,i)=>'<button type="button" data-room="template" data-value="'+i+'" aria-pressed="false"><img alt=""><span>'+label+'</span></button>').join('')+
   '</div></div><div class="theatre-adjust">'+button('undo','undo','撤销')+'<label class="theatre-dial"><span>角度</span>'+
   dialPicture+'<output>0°</output><input type="range" min="-90" max="90" value="0" aria-label="旋转角度"></label>'+button('reset','reset','重置')+'</div></div>',workspace);
  const actions=create('footer','craft-footer theatre-footer',
    '<button type="button" class="craft-outline" data-room="play">'+icon('play')+'<span>预览演出</span></button>'+
    '<button type="button" class="craft-primary" data-room="record">'+icon('camera')+'<span>录制我的演出</span></button>',editor);
  const panel=create('div','theatre-options','',nav);
  panel.hidden=true;
  const more=$('.theatre-more',nav),range=$('input[type=range]',controls),output=$('output',controls),hint=$('.theatre-instruction',controls);
  const dial=$('.theatre-dial',controls),dialThumb=$('.dial-thumb',dial),dialFill=$('.dial-fill',dial);
  const playButton=$('[data-room="play"]',actions),recordButton=$('[data-room="record"]',actions);
  const playText=$('span',playButton),recordText=$('span',recordButton),undoButton=$('[data-room="undo"]',controls);
  const modeButtons=[...editor.querySelectorAll('[data-room="move"],[data-room="turn"],[data-room="scale"],[data-room="joint"],[data-room="layer"]')];
  const templateButtons=[...controls.querySelectorAll('[data-room="template"]')];
  const menuButtons=[...editor.querySelectorAll('.theatre-more,[data-room="roles"],[data-room="backdrops"],[data-room="sounds"]')];
  playButton.style.setProperty('--preview-duration',engine.stageRead().duration+'s');
  let painting=0,refreshFrame=0,visible=true,lastAngle,lastLimit,lastMode,lastTemplate;
  const audio=new Audio('../assets/theatre-drum.mp3');
  audio.preload='none';audio.volume=.6;
  const tips={joint:'牵杆带影偶移动，拖关节可单独摆动。',move:'在灯幕上拖动，让皮影移动。',turn:'左右拖动，让影偶转一整圈。',scale:'上下拖动，放大或缩小皮影。',layer:'点一下部件，把它移到最前。'};
  let activePanel='',lastArt='',sound=false,recorder=null,recordingAt=0,timer,context,source,audioDestination,previewUntil=0;
  const playSound=()=>{if(sound){audio.currentTime=0;audio.play().catch(()=>{});}};
  function refresh() {
   const s=engine.stageRead();
   const limit=s.angleLimit;
   const guidance=s.mode==='joint'&&s.jointLabel?'已选「'+s.jointLabel+'」'+
    (s.sharedJoint?'，再点圆孔切换部件。':'，可拖动关节或使用角度盘。'):tips[s.mode];
   if(hint.textContent!==guidance)hint.textContent=guidance;
   if(s.amount!==lastAngle||limit!==lastLimit){
    lastAngle=s.amount;lastLimit=limit;
    range.min=String(-limit);range.max=String(limit);range.value=s.amount;
    output.value=s.amount+'°';
    const percent=Math.max(0,Math.min(100,(s.amount+limit)*50/limit)),phase=Math.PI*(1-percent/100);
    dialThumb.setAttribute('cx',60+46*Math.cos(phase));dialThumb.setAttribute('cy',60-46*Math.sin(phase));
    dialFill.setAttribute('stroke-dasharray',percent+' 100');
   }
   const tone={amber:'none',paper:'saturate(.55) brightness(1.13)',night:'saturate(.71) brightness(.79) hue-rotate(-7deg)'}[s.backdrop];
   if(backdrop.style.filter!==tone)backdrop.style.filter=tone;
   if(lastMode!==s.mode){
    lastMode=s.mode;
    range.disabled=!['joint','turn'].includes(s.mode);
    dial.setAttribute('aria-disabled',String(range.disabled));
    for(const b of modeButtons)b.setAttribute('aria-pressed',String(s.mode===b.dataset.room));
   }
   if(lastTemplate!==s.template){
    lastTemplate=s.template;
    for(const b of templateButtons)b.setAttribute('aria-pressed',String(s.template===b.dataset.value));
   }
   undoButton.disabled=!s.canUndo;
   if(playButton.getAttribute('aria-pressed')!==String(s.playing)){
    playButton.setAttribute('aria-pressed',String(s.playing));
    playText.textContent=s.playing?'停止预演':'预览演出';
   }
   const recording=recorder?.state==='recording';
   const recordLabel=recording?'结束录制 '+Math.floor((Date.now()-recordingAt)/1000)+'秒':'录制我的演出';
   recordButton.setAttribute('aria-pressed',String(recording));
   if(recordText.textContent!==recordLabel)recordText.textContent=recordLabel;
   const art=s.actor==='mine'?'blank-'+engine.describe().glyph:s.original;
   if(art!==lastArt){lastArt=art;for(const img of controls.querySelectorAll('img'))img.src='../assets/'+art+'.webp';}
   if(!recording&&!s.playing&&Date.now()>previewUntil)audio.pause();
  }
  function queueRefresh() {
   if (!visible||refreshFrame) return;
   refreshFrame=requestAnimationFrame(()=>{refreshFrame=0;refresh();});
  }
  function menu(name='') {
   activePanel=activePanel===name?'':name;panel.hidden=!activePanel;
   for(const button of menuButtons)button.setAttribute('aria-expanded',String(activePanel===(button.dataset.room||'links')));
   if(!activePanel)return;
   const choices={
    roles:['更换角色',((standalone&&!ownWork)?[]:[['mine','我的作品']]).concat(glyphs).map(([id,label])=>[id,label,'actor'])],
    backdrops:['更换幕布',[['amber','暖光幕布','backdrop'],['paper','米白幕布','backdrop'],['night','夜色灯幕','backdrop']]],
    sounds:['演出音效',[['drum','江汉锣鼓','sound'],['off','静音','sound']]],
    links:['戏台',standalone&&!ownWork?[
     ['film','三字同台 · 一幕三字','link'],['touch','触屏操偶','link'],['characters','选单字','link']
    ]:[['works','我的作品','link'],['export','导出制作稿','link'],['photo','保存作品图片','link']]]
   };
   const [nameText,rows]=choices[activePanel];
   panel.innerHTML='<h2>'+nameText+'</h2>'+rows.map(([value,label,type])=>'<button type="button" data-room="'+type+'" data-value="'+value+'">'+label+icon('next')+'</button>').join('');
  }
  const status=engine.feedback;
  function save(blob,name) {
   if(!blob)return;
   const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();
   setTimeout(()=>URL.revokeObjectURL(url),12000);
  }

  function movieCanvas() {
   const movie=document.createElement('canvas');
   movie.width=canvas.width;movie.height=canvas.height;
   const g=movie.getContext('2d');
   function paint() {
    const board=canvas.getBoundingClientRect(),scene=backdrop.getBoundingClientRect();
    g.fillStyle='#f5d7a9';g.fillRect(0,0,movie.width,movie.height);
    if(backdrop.complete&&backdrop.naturalWidth&&scene.width&&scene.height) {
     const sx=backdrop.naturalWidth/scene.width,sy=backdrop.naturalHeight/scene.height;
     g.filter=backdrop.style.filter||'none';
     g.drawImage(backdrop,(board.left-scene.left)*sx,(board.top-scene.top)*sy,board.width*sx,board.height*sy,0,0,movie.width,movie.height);
     g.filter='none';
    }
    g.drawImage(canvas,0,0,movie.width,movie.height);
   }
   paint();
   return {movie,paint};
  }

  function record() {
   if(recorder?.state==='recording'){recorder.stop();return;}
   if(recorder)return;
   if(!window.MediaRecorder||!canvas.captureStream){status('此浏览器暂不支持录制，可继续预览演出。');return;}
   let stream;
   try {
    const {movie,paint}=movieCanvas();
    stream=movie.captureStream(30);
    let lastFrame=0;
    function loop(now){if(now-lastFrame>=31){paint();lastFrame=now;}painting=requestAnimationFrame(loop);}
    painting=requestAnimationFrame(loop);
    if(sound&&window.AudioContext&&location.protocol!=='file:') {
     context ||= new AudioContext();
     if(!source){source=context.createMediaElementSource(audio);audioDestination=context.createMediaStreamDestination();source.connect(context.destination);source.connect(audioDestination);}
     context.resume().catch(()=>{});
     for(const track of audioDestination.stream.getAudioTracks())stream.addTrack(track);
    }
    const type=['video/webm;codecs=vp8','video/mp4','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
    const made=type?new MediaRecorder(stream,{mimeType:type}):new MediaRecorder(stream);
    const chunks=[];
    recorder=made;
    made.addEventListener('dataavailable',e=>{if(e.data.size)chunks.push(e.data);});
    made.addEventListener('stop',()=>{
     cancelAnimationFrame(painting);
     stream.getVideoTracks().forEach(t=>t.stop());clearTimeout(timer);audio.pause();
     if(chunks.length){const type=made.mimeType||'video/webm';save(new Blob(chunks,{type}),'江汉皮影-我的演出.'+(type.includes('mp4')?'mp4':'webm'));status('已生成演出文件');}
     else status('这次录制没有画面，请重新录制。');
     recorder=null;
     refresh();
    });
    made.addEventListener('error',()=>status('录制未能保存，请重试。'));
    recordingAt=Date.now();made.start(180);playSound();timer=setTimeout(()=>{if(made.state==='recording')made.stop();},25000);refresh();
   } catch {recorder=null;cancelAnimationFrame(painting);stream?.getVideoTracks().forEach(t=>t.stop());status('录制暂时不可用，仍可预览演出。');}
  }
  function click(e) {
   const b=e.target.closest('[data-room]');if(!b)return;
   const {room:id,value}=b.dataset;
   if(['move','turn','scale','layer','joint'].includes(id))engine.stageAction('mode',id);
   else if(['roles','backdrops','sounds'].includes(id))menu(id);
   else if(id==='play'){engine.stageAction('play');if(engine.stageRead().playing)playSound();else audio.pause();}
   else if(id==='record')record();
   else if(id==='make')send('make');
   else if(id==='review-assembly'){engine.openStep('assemble');return;}
   else if(id==='save-work'||id==='work-stage'){
    if(!engine.saveWork())status('浏览器暂时无法保存，可从戏台菜单导出制作稿。');
    else if(id==='work-stage')send('work-stage',{glyph:engine.describe().glyph});
    else status('作品已保存在「我的作品」');
   }
   else if(id==='camera'){
    const s=engine.stageRead(),work=s.actor==='mine';
    send('camera',{glyph:work?engine.describe().glyph:s.original,work});
   }
   else if(id==='touch-return'){
    lens?.stop();
    const s=engine.stageRead(),work=s.actor==='mine';
    send('touch-return',{glyph:work?engine.describe().glyph:s.original,work});
   }
   else if(id==='sound'){sound=value==='drum';previewUntil=Date.now()+2500;if(sound)playSound();else audio.pause();menu();}
   else if(id==='link'){
    menu();
    if(value==='works')send('works');else if(value==='export')$('#save-draft').click();
    else if(value==='photo')movieCanvas().movie.toBlob(blob=>{
     if(blob){save(blob,'江汉皮影-光影作品.png');status('已生成作品图片');}
     else status('图片暂时无法生成，请重试。');
    });
    else send('stage-link',{target:value});
   } else {
    engine.stageAction(id,value);
    if(id==='actor')send('cast',{glyph:value==='mine'?engine.describe().glyph:value});
    if(activePanel)menu();
   }
   refresh();
  }
  const open=()=>menu('links');

  let dialPointer=null;
  function turnDial(event) {
   const r=$('.theatre-dial-art',dial).getBoundingClientRect();
   const x=event.clientX-r.left-r.width/2,y=Math.max(0,r.top+r.height/2-event.clientY);
   if(Math.hypot(x,y)<6)return;
   const angle=Math.round((90-Math.atan2(y,x)*180/Math.PI)*(Number(range.max)/90));
   range.value=angle;
   engine.stageAction('angle',angle);
  }
  dial.addEventListener('pointerdown',e=>{
   if(e.button!==0||!e.isPrimary||range.disabled)return;
   e.preventDefault();range.focus({preventScroll:true});
   dialPointer=e.pointerId;dial.setPointerCapture(e.pointerId);
   engine.stageAction('hold');turnDial(e);
  });
  dial.addEventListener('pointermove',e=>{if(e.pointerId===dialPointer)turnDial(e);});
  for(const evt of ['pointerup','pointercancel','lostpointercapture'])dial.addEventListener(evt,e=>{
   if(e.pointerId!==dialPointer)return;
   dialPointer=null;engine.stageAction('release');
  });
  range.addEventListener('keydown',e=>{if(!e.repeat&&/^(Arrow|Home|End|Page)/.test(e.key))engine.stageAction('hold');});
  range.addEventListener('input',()=>engine.stageAction('angle',range.value));
  range.addEventListener('keyup',e=>{if(/^(Arrow|Home|End|Page)/.test(e.key))engine.stageAction('release');});
  range.addEventListener('blur',()=>engine.stageAction('release'));

  function dismiss(event) {
   if(activePanel&&!panel.contains(event.target)&&!menuButtons.some(button=>button.contains(event.target))) menu();
  }
  function escape(event) {
   if(event.key==='Escape'&&activePanel){
    event.preventDefault();
    const trigger=menuButtons.find(button=>button.getAttribute('aria-expanded')==='true');
    menu();trigger?.focus();
   }
  }
  more.addEventListener('click',open);
  editor.addEventListener('click',click);
  editor.addEventListener('pointerdown',dismiss);
  document.addEventListener('keydown',escape);
  document.addEventListener('mobile-stage-change',queueRefresh);
  engine.stageAction('setup');
  const lens=cameraMode?window.ShadowMobileCamera.mount({engine,workspace,canvas,controls}):null;
  function visibility(event) {
   if(event.source!==parent || (location.protocol!=='file:'&&event.origin!==location.origin))return;
   if(event.data?.app!=='jianghan-mobile'||event.data.type!=='stage-visibility')return;
   visible=event.data.visible===true;
   if(!visible) {
    lens?.stop();
    if(engine.stageRead().playing)engine.stageAction('play');
    if(recorder?.state==='recording')recorder.stop();
    audio.pause();
   }
   refresh();
  }
  window.addEventListener('message',visibility);
  const tick=setInterval(()=>{if(visible)refresh();},240);refresh();
  return {destroy(){lens?.destroy();clearInterval(tick);clearTimeout(timer);if(recorder?.state==='recording')recorder.stop();audio.pause();context?.close().catch(()=>{});
   window.removeEventListener('message',visibility);more.removeEventListener('click',open);editor.removeEventListener('click',click);
   editor.removeEventListener('pointerdown',dismiss);document.removeEventListener('keydown',escape);document.removeEventListener('mobile-stage-change',queueRefresh);
   cancelAnimationFrame(refreshFrame);cancelAnimationFrame(painting);editor.classList.remove('is-result');
   backdrop.remove();overlay.remove();controls.remove();actions.remove();panel.remove();}};
 }
 window.ShadowMobileTheatre={mount};
})();
