'use strict';
/* Al Himmah Kids 1.6 — Sierah.
   #            : lijst met genummerde vragen; het luisterknopje speelt de vraag af.
   #<id>        : vraag en antwoord, elk met Arabisch, fonetisch, Nederlands en een eigen opname. */
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors=['','mint','peach','lilac','blue'];
const speaker='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12h6l7-6v20l-7-6H4z" fill="currentColor"/><path d="M21 11q5 5 0 10m4-14q9 9 0 18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
const arrow='<svg viewBox="0 0 24 36" aria-hidden="true"><path d="m7 6 12 12L7 30" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const play='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M10 5q-2-1-2 2v18q0 3 3 1l17-9q2-1 0-3Z" fill="currentColor"/></svg>';
const pause='<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="5" width="7" height="22" rx="2" fill="currentColor"/><rect x="18" y="5" width="7" height="22" rx="2" fill="currentColor"/></svg>';
const star=(()=>{const p=[];for(let k=0;k<16;k++){const r=k%2?12.5:18,a=Math.PI/2+k*Math.PI/8;p.push((20+r*Math.cos(a)).toFixed(1)+','+(20-r*Math.sin(a)).toFixed(1))}return `<svg viewBox="0 0 40 40" aria-hidden="true"><polygon points="${p.join(' ')}" fill="#fff8e6" stroke="#e2a72a" stroke-width="2.4" stroke-linejoin="round"/></svg>`})();
let items=null,current=null,token=0;

function stopAll(){if(current){current.audio.pause();current.audio.currentTime=0;current.onstop?.();current=null}}
function hero(title,subtitle,back,label){return `<section class="hero"><a class="back" href="${esc(back)}">← ${esc(label)}</a><h1 tabindex="-1" id="page-title">${esc(title)}</h1>${subtitle?`<p>${subtitle}</p>`:''}</section>`}
const parts=d=>({q:d.units?.[0]||{},a:d.units?.[1]||{}});

async function load(){if(!items)items=await Cloud.listPublic('sierah');return items}

function listView(){
 $('#main').innerHTML=hero('Sierah','Leer over de Profeet Mohammed&nbsp;ﷺ','/','Home')+(items.length?`<p class="hint">Luister naar de vraag · Kies je vraag.</p><section class="list" aria-label="Kies een vraag">${items.map((d,i)=>{const {q}=parts(d),src=Cloud.mediaURL(q.audio);return `<div class="row ${colors[i%5]}"><button type="button" class="tile say" data-say="${i}" aria-pressed="false" aria-label="Luister naar vraag ${i+1}: ${esc(d.title)}" ${src?'':'disabled title="Nog geen opname"'}><span class="speaker">${speaker}</span></button><a class="tile open" href="#${encodeURIComponent(d.id)}" aria-label="Open vraag ${i+1}: ${esc(d.title)}"><span class="q">${i+1}. ${esc(d.title)}</span><span class="dot">${arrow}</span></a></div>`}).join('')}</section>`:'<p class="empty">Er zijn nog geen vragen gepubliceerd.</p>');
 document.querySelectorAll('[data-say]').forEach(b=>b.onclick=()=>{
  const was=current?.button===b;stopAll();if(was)return;
  const src=Cloud.mediaURL(parts(items[Number(b.dataset.say)]).q.audio);if(!src)return;
  const audio=new Audio(src);b.setAttribute('aria-pressed','true');
  current={audio,button:b,onstop:()=>b.setAttribute('aria-pressed','false')};
  audio.onended=()=>{if(current?.audio===audio){current.onstop();current=null}};
  audio.play().catch(()=>stopAll());
 });
}

function block(u,kind,label){
 const src=Cloud.mediaURL(u.audio);
 return `<p class="label">${kind==='q'?'DE VRAAG':'HET ANTWOORD'}</p>${u.ar?`<p class="ar" lang="ar" dir="rtl">${esc(u.ar)}</p>`:''}${u.phon?`<p class="phon">${esc(u.phon)}</p>`:''}<p class="nl">${esc(u.nl)}</p>
 <div class="controls"><button type="button" class="play" data-play="${kind}" aria-label="${label}" ${src?'':'disabled'}>${play}</button><span class="what">${label}</span><button type="button" class="soft" data-repeat="${kind}" aria-pressed="false" ${src?'':'disabled'}>⟳ Repeat uit</button></div>
 <p class="status" id="status-${kind}" role="status">${src?'':'Voor dit deel is nog geen opname toegevoegd.'}</p>`;
}

function detailView(id){
 const i=items.findIndex(x=>String(x.id)===id);
 if(i<0){$('#main').innerHTML=hero('Sierah','','#','Alle vragen')+'<p class="empty">Deze vraag is niet (meer) beschikbaar.</p>';return}
 const d=items[i],{q,a}=parts(d),prev=items[i-1],next=items[i+1];
 document.title=d.title+' · Sierah · Al Himmah Kids';
 $('#main').innerHTML=hero(d.title,'','#','Alle vragen')+`<article class="card"><img class="sprig" src="/assets/reading-sprig.png" alt=""><img class="sprig right" src="/assets/reading-sprig.png" alt="">${block(q,'q','Luister naar de vraag')}<div class="divider" aria-hidden="true"><span></span>${star}<span></span></div>${block(a,'a','Luister naar het antwoord')}</article>
 <nav class="pager" aria-label="Andere vragen"><a class="soft" href="${prev?'#'+encodeURIComponent(prev.id):'#'}" ${prev?'':'aria-disabled="true" tabindex="-1"'}>← Vorige vraag</a><a class="soft" href="#">Alle vragen</a><a class="soft" href="${next?'#'+encodeURIComponent(next.id):'#'}" ${next?'':'aria-disabled="true" tabindex="-1"'}>Volgende vraag →</a></nav>${d.source?`<details class="source"><summary>Bron en toelichting</summary><p>${esc(d.source)}</p></details>`:''}`;
 const loops={q:false,a:false};
 for(const kind of ['q','a']){
  const u=kind==='q'?q:a,btn=$(`[data-play="${kind}"]`),rep=$(`[data-repeat="${kind}"]`),status=$('#status-'+kind),src=Cloud.mediaURL(u.audio);
  if(!src)continue;
  const setIcon=on=>{btn.innerHTML=on?pause:play;btn.setAttribute('aria-label',(on?'Pauzeer ':'')+(kind==='q'?'Luister naar de vraag':'Luister naar het antwoord'))};
  btn.onclick=()=>{
   if(current?.kind===kind&&!current.audio.paused){current.audio.pause();setIcon(false);status.textContent='Gepauzeerd.';return}
   if(current?.kind===kind&&current.audio.paused){current.audio.play().then(()=>{setIcon(true);status.textContent='Luister mee.'}).catch(()=>{});return}
   stopAll();const audio=new Audio(src);audio.loop=loops[kind];
   current={audio,kind,onstop:()=>{setIcon(false);status.textContent=''}};
   audio.onended=()=>{if(current?.audio===audio){setIcon(false);status.textContent='Klaar. Druk nog eens om opnieuw te luisteren.';current=null}};
   audio.play().then(()=>{setIcon(true);status.textContent='Luister mee.'}).catch(()=>{stopAll();status.textContent='De opname kon niet worden afgespeeld. Probeer opnieuw.'});
  };
  rep.onclick=()=>{loops[kind]=!loops[kind];rep.setAttribute('aria-pressed',String(loops[kind]));rep.textContent='⟳ Repeat '+(loops[kind]?'aan':'uit');if(current?.kind===kind)current.audio.loop=loops[kind]};
 }
}

async function render(){
 const seq=++token;stopAll();
 try{await load();if(seq!==token)return;
  const id=decodeURIComponent(location.hash.slice(1));
  if(id)detailView(id);else{document.title='Sierah · Al Himmah Kids';listView()}
  $('#page-title')?.focus({preventScroll:true});window.scrollTo(0,0);
 }catch(e){if(seq!==token)return;$('#main').innerHTML=hero('Sierah','','/','Home')+'<section class="empty"><p>Laden is niet gelukt. Controleer je internetverbinding.</p><button class="soft" id="retry">Opnieuw proberen</button></section>';$('#retry').onclick=()=>{items=null;render()}}
}
window.addEventListener('hashchange',render);window.addEventListener('pagehide',stopAll);render();
