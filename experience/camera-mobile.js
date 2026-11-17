(() => {
  const $ = (selector,root=document) => root.querySelector(selector);
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  const cameraSources = new URL('摄像头操偶-识别资源.js',location.href).href;
  let assetTask;

  function loadAssets() {
    if (window.__HAND_LOCAL_ASSETS__) return Promise.resolve(window.__HAND_LOCAL_ASSETS__);
    if (!assetTask) {
      const load = new Promise((resolve,reject)=>{
        const script = document.createElement('script');
        script.src = cameraSources;
        script.onload = () => window.__HAND_LOCAL_ASSETS__
          ? resolve(window.__HAND_LOCAL_ASSETS__) : reject(new Error('手部识别资源不完整'));
        script.onerror = () => reject(new Error('手部识别资源未能加载'));
        document.head.append(script);
      });
      assetTask=load.catch(error=>{assetTask=null;throw error;});
    }
    return assetTask;
  }

  function pinchTracker() {
    let serial=0, tracks=[];
    return {
      clear(){tracks=[];},
      read(result,now) {
        const aspect=(result.width||4)/(result.height||3);
        const distance=(a,b)=>Math.hypot((a.x-b.x)*aspect,a.y-b.y);
        const samples=(result.landmarks||[]).flatMap((points,i)=>{
          const wrist=points[0],thumb=points[4],finger=points[8],palm=points[9];
          if(!wrist||!thumb||!finger||!palm)return [];
          const x=1-(thumb.x+finger.x)*.5,y=(thumb.y+finger.y)*.5;
          return [{
            wrist,label:result.handedness?.[i]?.[0]?.categoryName,
            pinch:distance(thumb,finger)/Math.max(.025,distance(wrist,palm)),
            at:[clamp((x-.08)/.84,0,1),clamp((y-.065)/.87,0,1)]
          }];
        });
        tracks=tracks.filter(t=>now-t.seen<210);
        const pairs=tracks.flatMap(track=>samples.map(sample=>({
          track,sample, cost:distance(track.wrist,sample.wrist)+
            (track.label&&sample.label ? (track.label===sample.label ? -.095 : .16) : 0)
        }))).sort((a,b)=>a.cost-b.cost);
        const used=new Set(), matches=new Map();
        for(const {track,sample,cost} of pairs){
          if(cost>.49||used.has(track)||matches.has(sample))continue;
          used.add(track);matches.set(sample,track);
        }
        for(const sample of samples){
          let track=matches.get(sample);
          if(!track){
            if(tracks.length>=2)continue;
            track={key:'lens-'+(++serial),at:sample.at,pressed:false,closing:0};
            tracks.push(track);
          }
          track.wrist=sample.wrist;
          track.label=sample.label||track.label;
          track.seen=now;
          const motion=distance({x:track.at[0],y:track.at[1]},{x:sample.at[0],y:sample.at[1]});
          const ease=clamp(.47+motion*5.4,.47,.96);
          track.at=track.at.map((v,i)=>v+(sample.at[i]-v)*ease);
          if(sample.pinch<.34){
            track.closing++;
            if(sample.pinch<.23||track.closing>=2)track.pressed=true;
          } else {
            track.closing=0;
            if(sample.pinch>.52)track.pressed=false;
          }
        }
        return tracks;
      }
    };
  }

  function mount({engine,workspace,canvas,controls}) {
    const U=window.ShadowCraftUI, panel=document.createElement('section');
    panel.className='camera-control-panel';panel.dataset.cameraState='off';
    panel.innerHTML='<div class="camera-intro"><div><h2>双手牵杆</h2><p>拇指与食指捏合握杆，快速甩手能带动身片和衣摆。</p></div>'+
      '<div class="camera-monitor" hidden><video muted autoplay playsinline aria-label="手势取景"></video></div></div>'+
      '<div class="camera-grip-status" aria-label="当前握杆情况"><span>左杆 <small>待握</small></span><span>右杆 <small>待握</small></span><button type="button" class="camera-reset" data-room="reset">'+U.icon('reset')+'重置位置</button></div>'+
      '<div class="camera-actions"><button type="button" class="craft-outline camera-touch-return" data-room="touch-return">'+U.icon('back')+'触屏操控</button>'+
      '<button type="button" id="camera-start" class="craft-primary">'+U.icon('camera')+'<span>开启镜头</span></button></div>'+
      '<p class="camera-feedback" role="status">手势在本机识别。也可直接用手指拖杆。</p>';
    workspace.insertBefore(panel,controls);
    const cues=document.createElement('div');cues.className='camera-fingers';
    cues.setAttribute('aria-hidden','true');
    cues.innerHTML='<i hidden></i><i hidden></i>';
    canvas.parentElement.append(cues);
    const dots=[...cues.children],badges=[...panel.querySelectorAll('.camera-grip-status span')];
    function showGrips(slots) {
      badges.forEach((badge,i)=>{
        const held=slots.has(i),word=$('small',badge);
        badge.classList.toggle('held',held);
        const copy=held?'握住':'待握';
        if(word.textContent!==copy) word.textContent=copy;
      });
    }
    const video=$('video',panel), monitor=$('.camera-monitor',panel), trigger=$('#camera-start',panel);
    const readout=$('.camera-feedback',panel), tracker=pinchTracker(), grips=new Map();
    let stream,worker,workerURL,token=0,timer,raf=0,inFlight=false,lastFrame=-1,lastTime=0,destroyed=false;
    let status='off';

    function display(next,copy) {
      if(status!==next){
        status=next;panel.dataset.cameraState=next;
        trigger.disabled=next==='requesting';
        $('span',trigger).textContent=['loading','running'].includes(next)?'关闭镜头':next==='requesting'?'等待镜头权限':'开启镜头';
      }
      if(readout.textContent!==copy)readout.textContent=copy;
    }

    function clearGrips() {
      for(const key of grips.keys())engine.rods.drop(key);
      grips.clear();tracker.clear();panel.dataset.hands="0";
      dots.forEach(dot=>dot.hidden=true);
      showGrips(new Set());
    }

    function stop(copy='镜头已关闭。你仍可以直接拖杆。',next='off') {
      token++;clearTimeout(timer);cancelAnimationFrame(raf);inFlight=false;lastFrame=-1;
      if(worker)worker.terminate();
      if(workerURL)URL.revokeObjectURL(workerURL);
      worker=null;workerURL=null;
      stream?.getTracks().forEach(track=>track.stop());
      stream=null;
      video.pause();video.srcObject=null;monitor.hidden=true;
      clearGrips();
      display(next,copy);
    }

    function consume(result) {
      const tracks=tracker.read(result,performance.now());
      const pressed=new Set(tracks.filter(hand=>hand.pressed).map(hand=>hand.key));
      for(const key of grips.keys()){
        if(!pressed.has(key)||!engine.rods.holding(key)){engine.rods.drop(key);grips.delete(key);}
      }
      const {width,height}=engine.stageRead(),updates=[];
      tracks.forEach(hand=>{
        const at=[hand.at[0]*width,hand.at[1]*height];
        if(hand.pressed){
          if(!grips.has(hand.key)){
            const slot=engine.rods.grab(hand.key,at);
            if(slot!==null)grips.set(hand.key,slot);
          }
          if(grips.has(hand.key))updates.push({key:hand.key,at});
        }
      });
      engine.rods.pull(updates);
      dots.forEach((dot,i)=>{
        const hand=tracks[i];
        dot.hidden=!hand||grips.has(hand.key);
        if(hand){dot.style.left=100*hand.at[0]+'%';dot.style.top=100*hand.at[1]+'%';}
      });
      showGrips(new Set(grips.values()));
      panel.dataset.hands=String(tracks.length);
      display('running',grips.size===2?'两杆已握住。一起平移，或错开双手带影偶转身。':
        grips.size===1?'已握住一根杆。抬手或平移，带影偶走。':
        tracks.length?'将拇指和食指捏在一起。':'把手放进右侧取景框。');
    }

    function infer(now) {
      raf=0;
      if(status!=='running'||!worker||document.hidden)return;
      if(inFlight&&now-lastTime>5000){stop('手部识别没有响应，请重新开启镜头。','error');return;}
      if(!inFlight&&video.readyState>=2&&lastFrame!==video.currentTime&&now-lastTime>=32){
        inFlight=true;lastTime=now;lastFrame=video.currentTime;
        const current=token,target=worker;
        createImageBitmap(video,{resizeWidth:448,resizeHeight:Math.max(1,Math.round(448*video.videoHeight/video.videoWidth))}).then(image=>{
          if(current!==token||target!==worker){image.close();return;}
          target.postMessage({type:'frame',image,timestamp:performance.now(),width:image.width,height:image.height},[image]);
        }).catch(()=>{if(current===token)inFlight=false;});
      }
      raf=requestAnimationFrame(infer);
    }

    async function start() {
      if(status==='loading'||status==='running'){stop();return;}
      if(status==='requesting'||destroyed)return;
      if(!isSecureContext||!navigator.mediaDevices?.getUserMedia){
        display('error','手机需用 HTTPS 打开才能开启镜头。现在也可以直接在灯幕上拖杆。');return;
      }
      const current=++token;
      display('requesting','请在浏览器提示里允许使用摄像头。');
      try{
        const acquired=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:30,max:30}},audio:false});
        if(current!==token||destroyed){acquired.getTracks().forEach(track=>track.stop());return;}
        stream=acquired;
        stream.getVideoTracks()[0]?.addEventListener('ended',()=>{
          if(current===token)stop('镜头连接中断。可重新开启或继续触屏牵杆。','error');
        });
        video.srcObject=stream;monitor.hidden=false;
        display('loading','正在准备本机手部识别…');
        await video.play();
        const assets=await loadAssets();
        if(current!==token||destroyed)return;
        workerURL=URL.createObjectURL(new Blob([assets.worker],{type:'text/javascript'}));
        worker=new Worker(workerURL);
        timer=setTimeout(()=>{if(current===token)stop('识别准备超时，请重新开启镜头。','error');},25000);
        worker.onerror=()=>{if(current===token)stop('本机识别暂时中断，请重新开启镜头。','error');};
        worker.onmessage=event=>{
          if(current!==token)return;
          const message=event.data;
          if(message.type==='ready'){
            clearTimeout(timer);display('running','把两只手放进右侧取景框。');
            raf=requestAnimationFrame(infer);
          } else if(message.type==='result'){
            inFlight=false;consume(message);
          } else if(message.type==='error'){
            stop(message.message&&/[㐀-鿿]/.test(message.message)?message.message:'本机手部识别暂不可用，可继续触屏牵杆。','error');
          }
        };
        worker.postMessage({type:'init',assets});
      }catch(error){
        if(current!==token||destroyed)return;
        const copy={NotAllowedError:'镜头权限未打开。可在浏览器允许后重试。',NotFoundError:'没有找到摄像头。你可以直接用手指牵杆。',
          NotReadableError:'摄像头暂时无法打开，可关闭其他占用镜头的应用后重试。'};
        stop(copy[error.name]||'镜头暂时没能开启。可重试或使用触屏牵杆。','error');
      }
    }

    const onHidden=()=>{if(document.hidden&&status!=='off')stop('已关闭镜头。回来后可重新开启。');};
    const onLeave=()=>stop();
    trigger.addEventListener('click',start);
    document.addEventListener('visibilitychange',onHidden);
    window.addEventListener('pagehide',onLeave);
    return {stop,destroy(){
      destroyed=true;stop();trigger.removeEventListener('click',start);
      document.removeEventListener('visibilitychange',onHidden);window.removeEventListener('pagehide',onLeave);
      panel.remove();cues.remove();
    }};
  }
  window.ShadowMobileCamera={mount};
})();
