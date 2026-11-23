-- 006 (data) – Wudu: koppel per stap een eigen afbeelding.
-- Vereist: de bestanden public/assets/wudu/stap-01.webp … stap-10.webp staan op de site (commit 80e72b3).
-- Werkt op volgorde (sort_order 0–9 van categorie wudu), niet op key: de keys verschillen per project.
-- Idempotent: nogmaals uitvoeren verandert niets (revisie gaat alleen omhoog als er iets verandert).
-- Uitgevoerd op de kopie (pzbtdqdtkdsrlqbtoxbm) op 23-11-2026. NIET op het origineel tenzij bewust overgezet.
begin;
with img(n, alt) as (values
 (0,'Een jongen staat bij een schaal met water en begint met Bismillah'),
 (1,'Een jongen wast zijn handen boven de schaal met water'),
 (2,'Een jongen spoelt zijn mond met water uit zijn hand'),
 (3,'Een jongen maakt zijn neus schoon boven de schaal'),
 (4,'Een jongen wast zijn gezicht met beide handen'),
 (5,'Een jongen wast zijn arm tot aan de elleboog'),
 (6,'Een jongen strijkt met natte handen over zijn hoofd'),
 (7,'Een jongen veegt zijn oren met zijn vingers, van achteren gezien'),
 (8,'Een jongen zit op een krukje en wast zijn voet boven de schaal'),
 (9,'Een jongen staat klaar naast de schaal na de wudu')
), want as (
 select c.key, jsonb_build_object('imageUrl', format('/assets/wudu/stap-%s.webp', lpad((i.n+1)::text,2,'0')), 'alt', i.alt) patch
 from public.ah_content c join img i on i.n=c.sort_order where c.category='wudu'
), upd as (
 update public.ah_content c set
  record = jsonb_set(
     jsonb_set(c.record,'{draft}',((c.record->'draft') - 'image'::text) || w.patch),
     '{published}', case when jsonb_typeof(c.record->'published')='object' then ((c.record->'published') - 'image'::text) || w.patch else c.record->'published' end),
  revision = c.revision+1, updated_at = now()
 from want w
 where c.key=w.key and (c.record->'draft'->>'imageUrl' is distinct from w.patch->>'imageUrl' or c.record->'draft'->>'alt' is distinct from w.patch->>'alt')
 returning c.key
)
update public.ah_published p set content = (p.content - 'image'::text) || w.patch, updated_at = now()
from want w where p.key=w.key and (p.content->>'imageUrl' is distinct from w.patch->>'imageUrl' or p.content->>'alt' is distinct from w.patch->>'alt');
commit;
-- Controle: select sort_order, record->'draft'->>'imageUrl' from public.ah_content where category='wudu' order by 1;
