import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {PGlite} from '@electric-sql/pglite';
for(const category of ['wudu','aqieda','vragen'])test('Nieuwe categorie '+category+': rechten, revisies, publiceren, intrekken en verwijderen',async()=>{
 const db=new PGlite();try{
 await db.exec(`create role anon;create role authenticated;create schema auth;create schema storage;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth,public,storage to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;create table storage.buckets(id text primary key,name text,public bool,file_size_limit bigint,allowed_mime_types text[]);create table storage.objects(id text,bucket_id text);alter table storage.objects enable row level security;grant all on storage.objects to authenticated;`);
 await db.exec(readFileSync('supabase/001-server-v1.sql','utf8'));
 await db.exec(readFileSync('supabase/002-admin-workflow.sql','utf8'));
 await db.exec(readFileSync('supabase/003-new-categories.sql','utf8'));
 await db.exec(readFileSync('supabase/003-new-categories.sql','utf8'));
 const admin='00000000-0000-0000-0000-000000000001',other='00000000-0000-0000-0000-000000000002';
 await db.exec(`insert into auth.users values('${admin}'),('${other}');insert into ah_admins values('${admin}');set role anon;`);
 await assert.rejects(db.query('select * from ah_content'),/permission denied/);assert.equal((await db.query('select * from ah_published')).rows.length,0);
 await db.exec(`reset role;set role authenticated;select set_config('request.jwt.claim.sub','${other}',false)`);
 assert.equal((await db.query('select ah_is_admin() as ok')).rows[0].ok,false);
 await assert.rejects(db.query('insert into ah_admins values($1)',[other]),/permission denied/);
 await assert.rejects(db.query("insert into storage.objects values('x','ah-drafts')"),/row-level security/);
 const record={key:category+'/test',order:0,draft:{category,id:'test',title:'Test',definitive:true,visible:true,units:[{ar:'اختبار'}]},published:null};
 const save=(r,rev=null,pub=false,del=false)=>db.query('select ah_save($1,$2::jsonb,$3,$4,$5) as revision',[r.key,JSON.stringify(r),rev,pub,del]);
 await assert.rejects(save(record),/beheerders/);
 await db.exec(`select set_config('request.jwt.claim.sub','${admin}',false)`);
 assert.equal((await save(record)).rows[0].revision,1);assert.equal((await db.query('select * from ah_published')).rows.length,0);
 await db.query("insert into storage.objects values('x','ah-drafts')");
 record.published=structuredClone(record.draft);assert.equal((await save(record,1,true)).rows[0].revision,2);
 record.draft.title='Conceptwijziging';await save(record,2);assert.equal((await db.query('select content from ah_published')).rows[0].content.title,'Test');
 await assert.rejects(save(record,2),/elders gewijzigd/);
 await db.exec('reset role;set role anon');assert.equal((await db.query('select content from ah_published')).rows[0].content.title,'Test');
 await db.exec(`reset role;set role authenticated;select set_config('request.jwt.claim.sub','${admin}',false)`);
 record.draft.definitive=false;record.draft.visible=false;record.published=null;await save(record,3,false);assert.equal((await db.query('select * from ah_published')).rows.length,0);
 record.draft.visible=true;record.published={...record.draft,definitive:true};await assert.rejects(save(record,4,true),/Def/);record.draft.definitive=true;record.draft.units=[{ar:''}];record.published=structuredClone(record.draft);await save(record,4,true);assert.equal((await db.query('select * from ah_published')).rows.length,1);await save(record,5,false,true);assert.equal((await db.query('select * from ah_content')).rows.length,0);
 }finally{await db.close()}
});

