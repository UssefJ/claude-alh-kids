import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync('public/beheer/app.js','utf8');
const fn=source.slice(source.indexOf('async function deleteSelectedRecords('),source.indexOf('function isAudioFile('));
function setup(failKeys=[]){
 const nodes=new Map(),calls=[],dialogs=[];let closed=0;
 const context=vm.createContext({Set,category:'duas',busy:false,records:[{key:'duas/a',draft:{category:'duas',title:'Dua A'}},{key:'duas/b',draft:{category:'duas',title:'<Dua B>'}},{key:'quran/1',draft:{category:'quran',title:'Fatiha'}}],esc:s=>s.replace(/</g,'&lt;').replace(/>/g,'&gt;'),$:id=>{if(!nodes.has(id))nodes.set(id,{close:()=>closed++});return nodes.get(id)},modal:(title,html)=>dialogs.push({title,html}),listPage:()=>{},put:async r=>{calls.push(r.key);if(failKeys.includes(r.key))throw Error('Network error')}});
 vm.runInContext(fn,context);
 return {context,nodes,calls,dialogs,closed:()=>closed,open:keys=>context.deleteSelectedRecords(keys),confirm:()=>nodes.get('#confirm-delete-selected').onclick()};
}
test('Bulk deletion waits for confirmation; cancel does not delete',async()=>{
 const h=setup();await h.open(['duas/a']);assert.equal(h.calls.length,0);h.nodes.get('#cancel-delete-selected').onclick();assert.equal(h.closed(),1);assert.equal(h.calls.length,0);
});
test('Only unique selected records in the current category are deleted',async()=>{
 const h=setup();await h.open(['duas/a','duas/a','quran/1','unknown']);await h.confirm();assert.deepEqual(h.calls,['duas/a']);assert.equal(h.context.records.length,2);assert.equal(h.context.busy,false);
});
test('Partial failure retains failed records, escapes titles and reports counts',async()=>{
 const h=setup(['duas/b']);await h.open(['duas/a','duas/b']);assert.match(h.dialogs[0].html,/&lt;Dua B&gt;/);await h.confirm();assert.deepEqual(h.calls,['duas/a','duas/b']);assert.equal(h.context.records.some(r=>r.key==='duas/b'),true);assert.match(h.dialogs.at(-1).html,/1 van 2/);assert.match(h.dialogs.at(-1).html,/niet worden bevestigd/);
});
test('Empty selection, busy state and category changes prevent deletion',async()=>{
 const h=setup();await h.open([]);assert.equal(h.dialogs.length,0);h.context.busy=true;await h.open(['duas/a']);assert.equal(h.dialogs.length,0);h.context.busy=false;await h.open(['duas/a']);h.context.category='quran';await h.confirm();assert.equal(h.calls.length,0);
});
