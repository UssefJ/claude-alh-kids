import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync('public/beheer/app.js','utf8');
const code=source.slice(source.indexOf('function checkSurahPackage('),source.indexOf('function packageInfo('));
const sandbox={CATS:['quran','duas','profeten','alfabet','levenslessen','gebed'].map(x=>[x]),unit:o=>({ar:'',nl:'',phon:'',text:'',start:0,...o})};vm.createContext(sandbox);vm.runInContext(code+fs.readFileSync('public/beheer/packages.js','utf8'),sandbox);
test('Bulk pakketten: surahcompatibiliteit, verhaaldelen en whitelist',()=>{
 const p=sandbox.parseContentPackage({format:'alhimmah-surah',version:1,surah:{number:1,name:'Test',arabicName:'اسم',ayahCount:1},ayahs:[{number:1,arabic:'نص',dutch:'tekst',phonetic:'klank'}]});assert.equal(p.units[0].nl,'tekst');assert.equal(p.units[0].phon,'klank');
 const story=sandbox.parseContentPackage({format:'alhimmah-content',version:1,category:'profeten',title:'Profeet Noeh',visible:true,definitive:true,audio:{bucket:'ah-drafts',path:'private'},units:[{text:'Een verhaal',imageUrl:'javascript:evil()'},{text:'',start:0}]});assert.equal(story.units.length,2);assert.equal(story.audio,undefined);assert.equal(story.visible,undefined);assert.equal(story.definitive,undefined);assert.equal(story.units[0].imageUrl,undefined);
 assert.throws(()=>sandbox.parseContentPackage({format:'alhimmah-content',version:1,category:'alfabet',title:'Alif',units:[{}]}),/twee/);
 assert.throws(()=>sandbox.parseContentPackage({format:'alhimmah-content',version:1,category:'profeten',title:'X',units:[{text:99}]}),/Ongeldig/);
});
test('Def is handmatig: lege inhoud mag worden gepubliceerd',()=>{
 const s={validateQuranAudio(){},isStory:c=>['profeten','levenslessen'].includes(c)};vm.createContext(s);vm.runInContext(source.slice(source.indexOf('function validate('),source.indexOf('async function save(')),s);
 for(const category of ['quran','duas','profeten','alfabet','levenslessen','gebed']){const d={category,title:'',definitive:true,units:[{ar:'',text:''}]};assert.doesNotThrow(()=>s.validate(d,true));assert.throws(()=>s.validate({...d,definitive:false},true),/Def/)}
});
test('Overzichtacties: zichtbaar klaarzetten, publiceren, Def intrekken en verborgen publiceren',async()=>{
 const s={structuredClone,validate(d){if(!d.definitive)throw Error('Def ontbreekt')},Cloud:{async saveRecord(r,pub){if(pub)assert.ok(r.published);return r}}};vm.createContext(s);vm.runInContext(source.slice(source.indexOf('async function changeRecord('),source.indexOf('async function rowAction(')),s);
 const r={key:'duas/test',draft:{definitive:false,visible:false,units:[{ar:''}]}};
 await assert.rejects(s.changeRecord(r,'visible',true),/Def/);await s.changeRecord(r,'definitive',true);await s.changeRecord(r,'visible',true);assert.equal(r.published,null);await s.changeRecord(r,'publish');assert.equal(r.published.visible,true);await s.changeRecord(r,'definitive',false);assert.equal(r.draft.visible,false);assert.equal(r.published,null);await s.changeRecord(r,'definitive',true);await s.changeRecord(r,'publish');assert.equal(r.published.visible,false);
});
