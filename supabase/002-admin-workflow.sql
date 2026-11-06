-- Al Himmah Kids 1.3. Uitvoeren in het BESTAANDE Al Himmah-project, niet Quwa.
-- Bestaande publicaties gelden als eerder goedgekeurd; concepten blijven niet-definitief.
begin;
update public.ah_content c set record=jsonb_set(c.record,'{draft,definitive}',to_jsonb(exists(select 1 from public.ah_published p where p.key=c.key))),revision=revision+1
where not (c.record->'draft' ? 'definitive');
update public.ah_content set record=jsonb_set(record,'{published,definitive}','true'::jsonb)
where jsonb_typeof(record->'published')='object' and not(record->'published' ? 'definitive');
update public.ah_published set content=jsonb_set(content,'{definitive}','true'::jsonb) where not(content ? 'definitive');
update public.ah_content set record=jsonb_set(record,'{draft,visible}','false'::jsonb) where record->'draft'->'definitive' is distinct from 'true'::jsonb;
create or replace function public.ah_guard_draft() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.record->'draft'->'definitive' is distinct from 'true'::jsonb then
  new.record:=jsonb_set(new.record,'{draft,visible}','false'::jsonb);
 end if;
 if new.record->'draft'->'visible' is distinct from 'true'::jsonb then
  delete from public.ah_published where key=new.key;
  new.record:=jsonb_set(jsonb_set(new.record,'{published}','null'::jsonb),'{publishedAt}','null'::jsonb);
 end if;
 return new;
end $$;
drop trigger if exists ah_guard_draft on public.ah_content;
create trigger ah_guard_draft before insert or update on public.ah_content for each row execute function public.ah_guard_draft();
create or replace function public.ah_guard_publication() returns trigger language plpgsql security invoker set search_path='' as $$
begin
 if new.content->'definitive' is distinct from 'true'::jsonb or new.content->'visible' is distinct from 'true'::jsonb or not exists(select 1 from public.ah_content where key=new.key and record->'draft'->'definitive'='true'::jsonb and record->'draft'->'visible'='true'::jsonb) then
  raise exception 'Vink eerst Def. en Zichtbaar aan voordat je publiceert.';
 end if;
 return new;
end $$;
drop trigger if exists ah_guard_publication on public.ah_published;
create trigger ah_guard_publication before insert or update on public.ah_published for each row execute function public.ah_guard_publication();
commit;
