import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
const ctx={module:{exports:{}}};vm.runInNewContext(readFileSync('public/shared/player.js','utf8'),ctx);const {SequencePlayer}=ctx.module.exports;
class FakeAudio{constructor(src){this.src=src;this.currentTime=0}async play(){this.paused=false}pause(){this.paused=true}removeAttribute(){}load(){}}
const make=(extra={})=>new SequencePlayer({AudioClass:FakeAudio,tracks:['one','two','three'],...extra});
test('Gehele reeks volgt werkelijk ended, niet een timer',async()=>{const p=make();await p.play(0,{first:0,last:2});p.audio.onended();assert.equal(p.index,1);p.audio.onended();assert.equal(p.index,2);p.audio.onended();assert.equal(p.playing,false)});
test('Selectie herhaalt uitsluitend gekozen bereik',async()=>{const p=make();await p.play(1,{first:1,last:2,repeat:true});p.audio.onended();assert.equal(p.index,2);p.audio.onended();assert.equal(p.index,1)});
test('Enkele ayah herhaalt zichzelf',async()=>{const p=make();await p.play(1,{single:true,repeat:true});p.audio.onended();assert.equal(p.index,1);assert.equal(p.playing,true)});
test('Pauzeren bewaart de positie; oude callbacks kunnen niet doorgaan',async()=>{const p=make();await p.play(0,{last:2});const stale=p.audio.onended;p.audio.currentTime=3;p.pause();stale();assert.equal(p.index,0);await p.play(0);assert.equal(p.audio.currentTime,3)});
test('Ontbrekende audio stopt de reeks met melding',async()=>{let error='';const p=make({tracks:['one',''],onError:m=>error=m});await p.play(0,{last:1});p.audio.onended();assert.equal(p.playing,false);assert.match(error,/geen opname/)});
