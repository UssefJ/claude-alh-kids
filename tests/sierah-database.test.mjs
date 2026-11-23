import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {PGlite} from '@electric-sql/pglite';
test('Sierah: vragen verhuizen met volgorde, status en audio; tweede keer uitvoeren verandert niets',async()=>{
 const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth,public,storage to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;create table storage.buckets(id text primary key,name text,public bool,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id text,bucket_id text);alter table storage.objects enable row level security;grant all on storage.objects to authenticated;`);
 for(const f of ['001-server-v1','002-admin-workflow','003-new-categories','004-installatiehulp'])await db.exec(readFileSync(`supabase/${f}.sql`,'utf8'));
 const item=(id,title,extra={})=>({id,category:'vragen',title,topic:'De Profeet Mohammed',visible:true,definitive:true,source:'bron',units:[{ar:'',nl:'',phon:'',text:'Antwoord '+title,start:0,title:'',...extra}]});
 const a=item('a','Waar is de Profeet geboren?',{audio:{bucket:'ah-public',path:'x1'}}),b=item('b','Wanneer is de Profeet geboren?'),c={...item('c','Concept'),visible:false,definitive:false};
 const rec=(d,pub)=>JSON.stringify({key:'vragen/'+d.id,order:0,draft:d,published:pub?d:null,updated:'t',publishedAt:pub?'t':null});
 await db.query(`insert into ah_content(key,category,sort_order,record,revision) values('vragen/a','vragen',2,$1,3),('vragen/b','vragen',1,$2,1),('vragen/c','vragen',3,$3,1)`,[rec(a,true),rec(b,true),rec(c,false)]);
 await db.query(`insert into ah_published(key,category,sort_order,content) values('vragen/a','vragen',2,$1),('vragen/b','vragen',1,$2)`,[JSON.stringify(a),JSON.stringify(b)]);
 const sql=readFileSync('supabase/005-sierah.sql','utf8');await db.exec(sql);await db.exec(sql);
 const content=(await db.query(`select key,category,sort_order,revision,record from ah_content order by sort_order`)).rows;
 assert.deepEqual(content.map(r=>[r.key,r.category,r.sort_order]),[['sierah/b','sierah',1],['sierah/a','sierah',2],['sierah/c','sierah',3]]);
 const ra=content[1].record;assert.equal(ra.key,'sierah/a');assert.equal(ra.draft.category,'sierah');assert.equal(ra.draft.units.length,2);
 assert.equal(ra.draft.units[0].nl,'Waar is de Profeet geboren?');assert.equal(ra.draft.units[1].nl,'Antwoord Waar is de Profeet geboren?');
 assert.deepEqual(ra.draft.units[1].audio,{bucket:'ah-public',path:'x1'});assert.equal(ra.draft.topic,undefined);assert.equal(ra.published.category,'sierah');
 assert.equal(content[2].record.published,null);assert.equal(content[2].record.draft.visible,false);
 const pub=(await db.query(`select key,category,content from ah_published order by sort_order`)).rows;
 assert.deepEqual(pub.map(r=>r.key),['sierah/b','sierah/a']);assert.equal(pub[1].content.units[1].audio.path,'x1');
 assert.equal((await db.query(`select count(*)::int n from ah_content where category='vragen'`)).rows[0].n,0);
 const triggers=(await db.query(`select tgname,tgenabled from pg_trigger where tgname like 'ah_guard%'`)).rows;assert.ok(triggers.every(t=>t.tgenabled==='O'));
 }finally{await db.close()}
});
