'use strict';
let surahs=[],quranRecords=[],currentSurah=null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colors=['','mint','peach','lilac','blue'];
const arrow='<svg viewBox="0 0 24 36" aria-hidden="true"><path d="m7 6 12 12L7 30" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const playIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 4q-2-1-2 2v20q0 3 3 1l20-10q2-1 0-3Z" fill="currentColor"/></svg>';
const pauseIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="7" y="4" width="7" height="24" rx="2" fill="currentColor"/><rect x="19" y="4" width="7" height="24" rx="2" fill="currentColor"/></svg>';
const repeatIcon='<svg viewBox="0 0 36 36" aria-hidden="true"><path d="M7 16a11 11 0 0 1 19-8m-1-5 2 6-7 1M29 20a11 11 0 0 1-19 8m1 5-2-6 7-1" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const sprig=(right=false)=>`<img class="sprig ${right?'right':''}" src="assets/reading-sprig.png" alt="" aria-hidden="true">`;
let unitData=[],verses=[],ayah=0,mode='ayah',repeat=false,playing=false,phase='listen',timer=null,toastTimer=null,selectionStart=0,selectionEnd=6,finished=false;
const main=document.querySelector('#main');
function toast(message){const t=document.querySelector('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),3800)}
function stop(){markedPlayer.stop();player.stop();playing=false;phase='listen'}
const speakerIcon='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 12h6l7-6v20l-7-6H4z" fill="currentColor"/><path d="M21 11q5 5 0 10m4-14q9 9 0 18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
let nameAudio=null,nameButton=null;
function stopNameAudio(){const a=nameAudio;nameAudio=null;if(a){a.onended=null;a.onerror=null;a.pause();a.removeAttribute('src');a.load()}if(nameButton){nameButton.setAttribute('aria-pressed','false');nameButton=null}}
async function playSurahName(id,button){
 if(nameButton===button){stopNameAudio();return}
 stopNameAudio();const d=quranRecords.find(r=>r.id===id),url=Cloud.mediaURL(d?.nameAudio);
 if(!url){toast('De uitspraak van deze surahnaam is nog niet toegevoegd.');return}
 const audio=new Audio(url);nameAudio=audio;nameButton=button;button.setAttribute('aria-pressed','true');
 audio.onended=()=>{if(nameAudio===audio)stopNameAudio()};
 const failed=()=>{if(nameAudio!==audio)return;stopNameAudio();toast('De naamopname kan niet worden afgespeeld. Probeer opnieuw.')};audio.onerror=failed;
 try{await audio.play()}catch{failed()}
}
function renderList(){stop();stopNameAudio();main.className='surah-list-page';main.innerHTML=`<section class="hero"><a class="back" href="../">← Home</a><h1>Al-Quran</h1><p>Welke surah gaan we leren?</p></section><p class="listen-hint">Luister naar de naam · Kies je surah.</p><section class="list" aria-label="Kies een surah">${surahs.map((s,i)=>`<div class="surah-row ${colors[i%5]}"><button type="button" class="name-sound" data-name="${esc(s[0])}" aria-label="Luister naar de naam ${esc(s[1])}" aria-pressed="false"><span class="speaker-circle">${speakerIcon}</span></button><button type="button" class="surah" data-surah="${esc(s[0])}" aria-label="Open ${esc(s[1])}"><span class="latin">${esc(s[1])}</span><span class="arabic" lang="ar" dir="rtl">${esc(s[2])}</span><span class="next-dot">${arrow}</span></button></div>`).join('')}</section><footer class="list-footer"><button class="text-button" data-info>Voor ouders en begeleiders</button><span class="test-note">Gepubliceerde surahs</span></footer>`;
main.querySelectorAll('[data-surah]').forEach(b=>b.onclick=()=>{stopNameAudio();ayah=0;location.hash=encodeURIComponent(b.dataset.surah)});main.querySelectorAll('[data-name]').forEach(b=>b.onclick=()=>playSurahName(b.dataset.name,b));bindInfo()}
function renderPractice(){main.className='practice';if(!verses.length){main.innerHTML='<p class="load-error">De ayat worden geladen…</p>';return}main.innerHTML=`<section class="hero"><a class="back" href="#">← Alle surahs</a><h1>${esc(currentSurah?.title)}</h1></section><div class="modes" role="group" aria-label="Kies een leermethode"><button class="mode" data-mode="whole" aria-pressed="false">Hele surah</button><button class="mode" data-mode="ayah" aria-pressed="false">Ayah voor ayah</button><button class="mode" data-mode="together" aria-pressed="false">Samen reciteren</button><button class="mode" data-mode="selection" aria-pressed="false">Selectie</button></div><div class="selection-panel" hidden><span class="selection-title">Kies jouw ayat</span><label>Van ayah <select id="selection-start" aria-label="Beginayah">${verses.map((v,i)=>`<option value="${i}">${i+1}</option>`).join('')}</select></label><span class="selection-dash" aria-hidden="true">→</span><label>Tot en met ayah <select id="selection-end" aria-label="Eindayah">${verses.map((v,i)=>`<option value="${i}">${i+1}</option>`).join('')}</select></label><span class="selection-summary" aria-live="polite"></span></div><section class="reading" aria-label="Ayah"><p class="ayah-count"></p><p class="phase" aria-live="polite"></p>${sprig()}${sprig(true)}<div class="verse-row"><span class="medallion" aria-label="Ayahnummer"></span><p class="verse" lang="ar" dir="rtl"></p></div><details class="translation-help"><summary>Betekenis en fonetisch</summary><p id="verse-nl"></p><p id="verse-phon"></p></details><div class="dots" aria-label="Ga naar een ayah">${verses.map((v,i)=>`<button class="dot" data-ayah="${i}" aria-label="Ayah ${i+1}" aria-current="false"></button>`).join('')}</div></section><div class="controls"><button class="prevnext previous" aria-label="Vorige ayah"><span aria-hidden="true">←</span> Vorige</button><div class="playwrap"><button class="play" aria-label="Recitatie afspelen">${playIcon}</button><span class="play-label">Afspelen</span></div><button class="prevnext next" aria-label="Volgende ayah">Volgende <span aria-hidden="true">→</span></button><button class="repeat" aria-label="Herhalen aanzetten" aria-pressed="false"><span class="circle">${repeatIcon}</span><span class="repeat-label">Repeat uit</span></button></div><p class="demo-status" role="status"></p><footer class="practice-footer"><button class="text-button" data-info>⚙ Voor ouders en begeleiders</button><span class="test-note">Luister, lees en oefen mee</span></footer>`;
main.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>{stop();finished=false;mode=b.dataset.mode;if(mode==='selection')ayah=selectionStart;else if(mode!=='ayah')ayah=0;update()}));main.querySelector('.play').addEventListener('click',()=>{if(playing){markedPlayer.pause();player.pause();update()}else start()});main.querySelector('.previous').addEventListener('click',()=>navigate(ayah-1));main.querySelector('.next').addEventListener('click',()=>navigate(ayah+1));main.querySelector('.repeat').addEventListener('click',()=>{repeat=!repeat;player.options.repeat=repeat;markedPlayer.options.repeat=repeat;update()});main.querySelectorAll('[data-ayah]').forEach(b=>b.addEventListener('click',()=>navigate(Number(b.dataset.ayah))));main.querySelector('#selection-start').addEventListener('change',e=>changeSelection('start',Number(e.target.value)));main.querySelector('#selection-end').addEventListener('change',e=>changeSelection('end',Number(e.target.value)));bindInfo();update()}
function bounds(){return mode==='selection'?[selectionStart,selectionEnd]:[0,verses.length-1]}
function changeSelection(which,value){
 if(!Number.isInteger(value)||value<0||value>=verses.length)return;
 stop();finished=false;
 if(which==='start'){selectionStart=value;if(selectionEnd<value)selectionEnd=value}
 else{selectionEnd=Math.max(value,selectionStart)}
 ayah=selectionStart;update();
}
function update(){
 if(!main.classList.contains('practice')||!verses.length)return;
 const [first,last]=bounds();
 main.querySelector('.verse').textContent=verses[ayah];main.querySelector('#verse-nl').textContent=unitData[ayah].nl||'';main.querySelector('#verse-phon').textContent=unitData[ayah].phon||'';
 main.querySelector('.ayah-count').textContent=`Ayah ${ayah+1} van ${verses.length}`;
 main.querySelector('.medallion').textContent=ayah+1;
 main.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 main.querySelector('.selection-panel').hidden=mode!=='selection';
 main.querySelector('#selection-start').value=selectionStart;
 main.querySelector('#selection-end').value=selectionEnd;
 main.querySelectorAll('#selection-end option').forEach(o=>o.disabled=Number(o.value)<selectionStart);
 main.querySelector('.selection-summary').textContent=selectionStart===selectionEnd?`Alleen ayah ${selectionStart+1}`:`Ayah ${selectionStart+1} t/m ${selectionEnd+1}`;
 main.querySelectorAll('[data-ayah]').forEach(b=>{const n=Number(b.dataset.ayah);b.setAttribute('aria-current',String(n===ayah));b.disabled=n<first||n>last;b.classList.toggle('in-selection',mode==='selection'&&n>=first&&n<=last)});
 main.querySelector('.previous').disabled=ayah<=first;
 main.querySelector('.next').disabled=ayah>=last;
 main.querySelector('.play').innerHTML=playing?pauseIcon:playIcon;
 main.querySelector('.play').setAttribute('aria-label',playing?'Pauzeren':'Recitatie afspelen');
 main.querySelector('.play-label').textContent=playing?'Pauzeren':'Afspelen';
 main.querySelector('.repeat').setAttribute('aria-pressed',String(repeat));
 main.querySelector('.repeat').setAttribute('aria-label',repeat?'Herhalen uitzetten':'Herhalen aanzetten');
 main.querySelector('.repeat-label').textContent=repeat?'Repeat aan':'Repeat uit';
 main.querySelector('.phase').textContent=mode==='together'?'Eerst luisteren, dan samen reciteren':'';
 const scope=mode==='ayah'?'deze ayah':mode==='selection'?`ayah ${first+1} t/m ${last+1}`:'de hele surah';
 main.querySelector('.demo-status').textContent=playing?'Luister mee.':finished?'De luisterronde is afgelopen. Druk op play om opnieuw te beginnen.':'Druk op play om te luisteren.';
}
const markedPlayer=new MarkedPlayer({onIndex:i=>{ayah=i;update()},onState:v=>{playing=v;update()},onEnd:()=>{finished=true;update()},onError:message=>{update();toast(message);const el=main.querySelector('.demo-status');if(el)el.textContent=message}});
const player=new SequencePlayer({onIndex:i=>{ayah=i;update()},onState:v=>{playing=v;update()},onEnd:()=>{finished=true;update()},onError:message=>{update();toast(message);const el=main.querySelector('.demo-status');if(el)el.textContent=message}});
function start(){
 const rec=currentSurah?.recitations?.[mode==='together'?'together':'normal'];
 if(rec?.audio){
  const errors=markerErrors(rec,unitData.length);if(errors.length){toast(errors[0]);return}
  if(finished){ayah=mode==='ayah'?ayah:bounds()[0];finished=false;markedPlayer.stop()}
  const [rangeFirst,rangeLast]=bounds(),first=mode==='ayah'?ayah:rangeFirst,last=mode==='ayah'?ayah:rangeLast;
  markedPlayer.play(Cloud.mediaURL(rec.audio),rec,ayah,{first,last,single:mode==='ayah',full:mode==='whole'||mode==='together',repeat});return;
 }
 // Previously published surahs continue to use their old separate files until migrated.
 if(finished){ayah=mode==='ayah'?ayah:bounds()[0];finished=false;player.stop()}
 player.tracks=unitData.map(u=>Cloud.mediaURL(mode==='together'?u.together:u.audio));const [first,last]=bounds();player.play(ayah,{first,last,single:mode==='ayah',repeat})
}

function navigate(n){const [first,last]=bounds();if(n<first||n>last)return;const resume=playing;stop();finished=false;ayah=n;if(mode==='ayah'||resume)start();else update()}
function bindInfo(){main.querySelectorAll('[data-info]').forEach(b=>b.addEventListener('click',()=>{stopNameAudio();if(playing){stop();update()}document.querySelector('#info').showModal()}))}
function route(){stopNameAudio();stop();finished=false;const id=decodeURIComponent(location.hash.slice(1));currentSurah=quranRecords.find(d=>d.id===id||(id==='al-fatiha'&&d.id==='1'));if(currentSurah){unitData=currentSurah.units;verses=unitData.map(u=>u.ar);ayah=0;selectionStart=0;selectionEnd=verses.length-1;renderPractice()}else renderList();window.scrollTo(0,0)}
document.querySelectorAll('#info .close,#info .done').forEach(b=>b.addEventListener('click',()=>document.querySelector('#info').close()));document.querySelector('#info').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.close()});window.addEventListener('hashchange',route);document.addEventListener('visibilitychange',()=>{if(document.hidden){stopNameAudio();if(playing){stop();update()}}});
main.innerHTML='<p class="load-error">Surahs laden…</p>';Cloud.listPublic('quran').then(rows=>{quranRecords=rows;surahs=rows.map(d=>[d.id,d.title,d.subtitle]);route();if(!rows.length)main.insertAdjacentHTML('beforeend','<p class="load-error">Er zijn nog geen surahs gepubliceerd.</p>')}).catch(e=>{main.innerHTML='<div class="load-error"><h1>Al-Quran</h1><p></p><a href="/">Terug naar Home</a></div>';main.querySelector('p').textContent=e.message});window.addEventListener('pagehide',()=>{stopNameAudio();player.dispose();markedPlayer.dispose()});
