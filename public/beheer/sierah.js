/* Al Himmah Kids 1.6 — beheer van Sierah.
   Elke Sierah-vraag heeft twee delen: units[0] = de vraag, units[1] = het antwoord.
   Per deel: Arabisch, fonetisch, Nederlands en een eigen opname. De Nederlandse vraag is ook de titel. */
function sierahParts(d){
 while(d.units.length<2)d.units.push(unit());
 d.units[0].title='Vraag';d.units[1].title='Antwoord';
 return d.units;
}
function sierahBlock(u,i,label){
 const audio=u.audio?`<audio controls preload="metadata" src="${blobURL(u.audio)}"></audio><small>${esc(u.audioName||'Eigen opname')}</small><br><button data-sierah-remove="${i}">Opname verwijderen</button>`:'<p class="muted">Nog geen opname.</p>';
 return `<section class="panel section-gap"><h2>${label}</h2>
 <label class="field">${label} in het Nederlands${i===0?' (dit is ook de titel in de lijst)':''}<textarea data-sierah="${i}" data-key="nl">${esc(u.nl)}</textarea></label>
 <label class="field">${label} in het Arabisch<textarea class="ar" lang="ar" dir="rtl" data-sierah="${i}" data-key="ar">${esc(u.ar)}</textarea></label>
 <label class="field">Fonetisch (leeshulp)<textarea data-sierah="${i}" data-key="phon">${esc(u.phon)}</textarea></label>
 <div class="asset"><strong>Opname van ${i===0?'de vraag':'het antwoord'}</strong>${audio}<label class="field">${u.audio?'Vervangen':'Audio uploaden'}<input type="file" accept="audio/*" data-sierah-audio="${i}"><small>Maximaal 50 MB per bestand.</small></label></div>
 </section>`;
}
function sierahEditor(){
 revoke();const d=active.draft,[q,a]=sierahParts(d);
 $('#main').innerHTML=`<div class="breadcrumbs"><a href="#">Overzicht</a> / <a href="#sierah">Sierah</a> / Bewerken</div><h1>${esc(d.title)}</h1>${status(active)}
 <section class="panel section-gap"><p class="muted">De volgorde en nummering in de kinderapp stel je in het overzicht in met ↑ en ↓.</p><div class="section-gap"><label class="check"><input id="definitive" type="checkbox" ${d.definitive?'checked':''}> Def. — door mij definitief verklaard</label><label class="check"><input id="visible" type="checkbox" ${d.visible?'checked':''} ${!d.definitive?'disabled':''}> Zichtbaar in de kinderapp</label></div></section>
 ${sierahBlock(q,0,'Vraag')}${sierahBlock(a,1,'Antwoord')}
 <section class="panel section-gap">${field('Bron / toelichting voor inhoud','source',d.source||'')}</section>
 <div class="actionbar"><span id="save-state">${dirty?'Niet-opgeslagen wijzigingen':'Concept klaar om te bewerken'}</span><button id="delete-item" class="danger">Onderdeel verwijderen</button><button id="save" class="primary">Concept opslaan</button><button id="preview">Voorbeeld bekijken</button><button id="publish" class="gold-button" ${!d.definitive?'disabled':''}>Publiceren</button>${active.published?'<button id="new-published">Gepubliceerde preview</button>':''}</div>`;
 document.querySelectorAll('[data-field]').forEach(e=>e.oninput=()=>{d[e.dataset.field]=e.value;markDirty()});
 document.querySelectorAll('[data-sierah]').forEach(e=>e.oninput=()=>{const u=d.units[Number(e.dataset.sierah)];u[e.dataset.key]=e.value;if(e.dataset.sierah==='0'&&e.dataset.key==='nl'){d.title=e.value.trim()||'Nieuwe vraag';$('#main h1').textContent=d.title}markDirty()});
 $('#definitive').onchange=e=>{d.definitive=e.target.checked;if(!d.definitive)d.visible=false;markDirty();editor()};$('#visible').onchange=e=>{d.visible=e.target.checked;markDirty()};
 document.querySelectorAll('[data-sierah-audio]').forEach(e=>e.onchange=async()=>{const f=e.files[0];if(!f)return;if(!isAudioFile(f)||f.size>50*1024*1024)return toast('Kies audio tot 50 MB.');const original=active,u=d.units[Number(e.dataset.sierahAudio)];try{await audioDuration(f);if(active!==original)return;u.audio=f;u.audioName=f.name;markDirty();editor()}catch{toast('Deze opname kon niet worden gelezen. Probeer MP3.')}});
 document.querySelectorAll('[data-sierah-remove]').forEach(b=>b.onclick=()=>{const u=d.units[Number(b.dataset.sierahRemove)];delete u.audio;delete u.audioName;markDirty();editor()});
 $('#delete-item').onclick=()=>deleteRecord(active.key);$('#save').onclick=()=>save(false);$('#publish').onclick=publishPrompt;$('#preview').onclick=()=>sierahPreview(d);if($('#new-published'))$('#new-published').onclick=()=>sierahPreview(active.published);
}
function sierahPreview(d){
 const part=(u,label)=>`<p class="eyebrow">${label}</p><p class="ar" dir="rtl" lang="ar">${esc(u?.ar)}</p><p class="muted">${esc(u?.phon)}</p><p><strong>${esc(u?.nl)}</strong></p>${u?.audio?`<audio controls src="${esc(blobURL(u.audio))}"></audio>`:'<p class="muted">Geen opname.</p>'}`;
 modal('Voorbeeld · '+d.title,`<article class="preview-card">${part(d.units[0],'Vraag')}<hr>${part(d.units[1],'Antwoord')}</article>`);
}
function validateSierah(d,publishing){
 if(d.category!=='sierah')return;
 if(d.units.length!==2)throw Error('Een Sierah-onderdeel heeft precies twee delen: de vraag en het antwoord.');
 if(publishing&&!(d.units[0].nl||'').trim())throw Error('Vul de vraag in het Nederlands in.');
}
