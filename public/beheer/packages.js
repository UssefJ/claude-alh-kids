// Tekstpakketten. Alleen bekende velden worden geïmporteerd, geen scripts of mediakoppelingen.
function parseContentPackage(raw){
 if(raw?.format==='alhimmah-surah'){
  const p=checkSurahPackage(raw);return {category:'quran',surahNumber:p.surah.number,title:p.surah.name,subtitle:p.surah.arabicName,packageSources:p.sources,units:p.ayahs.map(a=>unit({title:'Ayah '+a.number,ar:a.arabic,nl:a.dutch,phon:a.phonetic}))};
 }
 if(raw?.format!=='alhimmah-content'||raw.version!==1)throw Error('Gebruik een Al Himmah-surahpakket of inhoudspakket, versie 1.');
 if(!CATS.some(c=>c[0]===raw.category)||raw.category==='quran')throw Error('Ongeldige categorie. Gebruik voor Quran een surahpakket.');
 const text=(v,name,max=30000)=>{if(v===undefined)return '';if(typeof v!=='string'||v.length>max)throw Error('Ongeldig veld: '+name);return v.trim()};
 const title=text(raw.title,'titel',200);if(!title)throw Error('De pakketnaam ontbreekt.');
 if(!Array.isArray(raw.units)||!raw.units.length||raw.units.length>300)throw Error('Gebruik 1 tot 300 tekstdelen.');
 if(raw.category==='alfabet'&&raw.units.length!==2)throw Error('Een letterpakket bevat twee delen: letter en voorbeeldwoord.');
 const units=raw.units.map((u,i)=>{if(!u||typeof u!=='object')throw Error('Ongeldig deel '+(i+1));const start=u.start??0;if(!Number.isFinite(start)||start<0)throw Error('Ongeldige starttijd.');return unit({title:text(u.title,'deeltitel',200),ar:text(u.ar,'Arabisch'),nl:text(u.nl,'vertaling'),phon:text(u.phon,'fonetisch'),text:text(u.text,'verhaal'),alt:text(u.alt,'afbeeldingsbeschrijving',1000),start})});
 const duration=raw.duration??420;if(!Number.isFinite(duration)||duration<=0)throw Error('Ongeldige duur.');
 return {category:raw.category,title,subtitle:text(raw.subtitle,'ondertitel',300),instruction:text(raw.instruction,'uitleg'),source:text(raw.source,'bron'),duration,units};
}
function importPackagesDialog(){
 const destination=category;
 modal('Meerdere pakketten importeren',`<p>Sleep één of meerdere JSON-pakketten voor <strong>${catName(destination)}</strong> naar dit vak. Maximaal 50 bestanden, 5 MB per bestand en 20 MB samen.</p><label class="dropzone field" id="packages-drop"><span class="drop-hint">↓ Sleep hier je pakketten</span><input id="packages-files" type="file" multiple accept=".json,application/json"></label><p>Elk pakket wordt een nieuw, verborgen concept met Def. uit. Bestaande onderdelen en audio blijven behouden. Dit zijn tekstpakketten; afbeeldingen en audio voeg je daarna toe.</p><button id="packages-template">Voorbeeldformaat downloaden</button><p id="packages-error" role="alert"></p>`);
 $('#packages-template').onclick=()=>downloadJSON(destination==='quran'?{format:'alhimmah-surah',version:1,surah:{number:1,name:'Al-Fatiha',arabicName:'الفاتحة',ayahCount:1},sources:{notes:'Sjabloon: vul de volledige surah in.'},ayahs:[{number:1,arabic:'Vul hier de Arabische tekst in',dutch:'',phonetic:''}]}:{format:'alhimmah-content',version:1,category:destination,title:'Voorbeeld — aanpassen',subtitle:'',instruction:'',source:'',duration:420,units:destination==='alfabet'?[unit({title:'Letterklank'}),unit({title:'Voorbeeldwoord'})]:[unit({title:'Deel 1'})]},'alhimmah-'+destination+'-sjabloon.json');
 const read=async files=>{
  if(busy)return;const error=$('#packages-error');if(!files.length)return;
  if(files.length>50||files.reduce((n,f)=>n+f.size,0)>20*1024*1024){error.textContent='Kies maximaal 50 bestanden en 20 MB samen.';return}
  busy=true;const rows=[];
  try{for(const file of files){try{if(!/\.json$/i.test(file.name)||file.size>5*1024*1024)throw Error('Kies een JSON-bestand tot 5 MB.');const draft=parseContentPackage(JSON.parse(await file.text()));if(draft.category!==destination)throw Error('Dit pakket hoort bij '+catName(draft.category)+'.');rows.push({name:file.name,draft})}catch(e){rows.push({name:file.name,error:e.message})}}}
  finally{busy=false}if(!error.isConnected)return;reviewPackages(rows,destination);
 };
 $('#packages-files').onchange=e=>read(Array.from(e.target.files));const zone=$('#packages-drop');zone.ondragover=e=>{e.preventDefault();zone.classList.add('drag-over')};zone.ondragleave=()=>zone.classList.remove('drag-over');zone.ondrop=e=>{e.preventDefault();e.stopPropagation();zone.classList.remove('drag-over');read(Array.from(e.dataTransfer.files))};
}
function reviewPackages(rows,destination){
 $('#modal-title').textContent='Controleer de pakketten';
 const render=()=>{
 $('#modal-body').innerHTML=`<p>${rows.filter(r=>r.draft).length} geldige pakketten · ${rows.filter(r=>r.error).length} niet geldig. Alle geldige pakketten worden toegevoegd, ook wanneer een titel al bestaat.</p>${rows.map(r=>`<details class="import-result"><summary>${esc(r.name)} — ${r.done?'Toegevoegd':r.error?esc(r.error):esc(r.draft.title)}</summary>${r.draft?`<p>${r.draft.units.length} delen · alle teksten blijven bewerkbaar.</p>${r.draft.units.map((u,i)=>`<article><strong>${i+1}. ${esc(u.title)}</strong><p lang="ar" dir="rtl">${esc(u.ar)}</p><p class="import-text">${esc(u.text||u.nl)}</p><p>${esc(u.phon)}</p></article>`).join('')}`:''}</details>`).join('')}<p id="packages-progress" role="status"></p><button id="packages-confirm" class="primary" ${!rows.some(r=>r.draft&&!r.done)?'disabled':''}>Geldige pakketten als concept toevoegen</button><p>Je bepaalt daarna per regel of deze definitief is en gepubliceerd mag worden.</p>`;
 $('#packages-confirm').onclick=async()=>{if(busy)return;busy=true;$('#packages-confirm').disabled=true;$('#close-modal').disabled=true;let added=0;
 try{for(const row of rows){if(!row.draft||row.done)continue;try{row.id??='import-'+crypto.randomUUID();const existing=records.some(r=>r.draft.category===destination&&r.draft.title===row.draft.title);const record={key:destination+'/'+row.id,order:Math.max(-1,...records.filter(r=>r.draft.category===destination).map(r=>r.order))+1,draft:{...structuredClone(row.draft),id:row.id,visible:false,definitive:false,title:row.draft.title+(existing?' (import)':'')},published:null,publishedAt:null,updated:new Date().toISOString()};const saved=await Cloud.saveRecord(record);records.push(saved);row.done=true;row.error='';added++}catch(e){row.error='Niet toegevoegd: '+e.message}$('#packages-progress').textContent=added+' toegevoegd…'}}
 finally{busy=false;$('#close-modal').disabled=false;render();$('#packages-progress').textContent=added+' pakketten toegevoegd. Sluit dit venster om verder te werken.';listPage()}
 };
 };render();
}
