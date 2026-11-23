'use strict';
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names={wudu:'Wudu',aqieda:'ʿAqieda',vragen:'Vraag en antwoord',installeren:'Installeer de app'};
const colors=['linear-gradient(140deg,#fff0a3,#ffdb7a)','linear-gradient(140deg,#cbf5df,#a9e4cb)','linear-gradient(140deg,#ffe0c6,#ffc79f)','linear-gradient(140deg,#e6d8fa,#d3baf0)','linear-gradient(140deg,#d3efff,#aedcf3)'];
const book='<svg viewBox="0 0 32 32" aria-hidden="true"><path fill-rule="evenodd" d="M3 5Q9 2 15 6Q21 2 27 5V25Q21 22 15 26Q9 22 3 25ZM14 7V23H16V7Z"/></svg>';
const play='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 4q-2-1-2 2v20q0 3 3 1l20-10q2-1 0-3Z" fill="currentColor"/></svg>';
const pause='<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="4" width="7" height="24" rx="2" fill="currentColor"/><rect x="19" y="4" width="7" height="24" rx="2" fill="currentColor"/></svg>';
let token=0,openTopics=new Set(),stopAudio=()=>{},showPhon=false;
const href=(cat,id)=>'#'+cat+(id?'/'+encodeURIComponent(id):'');
function hero(title,subtitle,back='/',label='Home'){return `<section class="hero"><a class="back" href="${esc(back)}">← ${esc(label)}</a><h1 tabindex="-1" id="page-title">${esc(title)}</h1>${subtitle?`<p>${esc(subtitle)}</p>`:''}</section>`}
function source(d){return d.source?`<details class="source"><summary>Bron en toelichting</summary><p>${esc(d.source)}</p></details>`:''}
function audioControls(u,wudu=false,prev='',next=''){
 const available=!!Cloud.mediaURL(u.audio);
 return `<div class="${wudu?'prayer-controls':'controls answer-controls'}">${wudu?`<button id="prev" ${prev?'':'disabled'}>← Vorige</button>`:''}<button id="play" class="${wudu?'prayer-play':'play'}" aria-label="Afspelen" ${available?'':'disabled'}>${play}</button><button id="repeat" class="repeat" aria-pressed="false" ${available?'':'disabled'}>⟳ Repeat uit</button>${wudu?`<button id="next" ${next?'':'disabled'}>Volgende →</button>`:''}</div><p id="audio-status" class="demo-status" role="status">${available?'Druk op play om te luisteren.':'Voor deze stap of dit antwoord is nog geen audio toegevoegd.'}</p>`;
}
function bindAudio(u,seq){
 const src=Cloud.mediaURL(u.audio);if(!src)return;
 const a=new Audio(src),b=$('#play'),repeat=$('#repeat'),status=$('#audio-status');a.preload='metadata';
 const sync=()=>{b.innerHTML=a.paused?play:pause;b.setAttribute('aria-label',a.paused?'Afspelen':'Pauzeren')};
 const failed=()=>{if(seq!==token)return;a.pause();sync();status.textContent='De audio kon niet worden afgespeeld. Probeer opnieuw.'};
 b.onclick=async()=>{if(!a.paused){a.pause();sync();return}try{await a.play();if(seq!==token){a.pause();return}sync();status.textContent='Luister mee.'}catch{failed()}};
 repeat.onclick=()=>{a.loop=!a.loop;repeat.setAttribute('aria-pressed',String(a.loop));repeat.textContent='⟳ Repeat '+(a.loop?'aan':'uit')};
 a.onended=()=>{sync();status.textContent='De opname is klaar.'};a.onerror=failed;
 const hide=()=>{if(document.hidden){a.pause();sync()}};document.addEventListener('visibilitychange',hide);
 stopAudio=()=>{document.removeEventListener('visibilitychange',hide);a.onended=null;a.onerror=null;a.pause();a.removeAttribute('src');a.load()};
}
function learningText(u){return `${u.ar?`<p class="lesson-arabic" lang="ar" dir="rtl">${esc(u.ar)}</p>`:''}${u.phon?`<p class="lesson-phonetic">${esc(u.phon)}</p>`:''}${u.nl?`<p class="lesson-dutch">${esc(u.nl)}</p>`:''}`}
function videoMarkup(d){const id=NewContent.youtubeID(d.videoUrl);return id?`<div class="video-stage" id="video"><button class="play" id="video-play" data-video="${id}" aria-label="Video afspelen">${play}</button><p>Bekijk de video</p></div><p class="video-fallback">Werkt de video niet? <a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">Open op YouTube ↗</a></p>`:'<div class="video-stage empty-video"><p>Er is nog geen video toegevoegd.</p></div>'}
function pager(cat,siblings,index,allLabel){return `<nav class="lesson-controls" aria-label="Onderdelen">${index>0?`<a class="soft" href="${href(cat,siblings[index-1].id)}">← Vorige</a>`:'<span></span>'}<a class="soft" href="${href(cat)}">${allLabel}</a>${index<siblings.length-1?`<a class="soft gold" href="${href(cat,siblings[index+1].id)}">Volgende →</a>`:'<span></span>'}</nav>`}
function wuduMarkup(items,n){const d=items[n],u=d.units?.[0]||{},img=Cloud.mediaURL(d.image)||Cloud.safeURL(d.imageUrl);
 return hero('Wudu','Stap voor stap de wassing leren')+`<div class="stepbar"><span id="step-count">Stap ${n+1} / ${items.length}</span><button id="overview" aria-expanded="false" aria-controls="step-list">Alle stappen ▾</button><span>De wassing voor het gebed</span></div><div id="step-list" hidden>${items.map((x,i)=>`<button data-step="${i}" aria-current="${i===n?'step':'false'}">${i+1}. ${esc(x.title)}</button>`).join('')}</div><section class="prayer-card" aria-label="Wudu-stap"><div class="card-heading"><span class="badge">De wassing</span><h2>${esc(d.title)}</h2></div><figure>${img?`<img class="wudu-image" src="${esc(img)}" alt="${esc(d.alt||d.title)}">`:'<div class="image-empty">Nog geen afbeelding toegevoegd.</div>'}</figure><div class="reading"><p class="step-instruction">${esc(u.text||d.instruction||'')}</p>${u.ar?`<p class="arabic" lang="ar" dir="rtl">${esc(u.ar)}</p>`:''}${u.nl?`<p class="meaning">${esc(u.nl)}</p>`:''}${u.phon?`<button id="phon-toggle" class="phon-toggle" aria-expanded="${showPhon}" aria-controls="phon">◉ Fonetisch ${showPhon?'verbergen':'tonen'}</button><p id="phon" class="phonetic" ${showPhon?'':'hidden'}>${esc(u.phon)}</p>`:''}</div><img class="corner left" src="/assets/reading-sprig.png" alt=""><img class="corner right" src="/assets/reading-sprig.png" alt=""></section>`+audioControls(u,true,n>0?items[n-1].id:'',n<items.length-1?items[n+1].id:'')+`<p class="control-explanation">Vorige en volgende wudu-stap</p>`+source(d)+(n===items.length-1?'<div class="finish"><strong>Alhamdoelillah, je hebt alle wudu-stappen bekeken.</strong><a href="#wudu">Opnieuw oefenen</a><a href="/">Naar Home</a></div>':'');
}
async function render(){const seq=++token,y0=window.scrollY;stopAudio();stopAudio=()=>{};let [cat,raw]=location.hash.slice(1).split('/');if(!names[cat])cat='vragen';let id='';try{id=decodeURIComponent(raw||'')}catch{}
 document.body.dataset.category=cat;document.title=names[cat]+' · Al Himmah Kids';$('#main').innerHTML=hero(names[cat],'')+'<p role="status">Even laden…</p>';
 try{const data=await Cloud.listPublic(cat);if(seq!==token)return;const items=data.filter(x=>x.visible===true&&x.definitive===true);if(!items.length){$('#main').innerHTML=hero(names[cat],'')+'<section class="empty-panel"><h2>Binnenkort meer om te ontdekken</h2><p>Hier verschijnen de onderdelen zodra ze zijn gepubliceerd.</p></section>';return}
 let html='',active=null;
 if(cat==='wudu'){
 const n=id?items.findIndex(x=>String(x.id)===id):0;if(n<0)throw new Error('unavailable');active=items[n];html=wuduMarkup(items,n);$('#main').innerHTML=html;
 $('#prev').onclick=()=>{if(n>0)location.hash=href(cat,items[n-1].id)};$('#next').onclick=()=>{if(n<items.length-1)location.hash=href(cat,items[n+1].id)};
 $('#overview').onclick=()=>{const show=$('#step-list').hidden;$('#step-list').hidden=!show;$('#overview').setAttribute('aria-expanded',String(show))};
 document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{const i=+b.dataset.step;if(i===n){$('#step-list').hidden=true;$('#overview').setAttribute('aria-expanded','false')}else location.hash=href(cat,items[i].id)});
 if($('#phon-toggle'))$('#phon-toggle').onclick=()=>{showPhon=!showPhon;$('#phon').hidden=!showPhon;$('#phon-toggle').setAttribute('aria-expanded',String(showPhon));$('#phon-toggle').textContent='◉ Fonetisch '+(showPhon?'verbergen':'tonen')};
 }else if(!id){
 html=hero(names[cat],cat==='aqieda'?'Kijk en leer mee':cat==='vragen'?'Lees en luister mee':'Kies je telefoon of tablet');
 if(cat==='aqieda')html+=`<section class="grid">${items.map(d=>`<a class="choice" href="${href(cat,d.id)}"><span class="symbol">${book}</span><span>${esc(d.title)}</span><span class="chevron">›</span></a>`).join('')}</section>`;
 else{const groups=cat==='installeren'?['Apple','Android'].map(title=>({title,items:items.filter(d=>d.topic===title)})):NewContent.groups(items);
 html+=`<section class="grid topic-grid">${groups.map((g,i)=>`<details class="topic" data-topic="${esc(g.title)}" ${openTopics.has(cat+'/'+g.title)?'open':''} style="--tile:${colors[i%colors.length]}"><summary class="choice"><span class="symbol" aria-hidden="true">${cat==='vragen'?'?':'↓'}</span><span>${esc(g.title)}${cat==='installeren'?`<small>${g.title==='Apple'?'iPhone en iPad':'Telefoon en tablet'}</small>`:''}</span><span class="chevron" aria-hidden="true">›</span></summary><div class="question-list">${g.items.length?g.items.map(d=>`<a class="question-link" href="${href(cat,d.id)}"><span>${esc(d.title)}</span><span aria-hidden="true">›</span></a>`).join(''):'<p>Er zijn nog geen instructievideo’s gepubliceerd.</p>'}</div></details>`).join('')}</section>`}
 $('#main').innerHTML=html;document.querySelectorAll('[data-topic]').forEach(d=>d.ontoggle=()=>{const k=cat+'/'+d.dataset.topic;d.open?openTopics.add(k):openTopics.delete(k)});
 }else{
 const d=items.find(x=>String(x.id)===id);if(!d)throw new Error('unavailable');active=d;const u=d.units?.[0]||{};const topic=d.topic||'Overige vragen';if(cat==='vragen'||cat==='installeren')openTopics.add(cat+'/'+topic);
 html=hero(cat==='installeren'?topic+' · '+d.title:d.title,cat==='vragen'?topic:names[cat],href(cat),cat==='vragen'?'Alle vragen':cat==='installeren'?'Browser kiezen':'Alle lessen');
 html+=cat==='vragen'?`<article class="answer-panel">${learningText(u)}<div class="answer-text">${esc(u.text||'')}</div><div class="answer-audio"><p>Luister naar het antwoord</p>${audioControls(u)}</div></article>`:`<section class="video-panel">${cat==='aqieda'&&!d.videoUrl&&(u.ar||u.nl||u.text)?'':videoMarkup(d)}${learningText(u)}${u.text?`<p class="video-text">${esc(u.text)}</p>`:''}</section>`;
 const siblings=cat==='aqieda'?items:items.filter(x=>(x.topic||'Overige vragen')===topic);html+=pager(cat,siblings,siblings.indexOf(d),cat==='vragen'?'Alle vragen':cat==='installeren'?'Apple of Android kiezen':'Alle lessen')+source(d);$('#main').innerHTML=html;
 }
 if(active&&['vragen','wudu'].includes(cat))bindAudio(active.units?.[0]||{},seq);
 if($('#video-play'))$('#video-play').onclick=()=>{const id=$('#video-play').dataset.video;$('#video').innerHTML=`<iframe title="YouTube-instructievideo" src="https://www.youtube-nocookie.com/embed/${id}?rel=0&autoplay=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`};
 const image=$('.wudu-image');if(image)image.onerror=()=>{const msg=document.createElement('p');msg.className='image-empty';msg.textContent='De afbeelding kon niet worden geladen.';image.replaceWith(msg)};
 if(keepScroll()){/* zelfde categorie: op dezelfde hoogte blijven, ook als de afbeelding nog laadt */const restore=()=>window.scrollTo(0,y0);restore();requestAnimationFrame(restore);const im=$('.wudu-image');if(im&&!im.complete)im.addEventListener('load',()=>{if(seq===token&&window.scrollY<y0)restore()},{once:true})}else{$('#page-title')?.focus({preventScroll:true});window.scrollTo(0,0)}
 }catch(e){if(seq!==token)return;$('#main').innerHTML=hero(names[cat],'')+`<section class="empty-panel"><h2>${e.message==='unavailable'?'Dit onderdeel is niet beschikbaar.':'Laden is niet gelukt'}</h2><p>${e.message==='unavailable'?'Het onderdeel kan zijn verborgen of verwijderd.':'Controleer je internetverbinding en probeer opnieuw.'}</p><a class="soft" href="${href(cat)}">Terug</a> <button class="soft" id="retry">Opnieuw proberen</button></section>`;$('#retry').onclick=render}
}
/* 1.6: Vraag en antwoord is verhuisd naar Sierah. */
/* 1.6: bij bladeren tussen stappen of vragen van dezelfde categorie blijft de pagina op dezelfde hoogte staan. */
let lastRoute=location.hash;
function keepScroll(){const [pc,pid]=lastRoute.slice(1).split('/'),[nc,nid]=location.hash.slice(1).split('/');lastRoute=location.hash;return !!(nid&&pc===nc&&(pid||nc==='wudu'))}
function toSierah(){if(location.hash==='#vragen'||location.hash.startsWith('#vragen/')){location.replace('/sierah/');return true}return false}
window.addEventListener('hashchange',()=>{if(!toSierah())render()});window.addEventListener('pagehide',()=>stopAudio());if(!toSierah())render();
