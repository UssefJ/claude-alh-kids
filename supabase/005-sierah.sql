-- Al Himmah Kids 1.6. Sierah vervangt Vraag en antwoord.
-- 1) Voegt de categorie 'sierah' toe.
-- 2) Verhuist bestaande vragen (categorie 'vragen') naar Sierah, met behoud van volgorde, status en audio.
--    Elke Sierah-vraag heeft twee delen: [0] de vraag en [1] het antwoord, elk met Arabisch, fonetisch,
--    Nederlands en een eigen opname. Het oude antwoord (tekst + opname) wordt deel [1].
-- Veilig om opnieuw uit te voeren: al verhuisde vragen worden overgeslagen.
begin;
alter table public.ah_content drop constraint if exists ah_content_category_check;
alter table public.ah_content add constraint ah_content_category_check check(category in ('quran','duas','profeten','alfabet','levenslessen','gebed','wudu','aqieda','vragen','installeren','sierah'));
alter table public.ah_published drop constraint if exists ah_published_category_check;
alter table public.ah_published add constraint ah_published_category_check check(category in ('quran','duas','profeten','alfabet','levenslessen','gebed','wudu','aqieda','vragen','installeren','sierah'));

create or replace function pg_temp.ah_sierah_item(item jsonb) returns jsonb language sql immutable as $$
  select case when item is null or jsonb_typeof(item)<>'object' then item else
    (item - 'topic' - 'videoUrl')
    || jsonb_build_object(
      'category','sierah',
      'units',jsonb_build_array(
        jsonb_build_object('title','Vraag','ar','','phon','','nl',coalesce(item->>'title',''),'text','','start',0),
        jsonb_strip_nulls(jsonb_build_object(
          'title','Antwoord',
          'ar',coalesce(item->'units'->0->>'ar',''),
          'phon',coalesce(item->'units'->0->>'phon',''),
          'nl',coalesce(nullif(item->'units'->0->>'text',''),item->'units'->0->>'nl',''),
          'text','','start',0,
          'audio',item->'units'->0->'audio',
          'audioName',item->'units'->0->'audioName'))))
  end
$$;

alter table public.ah_content disable trigger ah_guard_draft;
alter table public.ah_published disable trigger ah_guard_publication;

insert into public.ah_content(key,category,sort_order,record,revision,updated_at)
select 'sierah/'||(c.record->'draft'->>'id'),'sierah',c.sort_order,
  jsonb_set(jsonb_set(jsonb_set(c.record,'{key}',to_jsonb('sierah/'||(c.record->'draft'->>'id'))),
    '{draft}',pg_temp.ah_sierah_item(c.record->'draft')),
    '{published}',coalesce(pg_temp.ah_sierah_item(c.record->'published'),'null'::jsonb)),
  c.revision+1,c.updated_at
from public.ah_content c
where c.category='vragen'
  and not exists(select 1 from public.ah_content s where s.key='sierah/'||(c.record->'draft'->>'id'));

insert into public.ah_published(key,category,sort_order,content,updated_at)
select 'sierah/'||(p.content->>'id'),'sierah',p.sort_order,pg_temp.ah_sierah_item(p.content),p.updated_at
from public.ah_published p
where p.category='vragen'
  and exists(select 1 from public.ah_content s where s.key='sierah/'||(p.content->>'id'))
  and not exists(select 1 from public.ah_published s where s.key='sierah/'||(p.content->>'id'));

delete from public.ah_content c where c.category='vragen'
  and exists(select 1 from public.ah_content s where s.key='sierah/'||(c.record->'draft'->>'id'));

alter table public.ah_content enable trigger ah_guard_draft;
alter table public.ah_published enable trigger ah_guard_publication;
commit;
