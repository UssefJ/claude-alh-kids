-- 007 (data) – Gebed: van 22 naar 19 zichtbare stappen.
--  * verbergt (bewaart!) iqama, fatiha-1, ikhlas-1, fatiha-2, ikhlas-2 (draft.visible=false; trigger haalt publicatie weg)
--  * schuift de volgorde op en voegt twee korte stappen toe: recitatie-1 (volgorde 4) en recitatie-2 (volgorde 14)
--    "Al-Fatiha en een surah naar keuze", zonder Arabische tekst.
-- Uitgangspunt is de 1.5-volgorde: iqama 0, takbir 1, fatiha-1 2, ikhlas-1 3, ruku-1 4 … stand-second 10,
-- fatiha-2 11, ikhlas-2 12, ruku-2 13 … salam-left 21.
-- Idempotent: als gebed/recitatie-1 al bestaat, gebeurt er niets.
-- Uitgevoerd op de kopie (pzbtdqdtkdsrlqbtoxbm) op 23-11-2026.
-- Terugdraaien: zet visible weer op true in Beheer voor de verborgen stappen, verberg/verwijder recitatie-1/2
-- en zet de volgorde terug met de pijltjes.
begin;
do $$
declare
 stap jsonb;
 nu text := to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS.MS"Z"');
 r record;
begin
 if exists(select 1 from public.ah_content where key='gebed/recitatie-1') then
  raise notice '007 is al uitgevoerd; niets gedaan.'; return;
 end if;
 -- 1. verbergen
 update public.ah_content set record=jsonb_set(record,'{draft,visible}','false'::jsonb), revision=revision+1, updated_at=now()
  where key in ('gebed/iqama','gebed/fatiha-1','gebed/ikhlas-1','gebed/fatiha-2','gebed/ikhlas-2');
 -- 2. volgorde opschuiven (ruimte maken op 4 en 14)
 update public.ah_content set
   sort_order = sort_order + case when sort_order>=13 then 2 when sort_order>=4 then 1 else 0 end,
   record = jsonb_set(record,'{order}',to_jsonb(sort_order + case when sort_order>=13 then 2 when sort_order>=4 then 1 else 0 end)),
   revision=revision+1, updated_at=now()
  where category='gebed' and sort_order>=4;
 update public.ah_published p set sort_order=c.sort_order, updated_at=now()
  from public.ah_content c where c.key=p.key and p.category='gebed' and p.sort_order<>c.sort_order;
 -- 3. twee nieuwe stappen
 for r in select * from (values ('recitatie-1','Rakaʿah 1 van 2',4),('recitatie-2','Rakaʿah 2 van 2',14)) v(id,grp,ord) loop
  stap := jsonb_build_object(
   'id',r.id,'category','gebed','title','Al-Fatiha en een surah naar keuze','subtitle','',
   'group',r.grp,'unit','Zin','whole','Hele stap','pose',2,'imageUrl','','duration',420,
   'instruction','Leg je rechterhand over je linkerhand.','visible',true,'definitive',true,
   'units',jsonb_build_array(jsonb_build_object('title','Zin 1','ar','','phon','','text','','start',0,
     'nl','Reciteer surah Al-Fatiha en daarna een andere surah naar keuze.')));
  insert into public.ah_content(key,category,sort_order,record,revision)
   values('gebed/'||r.id,'gebed',r.ord,jsonb_build_object('key','gebed/'||r.id,'order',r.ord,'draft',stap,
     'published',stap,'updated',nu,'publishedAt',nu),1);
  insert into public.ah_published(key,category,sort_order,content) values('gebed/'||r.id,'gebed',r.ord,stap);
 end loop;
end $$;
commit;
-- Controle: select sort_order,key,record->'draft'->>'visible' from public.ah_content where category='gebed' order by 1;
--           select count(*) from public.ah_published where category='gebed';  -- verwacht 19
