-- Al Himmah Kids 1.5. Alleen in het bestaande AL HIMMAH-project uitvoeren.
-- Voeg categorieën toe; behoud data, toegangsrechten en publicatiebeveiliging.
begin;
alter table public.ah_content drop constraint if exists ah_content_category_check;
alter table public.ah_content add constraint ah_content_category_check check(category in ('quran','duas','profeten','alfabet','levenslessen','gebed','wudu','aqieda','vragen','installeren'));
alter table public.ah_published drop constraint if exists ah_published_category_check;
alter table public.ah_published add constraint ah_published_category_check check(category in ('quran','duas','profeten','alfabet','levenslessen','gebed','wudu','aqieda','vragen','installeren'));
commit;
