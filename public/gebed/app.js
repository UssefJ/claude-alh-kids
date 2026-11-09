
'use strict';
let PRAYER_STEPS=[];

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({
  '&':'&amp;',
  '<':'&lt;',
  '>':'&gt;',
  '"':'&quot;',
  "'":'&#39;'
}[c]));

const $=s=>document.querySelector(s);

const playIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 4q-2-1-2 2v20q0 3 3 1l20-10q2-1 0-3Z" fill="currentColor"/></svg>';

const pauseIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="4" width="7" height="24" rx="2" fill="currentColor"/><rect x="19" y="4" width="7" height="24" rx="2" fill="currentColor"/></svg>';

let step=0,part=0,mode='all',repeat=false,playing=false,finished=false,timer=null,audio=null,remaining=4500,started=0,generation=0,showPhon=false;

function current(){
  return PRAYER_STEPS[step];
}

function halt(reset=false){
  generation++;
  clearTimeout(timer);
  timer=null;
  if(playing&&!audio){
    remaining=Math.max(0,remaining-(performance.now()-started));
  }
  if(audio)audio.pause();
  playing=false;
  if(reset){
    remaining=4500;
    finished=false;
    if(audio){
      audio.onended=null;
      audio.onerror=null;
      audio.removeAttribute('src');
      audio.load();
      audio=null;
    }
  }
}

function goStep(n){
  if(n<0||n>=PRAYER_STEPS.length)return;
  halt(true);
  location.hash=PRAYER_STEPS[n].id;
}

function route(){
  if(!PRAYER_STEPS.length)return;
  halt(true);
  step=Math.max(0,PRAYER_STEPS.findIndex(s=>s.id===location.hash.slice(1)));
  part=0;
  mode='all';
  repeat=false;
  render();
}

function render(){
  const s=current();
  document.title=s.title+' · Het gebed · Al Himmah Kids';

  $('#main').innerHTML=`
<section class="hero">
  <a class="back" href="../">← Home</a>
  <h1>Het gebed</h1>
  <p>Stap voor stap leren bidden</p>
</section>

<div class="stepbar">
  <span id="step-count">Stap ${step+1} / ${PRAYER_STEPS.length}</span>
  <button id="overview" aria-expanded="false" aria-controls="step-list">Alle stappen ▾</button>
  <span>Oefengebed · 2 rakaʿat</span>
</div>

<div id="step-list" hidden>
  ${PRAYER_STEPS.map((x,i)=>`
    <button data-step="${i}" aria-current="${i===step?'step':'false'}">
      ${i+1}. ${esc(x.title)}
      <small>${esc(x.group)}</small>
    </button>
  `).join('')}
</div>

<div class="modes" ${s.lines.length===1?'hidden':''}>
  <button id="all" aria-pressed="true">${esc(s.whole)}</button>
  <button id="single" aria-pressed="false">${s.unit==='Ayah'?'Ayah voor ayah':'Zin voor zin'}</button>
</div>

<p id="mode-help" class="mode-help"></p>

<section class="prayer-card" aria-label="Gebedsstap">
  <div class="card-heading">
    <span class="badge">${esc(s.group)}</span>
    <h2>${esc(s.title)}</h2>
  </div>

  <figure>
    <div
      class="pose ${s.id==='tahiyyat'?'tahiyyat-pose':''} ${s.customImage?'custom-pose':''}"
      role="img"
      aria-label="${esc(s.title)}: jongen in crèmekleurige qamis"
      style="${s.customImage?'background-image:url(\''+esc(s.customImage)+'\');background-size:contain;background-repeat:no-repeat;background-position:center;':''}--x:${s.pose%3*50}%;--y:${Math.floor(s.pose/3)*50}%">
    </div>
    <figcaption>${esc(s.instruction)}</figcaption>
  </figure>

  <div class="reading">
    <p id="arabic" class="arabic" lang="ar" dir="rtl"></p>
    <p id="meaning" class="meaning"></p>
    <button id="phon-toggle" class="phon-toggle" aria-expanded="${showPhon}" aria-controls="phon">
      ◉ Fonetisch ${showPhon?'verbergen':'tonen'}
    </button>
    <p id="phon" class="phonetic" ${showPhon?'':'hidden'}></p>

    <div class="sentences" ${s.lines.length===1?'hidden':''}>
      <span class="small">Kies een ${s.unit.toLowerCase()}</span>
      <div class="sentence-controls">
        <button id="line-prev" aria-label="Vorige ${s.unit.toLowerCase()}">‹</button>
        <span id="line-count" aria-live="polite"></span>
        <button id="line-next" aria-label="Volgende ${s.unit.toLowerCase()}">›</button>
      </div>
      <div class="sentence-dots">
        ${s.lines.map((x,i)=>`
          <button data-part="${i}" aria-label="${esc(s.unit)} ${i+1}"></button>
        `).join('')}
      </div>
    </div>
  </div>

  <img class="corner left" src="../assets/reading-sprig.png" alt="">
  <img class="corner right" src="../assets/reading-sprig.png" alt="">
</section>

<div class="prayer-controls">
  <button id="prev" aria-label="Vorige gebedsstap">← Vorige</button>
  <button id="play" class="prayer-play" aria-label="Afspelen">${playIcon}</button>
  <button id="repeat" aria-pressed="false">⟳ Repeat uit</button>
  <button id="next" aria-label="Volgende gebedsstap">Volgende →</button>
</div>

<p class="control-explanation">Vorige en volgende gebedsstap</p>
<p id="repeat-help" class="control-explanation"></p>
<p id="status" class="demo-status" role="status"></p>

${step===PRAYER_STEPS.length-1?`
<div class="finish">
  <strong>Alhamdoelillah, je hebt alle stappen geoefend.</strong>
  <a href="#iqama">Opnieuw oefenen</a>
  <a href="../">Naar Home</a>
</div>`:''}

<details class="parent-info">
  <summary>Voor ouders en begeleiders</summary>
  <p>Ontwerp- en bedieningstest voor een vereenvoudigd oefengebed van twee rakaʿat. Voorbereiding (zoals woedoe), openingsdua’s en aanvullende smeekbeden zijn nog geen aparte lessen. Oefen samen met een volwassene. De stichting kan de gekozen tekstvariant, houdingen en uitspraak nog beoordelen.</p>
  <p>De iqama is de voorbereiding vóór het gebed. In dit voorbeeld gebruiken we de korte variant. De tahiyyat en salawat zijn verdeeld in twaalf leesdelen. Fonetische tekst is alleen een leeshulp.</p>
  <p>Iedere zin heeft een eigen opname. Bij geheel luisteren wisselt de tekst zodra de opname eindigt. De speler gaat nooit vanzelf naar een andere gebedsstap.</p>
  <p>Bronnen:
    <a href="https://www.islamic-relief.org.uk/resources/knowledge-base/five-pillars-of-islam/salah/how-to-pray-salah/" target="_blank" rel="noopener">gebedsvolgorde en teksten</a>,
    <a href="https://www.dwd.org.sa/uploads/website_pages/4_66d41e7bef3b8.pdf" target="_blank" rel="noopener">iqama</a>,
    <a href="https://sunnah.com/ibnmajah/5/95" target="_blank" rel="noopener">tussen de neerknielingen</a>.
    Arabische tekst wordt als echte tekst weergegeven, niet als gegenereerde afbeelding.
  </p>
</details>`;

  $('#prev').onclick=()=>goStep(step-1);
  $('#next').onclick=()=>goStep(step+1);
  $('#prev').disabled=step===0;
  $('#next').disabled=step===PRAYER_STEPS.length-1;

  $('#overview').onclick=()=>{
    const open=$('#step-list').hidden;
    $('#step-list').hidden=!open;
    $('#overview').setAttribute('aria-expanded',open);
  };

  document.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{
    const n=+b.dataset.step;
    if(n===step){
      $('#step-list').hidden=true;
      $('#overview').setAttribute('aria-expanded','false');
    }else goStep(n);
  });

  $('#all').onclick=()=>changeMode('all');
  $('#single').onclick=()=>changeMode('single');
  $('#play').onclick=()=>{
    if(playing){halt();update()}
    else start();
  };
  $('#repeat').onclick=()=>{
    repeat=!repeat;
    update();
  };

  $('#phon-toggle').onclick=()=>{
    showPhon=!showPhon;
    $('#phon-toggle').setAttribute('aria-expanded',showPhon);
    $('#phon-toggle').textContent='◉ Fonetisch '+(showPhon?'verbergen':'tonen');
    $('#phon').hidden=!showPhon;
  };

  $('#line-prev').onclick=()=>goLine(part-1);
  $('#line-next').onclick=()=>goLine(part+1);

  document.querySelectorAll('[data-part]').forEach(b=>b.onclick=()=>goLine(+b.dataset.part));
  update();
}

function update(){
  const s=current(),l=s.lines[part];

  $('#arabic').textContent=l.ar;
  $('#meaning').textContent=l.nl;
  $('#phon').textContent=l.phon;
  $('#line-count').textContent=`${esc(s.unit)} ${part+1} van ${s.lines.length}`;
  $('#line-prev').disabled=part===0;
  $('#line-next').disabled=part===s.lines.length-1;

  document.querySelectorAll('[data-part]').forEach(b=>
    b.setAttribute('aria-current',String(+b.dataset.part===part))
  );

  $('#all').setAttribute('aria-pressed',String(mode==='all'));
  $('#single').setAttribute('aria-pressed',String(mode==='single'));

  $('#mode-help').textContent=s.lines.length===1?
    'Kijk, luister en oefen rustig mee.':
    mode==='all'?
    `${s.unit==='Ayah'?'De ayat':'De zinnen'} gaan vanzelf verder.`:
    `Kies zelf de volgende ${s.unit.toLowerCase()} met de kleine pijlen.`;

  $('#play').innerHTML=playing?pauseIcon:playIcon;
  $('#play').setAttribute('aria-label',playing?'Pauzeren':'Afspelen');
  $('#repeat').textContent='⟳ Repeat '+(repeat?'aan':'uit');
  $('#repeat').setAttribute('aria-pressed',String(repeat));

  $('#repeat-help').textContent=`Repeat herhaalt ${
    mode==='single'||s.lines.length===1?
    'deze '+s.unit.toLowerCase():
    s.id==='iqama'?'de hele iqama':'de hele tekst van deze stap'
  }.`;

  $('#status').textContent=finished?
    'Deze luisterronde is klaar. Je kiest zelf wanneer je naar de volgende gebedsstap gaat.':
    l.audio?
    (playing?'Luister mee.':'Druk op play om te luisteren.'):
    'Voor deze zin is nog geen opname toegevoegd.';
}

function changeMode(m){
  halt(true);
  mode=m;
  part=0;
  update();
}

function goLine(n){
  if(n<0||n>=current().lines.length)return;
  halt(true);
  part=n;
  update();
  start();
}

async function start(){
  if(playing)return;
  if(!current().lines[part].audio){update();return;}
  if(finished){
    if(mode==='all')part=0;
    remaining=4500;
    finished=false;
  }

  playing=true;
  const token=++generation;
  update();
  const l=current().lines[part];

  if(l.audio){
    if(!audio){
      audio=new Audio(l.audio);
      audio.onended=()=>{if(token===generation)ended()};
      audio.onerror=()=>fail(token);
    }else{
      audio.onended=()=>{if(token===generation)ended()};
      audio.onerror=()=>fail(token);
    }
    try{await audio.play()}
    catch{fail(token)}
  }
}

function fail(token){
  if(token!==generation)return;
  halt(true);
  update();
  $('#status').textContent='De audio kon niet worden afgespeeld. Probeer opnieuw.';
}

function ended(){
  if(!playing)return;
  halt(true);
  if(mode==='all'&&part<current().lines.length-1){
    part++;
    update();
    start();
  }else if(repeat){
    if(mode==='all')part=0;
    update();
    start();
  }else{
    finished=true;
    update();
  }
}

// Afbeelding alleen gebruiken als er echt een eigen afbeelding is.
// Bij een lege afbeeldingsverwijzing wordt de standaard gebedshouding getoond.
function prayerImage(d){
  const media=d.image?Cloud.mediaURL(d.image):'';
  if(media)return media;

  const path=typeof d.imageUrl==='string'?d.imageUrl.trim():'';
  return path?Cloud.safeURL(path):'';
}

window.addEventListener('hashchange',route);
document.addEventListener('visibilitychange',()=>{
  if(document.hidden&&playing){
    halt();
    update();
  }
});
window.addEventListener('pagehide',()=>halt(true));

Cloud.listPublic('gebed').then(rows=>{
  PRAYER_STEPS=rows.map(d=>({
    ...d,
    pose:Number.isInteger(d.pose)?d.pose:0,
    customImage:prayerImage(d),
    group:d.group||'Gebedsstap',
    whole:d.whole||'Geheel luisteren',
    unit:d.unit||'Zin',
    lines:d.units.map(u=>({
      ...u,
      audio:Cloud.mediaURL(u.audio)
    }))
  }));

  if(rows.length)route();
  else $('#main').innerHTML='<p class="empty">Er zijn nog geen gebedsstappen gepubliceerd. <a href="/">Home</a></p>';
}).catch(e=>{
  $('#main').textContent=e.message;
});
