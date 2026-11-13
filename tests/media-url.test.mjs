import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync('src/cloud.js','utf8').replace("import {createClient} from '@supabase/supabase-js';",'');
const context=vm.createContext({window:{},location:{href:'https://example.org/gebed/'},URL,Map});
vm.runInContext(source,context);
const {safeURL,mediaURL}=context.window.Cloud;

test('Missing or blank media never resolves to the page itself',()=>{
  for(const value of [undefined,null,'',' ','\n\t']){
    assert.equal(safeURL(value),'');
    assert.equal(mediaURL(value),'');
  }
});
test('Media URLs preserve supported paths and reject unsafe schemes',()=>{
  assert.equal(safeURL(' /assets/tahiyyat-boy.png '),'/assets/tahiyyat-boy.png');
  assert.equal(safeURL('../assets/prayer-poses.png'),'https://example.org/assets/prayer-poses.png');
  assert.equal(safeURL('https://example.org/image.png'),'https://example.org/image.png');
  for(const value of ['javascript:alert(1)','data:text/html,test'])assert.equal(safeURL(value),'');
});
