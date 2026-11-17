(() => {
  'use strict';
  const key = 'jh-mobile-personal-v1';
  const avatars = [['pi','皮'],['ying','影'],['xi','戏']];
  const defaultName = '江汉观众';
  const escape = value => String(value).replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
  const validAvatar = value => avatars.some(([id])=>id===value);

  function mount({app, read, write, notify, icon, asset, goButton, detail, drafts, bagCount, lastStage, refresh, back}) {
    const nickname = value => typeof value==='string'?Array.from(value.trim()).slice(0,14).join(''):'';
    const routes = (values,limit) => Array.isArray(values)?[...new Set(values.filter(value=>typeof value==='string'&&detail(value)))].slice(0,limit):[];
    function storedProfile() {
      const stored=read(key,{});
      return {name:nickname(stored.name),avatar:validAvatar(stored.avatar)?stored.avatar:'pi',
        favorites:routes(stored.favorites,80),recent:routes(stored.recent,16),
        remember:stored.remember!==false,lessMotion:stored.lessMotion===true};
    }
    const state=storedProfile();
    const avatar = (id, classes='') => '<span class="profile-avatar '+classes+'"><img src="'+asset(id+'.webp')+'" alt=""></span>';
    const name = () => escape(state.name||defaultName);
    const save = (changes,copy='') => {
      Object.assign(state,changes);
      const saved=write(key,{...storedProfile(),...changes});
      if (copy) notify(saved?copy:'本次更改未能保存到设备');
    };

    function track(route) {
      const card=detail(route);
      if (!state.remember||!card) return;
      const recent=[route,...state.recent.filter(path=>detail(path)?.key!==card.key)].slice(0,16);
      if (recent.join('|')!==state.recent.join('|')) save({recent});
    }

    function favoriteButton(route, compact=false) {
      const added=state.favorites.includes(route);
      const label=added?'已收藏':'收藏';
      return '<button type="button" class="profile-favorite'+(compact?' is-compact':'')+'" data-favorite="'+route+'" aria-pressed="'+added+
        '" aria-label="'+(added?'取消收藏':'收藏内容')+'">'+icon('heart')+(compact?'':'<span>'+label+'</span>')+'</button>';
    }

    function refreshFavorite(button, route) {
      const saved=state.favorites.includes(route);
      button.dataset.favorite=route;
      button.setAttribute('aria-pressed',String(saved));
      button.setAttribute('aria-label',saved?'取消收藏':'收藏内容');
      const label=button.querySelector('span');
      if(label) label.textContent=saved?'已收藏':'收藏';
    }

    function stat(target,symbol,title,count) {
      return goButton(target,icon(symbol)+'<strong>'+count+'</strong><span>'+title+'</span>','profile-stat');
    }

    function utility(target,symbol,title,value='') {
      return goButton(target,'<span class="profile-tool-icon">'+icon(symbol)+'</span><span>'+title+'</span>'+
        (value?'<small>'+value+'</small>':'')+'<span class="profile-tool-next">'+icon('next')+'</span>','profile-tool');
    }

    function overview() {
      const saved=drafts(),ongoing=saved.find(item=>!item.complete);
      const next=ongoing||saved[0];
      const destination=next?.route||'make';
      const thumb=next?.image||asset('blank-xi.webp');
      const title=next?.title||'亲手做一件皮影';
      const note=next?(next.complete?'已完成 · 进入作品戏台':'继续制作 · '+next.step):'从选皮开始，做完就能牵杆上台';
      const count=bagCount(),actor=lastStage();
      return '<div class="personal-page">'+
        '<section class="profile-card"><div class="profile-identity">'+avatar(state.avatar)+
        '<div class="profile-name"><h1>'+name()+'</h1><p>本机资料</p></div>'+
        goButton('case/edit',icon('edit')+'<span>编辑资料</span>','profile-edit')+'</div>'+
        '<div class="profile-stats" aria-label="个人收藏和创作">'+
        stat('case/works','knife','我的作品',saved.length)+stat('case/favorites','heart','我的收藏',state.favorites.length)+
        stat('case/recent','history','最近浏览',state.recent.length)+'</div></section>'+
        '<section class="profile-resume" aria-label="继续体验">'+goButton(destination,
        '<img src="'+thumb+'" alt=""><span><strong>'+title+'</strong><small>'+note+'</small></span>'+icon('next'),'profile-resume-link')+'</section>'+
        '<section class="profile-tools" aria-label="常用功能">'+
        utility('shop/bag','bag','购物袋',count?count+' 件':'')+
        (actor?utility('play/solo/'+actor.id,'curtain','继续上次戏台',actor.label+'字'):'')+
        utility('case/settings','settings','体验设置')+
        utility('case/help','book','使用帮助')+'</section></div>';
    }

    function edit() {
      return '<div class="personal-page"><form class="profile-form profile-surface" id="profile-edit">'+
        '<label for="profile-nickname">昵称</label><input id="profile-nickname" name="nickname" type="text" autocomplete="nickname" maxlength="28" placeholder="'+defaultName+'" value="'+
        escape(state.name)+'" aria-describedby="profile-name-note"><small id="profile-name-note">最多 14 个字</small>'+
        '<fieldset class="profile-avatars"><legend>头像</legend><div>'+avatars.map(([id,label])=>
          '<label><input type="radio" name="avatar" value="'+id+'"'+(state.avatar===id?' checked':'')+'>'+
          avatar(id)+'<span>'+label+'</span></label>').join('')+
        '</div></fieldset><button class="primary-button profile-save" type="submit">保存资料</button></form></div>';
    }

    function item(route, removable) {
      const card=detail(route);
      return '<li class="profile-content-item">'+goButton(route,
        '<img src="'+card.image+'" alt="" loading="lazy"><span><strong>'+card.title+'</strong><small>'+card.note+'</small></span>'+icon('next'),'profile-content-link')+
        (removable?'<button type="button" class="profile-remove" data-favorite="'+route+'" aria-pressed="true" aria-label="取消收藏 '+escape(card.title)+'">'+icon('heart')+'</button>':'')+'</li>';
    }

    function list(kind) {
      const favorite=kind==='favorites',items=favorite?state.favorites:state.recent;
      const symbol=favorite?'heart':'history';
      const empty=favorite?'还没有收藏':'还没有浏览记录';
      const hint=favorite?'看海报、影片或文创时，点收藏就能在这里找到。':
        (state.remember?'看过的海报、影片和文创会出现在这里。':'浏览记录已关闭，可以在设置中重新开启。');
      return '<div class="personal-page personal-detail">'+(items.length?
        '<div class="profile-list-head"><span>'+items.length+' 条</span>'+
        (favorite?'':'<button type="button" class="text-button" data-profile-clear>清空记录</button>')+'</div>'+
        '<ul class="profile-content-list">'+items.map(route=>item(route,favorite)).join('')+'</ul>':
        '<section class="profile-empty profile-surface">'+icon(symbol)+'<h1>'+empty+'</h1><p>'+hint+'</p>'+
        goButton(!favorite&&!state.remember?'case/settings':'stage/gallery',!favorite&&!state.remember?'打开设置':'去看海报与影像 '+icon('next'),'outline-button')+'</section>')+
        (!favorite&&items.length?'<dialog class="profile-confirm" aria-labelledby="clear-title"><h2 id="clear-title">清空浏览记录？</h2>'+
        '<p>将删除当前设备上的全部浏览记录。</p><div><button type="button" class="outline-button" data-profile-cancel>取消</button>'+
        '<button type="button" class="primary-button" data-profile-confirm>清空记录</button></div></dialog>':'')+'</div>';
    }

    function switchRow(key,title,note) {
      return '<label class="profile-setting"><span><strong>'+title+'</strong><small>'+note+'</small></span>'+
        '<input type="checkbox" data-profile-setting="'+key+'" '+(state[key]?'checked':'')+'><span class="profile-switch" aria-hidden="true"></span></label>';
    }

    function settings() {
      return '<div class="personal-page personal-detail"><section class="profile-surface profile-settings" aria-label="体验偏好">'+
        switchRow('lessMotion','简化界面动效','减少页面切换和按钮动效')+
        switchRow('remember','记住浏览记录','关闭后停止添加新的记录')+'</section>'+
        '<section class="profile-tools" aria-label="记录管理">'+utility('case/recent','history','管理浏览记录',state.recent.length+' 条')+
        utility('case/edit','profile','编辑个人资料')+'</section>'+
        '<p class="profile-data-note">昵称、头像、收藏、记录和制作进度保存在当前设备的浏览器里。</p></div>';
    }

    function help() {
      return '<div class="personal-page personal-detail"><section class="profile-tools profile-help">'+
        '<details open><summary>从哪里开始或继续制作？</summary><p>点底栏的「亲手制作」即可开始。做到一半，可以在制作首页继续，也可以在「我的作品」选择之前的字影。</p>'+
        goButton('case/works','打开我的作品 '+icon('next'),'text-button')+'</details>'+
        '<details><summary>如何用镜头牵杆？</summary><p>在戏台里点「镜头操纵」，允许摄像头权限。用拇指和食指捏合握杆，张开即松手。手机浏览器需要通过 HTTPS 打开镜头。</p>'+
        goButton('play','进入戏台 '+icon('next'),'text-button')+'</details>'+
        '<details><summary>收藏和浏览记录有什么用？</summary><p>在海报、影片或文创详情里点心形按钮，可以在「我的收藏」重新打开。浏览记录保存最近打开的内容，可以清空或关闭。</p></details>'+
        '<details><summary>怎样恢复以前的作品？</summary><p>在「我的作品」点「导入制作稿」，选择之前导出的制作稿文件。在戏台菜单中可以导出制作稿。</p>'+
        goButton('make/import','导入制作稿 '+icon('next'),'text-button')+'</details>'+
        '<details><summary>购物袋可以下单吗？</summary><p>可以把喜欢的款式加入购物袋。文创目前用于设计展示。</p></details>'+
        '</section></div>';
    }

    function action(button, page) {
      const target=button.dataset.favorite;
      if (target&&detail(target)) {
        const had=state.favorites.includes(target);
        const favorites=had?state.favorites.filter(route=>route!==target):[target,...state.favorites];
        save({favorites},had?'已取消收藏':'已加入我的收藏');
        if (page==='case/favorites') {
          refresh();
          app.querySelector('.profile-content-list button,.profile-empty button')?.focus({preventScroll:true});
        } else {
          app.querySelectorAll('[data-favorite]').forEach(node=>{
            if(node.dataset.favorite===target) refreshFavorite(node,target);
          });
        }
        return true;
      }
      if (button.hasAttribute('data-profile-clear')) {
        app.querySelector('.profile-confirm')?.showModal();
        return true;
      }
      if (button.hasAttribute('data-profile-cancel')) {
        button.closest('dialog')?.close();
        return true;
      }
      if (button.hasAttribute('data-profile-confirm')) {
        button.closest('dialog')?.close();
        save({recent:[]},'已清空浏览记录');
        refresh();
        app.querySelector('.profile-empty button')?.focus({preventScroll:true});
        return true;
      }
      return false;
    }

    function applyMotion() {
      app.classList.toggle('reduce-interface-motion',state.lessMotion);
    }
    applyMotion();
    window.addEventListener('storage',event=>{
      if(event.key===key||event.key===null){
        Object.assign(state,storedProfile());
        applyMotion();
      }
    });
    app.addEventListener('change',event=>{
      const setting=event.target.dataset.profileSetting;
      if (!['remember','lessMotion'].includes(setting)) return;
      save({[setting]:event.target.checked},'设置已更新');
      applyMotion();
    });
    app.addEventListener('submit',event=>{
      if (event.target.id!=='profile-edit') return;
      event.preventDefault();
      const form=new FormData(event.target);
      const selected=form.get('avatar');
      save({name:nickname(form.get('nickname')),avatar:validAvatar(selected)?selected:state.avatar},'个人资料已保存');
      back();
    });

    return {
      overview,edit,settings,help,list,action,track,favoriteButton,refreshFavorite,
      lessMotion:()=>state.lessMotion
    };
  }

  window.ShadowPersonal={mount};
})();
