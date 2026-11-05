-- Alleen uitvoeren in een NIEUW Supabase-project voor Al Himmah Kids.
-- Deze migratie hoort niet bij Quwa.
begin;
create table if not exists public.ah_admins(user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.ah_admins enable row level security;
revoke all on public.ah_admins from anon, authenticated;
grant select on public.ah_admins to authenticated;
create policy ah_admin_self on public.ah_admins for select to authenticated using(user_id=(select auth.uid()));
create or replace function public.ah_is_admin() returns boolean language sql stable security invoker set search_path='' as $$ select exists(select 1 from public.ah_admins where user_id=(select auth.uid())) $$;
revoke all on function public.ah_is_admin() from public,anon;
grant execute on function public.ah_is_admin() to authenticated;
create table public.ah_content(
 key text primary key check(length(key)<200),
 category text not null check(category in ('quran','duas','profeten','alfabet','levenslessen','gebed')),
 sort_order integer not null default 0,
 record jsonb not null check(jsonb_typeof(record)='object'),
 revision bigint not null default 1,
 updated_at timestamptz not null default now()
);
create table public.ah_published(
 key text primary key references public.ah_content(key) on delete cascade,
 category text not null check(category in ('quran','duas','profeten','alfabet','levenslessen','gebed')),
 sort_order integer not null default 0,
 content jsonb not null check(jsonb_typeof(content)='object'),
 updated_at timestamptz not null default now()
);
alter table public.ah_content enable row level security;
alter table public.ah_published enable row level security;
revoke all on public.ah_content,public.ah_published from anon,authenticated;
grant select,insert,update,delete on public.ah_content,public.ah_published to authenticated;
grant select on public.ah_published to anon;
create policy ah_content_admin on public.ah_content for all to authenticated using((select public.ah_is_admin())) with check((select public.ah_is_admin()));
create policy ah_published_read on public.ah_published for select to anon,authenticated using(true);
create policy ah_published_admin on public.ah_published for all to authenticated using((select public.ah_is_admin())) with check((select public.ah_is_admin()));
create index ah_published_category_order on public.ah_published(category,sort_order,key);
create index ah_content_category_order on public.ah_content(category,sort_order,key);
-- Concept en publicatie veranderen samen in één transactie. Een verouderde editor wordt geweigerd.
create or replace function public.ah_save(p_key text,p_record jsonb,p_expected bigint default null,p_publish boolean default false,p_delete boolean default false)
returns bigint language plpgsql security invoker set search_path='' as $$
declare old_revision bigint; next_revision bigint; cat text; item jsonb;
begin
 if not public.ah_is_admin() then raise exception 'Alleen beheerders mogen wijzigen.' using errcode='42501'; end if;
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_key,0));
 select revision into old_revision from public.ah_content where key=p_key for update;
 if old_revision is distinct from p_expected then raise exception 'Dit onderdeel is elders gewijzigd. Herlaad de pagina voordat je opnieuw opslaat.' using errcode='40001'; end if;
 if p_delete then delete from public.ah_content where key=p_key; return 0; end if;
 cat:=p_record->'draft'->>'category';
 if p_record->>'key' is distinct from p_key or p_key is distinct from cat||'/'||(p_record->'draft'->>'id') then raise exception 'Ongeldige identiteit.'; end if;
 if jsonb_typeof(p_record->'draft'->'units') is distinct from 'array' or jsonb_array_length(p_record->'draft'->'units')<1 then raise exception 'Onderdelen ontbreken.'; end if;
 if length(p_record::text)>10000000 then raise exception 'Tekstpakket te groot.'; end if;
 next_revision:=coalesce(old_revision,0)+1;
 insert into public.ah_content(key,category,sort_order,record,revision) values(p_key,cat,coalesce((p_record->>'order')::int,0),p_record,next_revision)
 on conflict(key) do update set category=excluded.category,sort_order=excluded.sort_order,record=excluded.record,revision=excluded.revision,updated_at=now();
 if p_publish then
  item:=p_record->'published';
  if item is null or item='null'::jsonb then raise exception 'Publicatie ontbreekt.'; end if;
  if coalesce((item->>'visible')::boolean,false) then
   insert into public.ah_published(key,category,sort_order,content) values(p_key,cat,coalesce((p_record->>'order')::int,0),item)
   on conflict(key) do update set category=excluded.category,sort_order=excluded.sort_order,content=excluded.content,updated_at=now();
  else delete from public.ah_published where key=p_key;
  end if;
 end if;
 return next_revision;
end $$;
revoke all on function public.ah_save(text,jsonb,bigint,boolean,boolean) from public,anon;
grant execute on function public.ah_save(text,jsonb,bigint,boolean,boolean) to authenticated;
-- Verplaatsen werkt atomair en houdt publicatievolgorde gelijk aan beheervolgorde.
create or replace function public.ah_swap(a text,b text,rev_a bigint,rev_b bigint) returns void language plpgsql security invoker set search_path='' as $$
declare x public.ah_content; y public.ah_content;
begin
 if not public.ah_is_admin() then raise exception 'Geen toegang.' using errcode='42501'; end if;
 perform 1 from public.ah_content where key in(a,b) order by key for update;
 select * into x from public.ah_content where key=a; select * into y from public.ah_content where key=b;
 if x.key is null or y.key is null or x.category<>y.category or x.revision<>rev_a or y.revision<>rev_b then raise exception 'Volgorde is elders gewijzigd; herlaad.'; end if;
 update public.ah_content set sort_order=y.sort_order,record=jsonb_set(record,'{order}',to_jsonb(y.sort_order)),revision=revision+1 where key=a;
 update public.ah_content set sort_order=x.sort_order,record=jsonb_set(record,'{order}',to_jsonb(x.sort_order)),revision=revision+1 where key=b;
 update public.ah_published set sort_order=y.sort_order where key=a;
 update public.ah_published set sort_order=x.sort_order where key=b;
end $$;
revoke all on function public.ah_swap(text,text,bigint,bigint) from public,anon;
grant execute on function public.ah_swap(text,text,bigint,bigint) to authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('ah-drafts','ah-drafts',false,52428800,array['audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/wave','audio/mp4','audio/x-m4a','audio/aac','audio/ogg','audio/webm','audio/flac','audio/x-flac','audio/opus','image/png','image/jpeg','image/webp']),
 ('ah-public','ah-public',true,52428800,array['audio/mpeg','audio/mp3','audio/wav','audio/x-wav','audio/wave','audio/mp4','audio/x-m4a','audio/aac','audio/ogg','audio/webm','audio/flac','audio/x-flac','audio/opus','image/png','image/jpeg','image/webp'])
on conflict(id) do nothing;
create policy ah_media_admin on storage.objects for all to authenticated using(bucket_id in('ah-drafts','ah-public') and (select public.ah_is_admin())) with check(bucket_id in('ah-drafts','ah-public') and (select public.ah_is_admin()));
commit;
