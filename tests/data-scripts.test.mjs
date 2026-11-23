import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {PGlite} from '@electric-sql/pglite';
async function setup(){const db=new PGlite();
 await db.exec(`create role anon;create role authenticated;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth,public,storage to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;create table storage.buckets(id text primary key,name text,public bool,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id text,bucket_id text);alter table storage.objects enable row level security;grant all on storage.objects to authenticated;`);
 for(const f of ['001-server-v1','002-admin-workflow','003-new-categories','004-installatiehulp','005-sierah'])await db.exec(readFileSync(`supabase/${f}.sql`,'utf8'));return db;}
async function add(db,cat,id,order,extra={}){const d={id,category:cat,title:id,visible:true,definitive:true,units:[{title:'Zin 1',ar:'x',nl:'y',phon:'z',text:'',start:0}],...extra};
 await db.query(`insert into ah_content(key,category,sort_order,record) values($1,$2,$3,$4)`,[cat+'/'+id,cat,order,JSON.stringify({key:cat+'/'+id,order,draft:d,published:d,updated:'t',publishedAt:'t'})]);
 await db.query(`insert into ah_published(key,category,sort_order,content) values($1,$2,$3,$4)`,[cat+'/'+id,cat,order,JSON.stringify(d)]);}
test('006: wudu-afbeeldingen op volgorde, tweede keer verandert niets',async()=>{const db=await setup();try{
 for(let i=0;i<10;i++)await add(db,'wudu','s'+i,i,{image:{bucket:'ah-public',path:'oud'}});
 const sql=readFileSync('supabase/data/006-wudu-afbeeldingen.sql','utf8');await db.exec(sql);
 const rev1=(await db.query(`select sum(revision)::int n from ah_content`)).rows[0].n;await db.exec(sql);
 assert.equal((await db.query(`select sum(revision)::int n from ah_content`)).rows[0].n,rev1);
 const r=(await db.query(`select c.record, p.content from ah_content c join ah_published p using(key) where c.sort_order=7`)).rows[0];
 assert.equal(r.record.draft.imageUrl,'/assets/wudu/stap-08.webp');assert.equal(r.record.published.imageUrl,'/assets/wudu/stap-08.webp');assert.equal(r.content.imageUrl,'/assets/wudu/stap-08.webp');
 assert.equal(r.record.draft.image,undefined);assert.match(r.content.alt,/oren/);
}finally{await db.close()}});
test('007: gebed naar 19 zichtbare stappen, tweede keer verandert niets',async()=>{const db=await setup();try{
 const ids=['iqama','takbir','fatiha-1','ikhlas-1','ruku-1','rise-1','praise-1','sujud1-1','sit-1','sujud2-1','stand-second','fatiha-2','ikhlas-2','ruku-2','rise-2','praise-2','sujud1-2','sit-2','sujud2-2','tahiyyat','salam-right','salam-left'];
 for(const [i,id] of ids.entries())await add(db,'gebed',id,i);
 const sql=readFileSync('supabase/data/007-gebed-19-stappen.sql','utf8');await db.exec(sql);await db.exec(sql);
 const rows=(await db.query(`select key,sort_order,record from ah_content order by sort_order,key`)).rows;
 const at=k=>rows.find(r=>r.key==='gebed/'+k);
 assert.equal(at('recitatie-1').sort_order,4);assert.equal(at('recitatie-2').sort_order,14);assert.equal(at('ruku-1').sort_order,5);assert.equal(at('ruku-2').sort_order,15);assert.equal(at('salam-left').sort_order,23);assert.equal(at('salam-left').record.order,23);
 assert.equal(at('iqama').record.draft.visible,false);assert.equal(at('iqama').record.published,null);
 const pub=(await db.query(`select key,sort_order from ah_published order by sort_order`)).rows;assert.equal(pub.length,19);
 assert.deepEqual(pub.slice(0,3).map(p=>p.key),['gebed/takbir','gebed/recitatie-1','gebed/ruku-1']);
 assert.equal(at('recitatie-2').record.draft.units[0].ar,'');
}finally{await db.close()}});
