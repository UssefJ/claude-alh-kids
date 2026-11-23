# CLAUDE.md – Al Himmah Kids (kopie "Claude Alh Kids")

Overdracht voor een nieuwe Claude-sessie zonder voorgeschiedenis. Stand: 23-11-2026, HEAD na commit "Overdracht" (vorige: fb100ac).
Eigenaar: Nederlandstalig, geen programmeur ("leek"). Antwoord in het Nederlands, eenvoudige stappen, preview vóór ontwerpwijzigingen, live controleren na elke wijziging.
Menselijke versie van dit document: Docs-artifact "Al Himmah Kids – Overdrachtsdocument" (https://claude.ai/artifact/NgEi8VZcGgBwA761j9mAq8, alleen in het oude account).

## 0. Harde regels
- Werk ALLEEN in de kopie: repo `UssefJ/claude-alh-kids`, Supabase ref `pzbtdqdtkdsrlqbtoxbm`, Pages `claude-alh-kids`.
- Origineel NIET aanraken zonder expliciete opdracht: repo `UssefJ/alhimmah-kids` (commit 708372e, v1.5), Supabase ref `pwqbewmfkggwqqwnppba`, Pages `alhimmah-kids`.
- Quwa (Supabase-org `boovguwneurljoyarcqy`, gepauzeerd; Cloudflare Worker `quwa`) nooit aanraken.
- Nooit geheime sleutels (`sb_secret_…`, `service_role`), wachtwoorden of `.env` in repo/chat. Beheerderswachtwoord is onbekend voor Claude en blijft dat.
- De eigenaar wil dat projectinfo NIET in het gedeelde geheugen (memory) wordt opgeslagen.

## 1. Infrastructuur
| | Origineel (v1.5) | Kopie (v1.6) |
|---|---|---|
| Site | https://alhimmah-kids.pages.dev | https://claude-alh-kids.pages.dev |
| Beheer | /beheer/ | /beheer/ |
| GitHub | UssefJ/alhimmah-kids (privé) | UssefJ/claude-alh-kids (privé, branch main) |
| Supabase project | "Al Himmah Kids – Test" | "Claude Alh Kids" |
| Supabase ref | pwqbewmfkggwqqwnppba | pzbtdqdtkdsrlqbtoxbm |
| Publishable key | sb_publishable_eeyH_UujNQBm2nNX4xPrOg_uo2p-nkS | sb_publishable_BgzgFkqD62LNtV38wJa0gQ_yjMcvHRz |
| Migraties uitgevoerd | 001–004 | 001–005 + data/006 + data/007 |

- Supabase-org "Al Himmah Kids" id `jhbjpkkcoaydvotbfvqm`, Free plan, regio eu-west-3. Free = max 2 actieve projecten (nu beide AH-projecten actief; Quwa gepauzeerd, herstelbaar binnen 90 dagen na 22-11-2026).
- Beheerder kopie: y.jelti@outlook.com (auth.users + ah_admins). Signups uit. Auth Site URL nog NIET ingesteld (moet https://claude-alh-kids.pages.dev worden; dashboard → Authentication → URL Configuration).
- Cloudflare account "Y.jelti@outlook.com's Account". Pages-project (legacy Pages flow "Continue to Pages", Git-gekoppeld): production branch `main`, framework None, build `npm run build`, output `dist`, root leeg. Env: `NODE_VERSION=22`, `SUPABASE_URL=https://pzbtdqdtkdsrlqbtoxbm.supabase.co`, `SUPABASE_PUBLISHABLE_KEY=<publishable key kopie>`. Push naar main → live in ~1,5 min.
- Claude-tools: Supabase-MCP werkt (execute_sql, apply_migration — apply_migration vraagt de eigenaar om bevestiging; kan geen edge functions verwijderen of Auth-instellingen wijzigen). Cloudflare-MCP ("Workers Bindings", deprecated) kan Pages NIET beheren. GitHub via add_repo (push). De sandbox kan pages.dev en supabase.co NIET bereiken (proxy); live checks via de ingebouwde browser van de Claude-desktopapp (mcp__…Claude_Browser__) als die beschikbaar is.

## 2. Code
Statische site, geen framework. `public/` = site. `scripts/build.mjs`: kopieert public→dist, bundelt `src/cloud.js` (esbuild) → `dist/shared/cloud.js`, schrijft `dist/shared/config.js` (`window.ALHIMMAH_CONFIG={supabaseUrl,supabaseKey}`) uit env; vereist beide env vars tenzij `--preview`; weigert geheime sleutels.
Commando's: `npm ci` · `npm run check` (syntax alle JS) · `npm test` (34 tests, node:test + PGlite) · `node scripts/build.mjs --preview`.
`public/_headers`: strikte CSP (self + *.supabase.co + youtube-nocookie), no-cache.

Pagina's: `/` (index.html, app.js, style.css – 9 tegels) · `/alfabet/` · `/quran/` · `/leren/#duas|#profeten|#levenslessen` · `/gebed/` · `/ontdekken/#wudu|#aqieda|#installeren` (oude `#vragen` → /sierah/) · `/sierah/` (lijst + `#<id>` detail) · `/beheer/` (admin).
Gedeeld: `shared/banner.css` (laatst geladen, `?v=1.6e`), `shared/hero.js` (`?v=1.6e`, in head), `shared/cloud.js` → `window.Cloud` {listPublic, listAdmin, saveRecord, deleteRecord, swap, mediaURL, safeURL, signIn…}, `shared/player.js`, `shared/marked-player.js`, `shared/new-content.js`.
Assets: `assets/banner/` (logo-stichting.webp, logo-alhimmah-kids.webp, wolk-heel.webp 2137×405, wolk-smal.webp, wolken-maan.webp, tegel-sierah.webp), `assets/wudu/stap-01..10.webp`, `assets/fonts/fredoka-600/700.woff2` (+OFL), `assets/amiri-quran.ttf`.
Cache-busting: verhoog `?v=` op elke gewijzigde CSS/JS-link (geïnstalleerde PWA's).

### Banner/hero (1.6)
- Header: `html body header, html body header.banner{background:#004d4a}`; `<img class="brand-stichting" …logo-stichting.webp width=204 height=300><img class="brand-logo" …logo-alhimmah-kids.webp width=1200 height=198>`; theme-color #004d4a.
- hero.js wikkelt kinderen (behalve `.back`) van `section.hero` in `div.cloud` (MutationObserver), class `has-cloud`.
- `.cloud` = 9-slice via `border-image` (`wolk-heel.webp`, slice `228 497 143 520 fill`, widths × `--s`); `--s:.5` (≥1300px), `.46` (≤1299), `.36` (≤599, dan `wolk-smal.webp`, slice `228 239 143 251`, 100vw). Padding links 530×s (tekst weg van maan). Selector `html .hero.hero` (specificiteit tegen pagina-CSS). h1 Fredoka 700 met verloop + drop-shadow; p Fredoka 600. Fredoka-fallback voor ﷺ (U+FDFA) via Amiri.
- `.back` is pil (border #e8bd62, bg #fdf4df); ≥1300px absoluut links.

### Scroll (1.6)
`ontdekken/app.js`: `keepScroll()` = `!!(nid&&pc===nc&&(pid||nc==='wudu'))` → y0 herstellen; geen "Even laden…" binnen dezelfde categorie; `listCache` per categorie per bezoek (dus beheerwijzigingen pas zichtbaar na herladen app). `leren/app.js` en `sierah/app.js` vergelijkbaar (lastRoute / lastId+y0). `.wudu-image{height:min(380px,48vh)}` (vaste hoogte, geen sprong).

### Gebed (1.6)
`gebed/app.js`: helptekst onder knoppen weg; `#repeat-help`, `#status` `.visually-hidden`; `#arabic` verborgen als ar leeg, `#phon-toggle`/`#phon` verborgen als phon leeg; `.arabic[hidden]+.meaning` groter.

## 3. Database (public)
- `ah_admins(user_id)`, `ah_content(key pk "cat/id", category, sort_order, record jsonb, revision, updated_at)`, `ah_published(key fk, category, sort_order, content jsonb)`.
- RLS overal; `ah_is_admin()`; `ah_save(p_key,p_record,p_expected,p_publish,p_delete)` (revisiecontrole); `ah_swap(a,b,rev_a,rev_b)`.
- Triggers: `ah_guard_draft` (niet definitive → visible=false; niet visible → publicatie verwijderd, record.published=null) en `ah_guard_publication` (publiceren alleen als draft definitive+visible).
- Categorieën (check): quran, duas, profeten, alfabet, levenslessen, gebed, wudu, aqieda, vragen, installeren, sierah. (`vragen` bestaat nog in de check maar heeft 0 rijen.)
- Storage: `ah-drafts` (privé), `ah-public` (publiek); 50 MB, audio + png/jpeg/webp; paden = UUID's. Kopie: 3 + 8 objecten (audio/mpeg).
- Record: `{key, order, draft, published, updated, publishedAt}`; draft/published = `{id, category, title, visible, definitive, units:[{title, ar, nl, phon, text, start, audio?:{bucket,path}}], …}`. Verbergen = draft.visible=false.
- Per categorie extra velden: quran (surahNumber, subtitle, recitations, nameAudio) · duas (icon, instruction, source) · profeten/levenslessen (units met start+imageUrl, audio, duration) · alfabet (unit0 letter, unit1 woord) · gebed (group, whole, unit, instruction, pose 0–8 of imageUrl) · wudu (imageUrl, alt, één unit) · aqieda/installeren (videoUrl; installeren topic) · sierah (exact 2 units: [0] Vraag, [1] Antwoord; title = NL-vraag).
- Aantallen kopie (records/gepubliceerd): alfabet 28/28, aqieda 3/3, duas 15/15, gebed 24/19, levenslessen 10/10, profeten 50/50, quran 29/29, sierah 9/9, wudu 10/10 (totaal 178/173).

Migraties `supabase/`: 001-server-v1, 002-admin-workflow, 003-new-categories, 004-installatiehulp, 005-sierah (vragen → sierah, 2 units, split "vraag\n\nantwoord"; idempotent). Data `supabase/data/`: 006-wudu-afbeeldingen (op sort_order), 007-gebed-19-stappen (verberg iqama/fatiha-1/ikhlas-1/fatiha-2/ikhlas-2, schuif volgorde, voeg recitatie-1 @4 en recitatie-2 @14 toe). Alles idempotent en getest (tests/sierah-database, tests/data-scripts).

## 4. Werkwijze
1. Clone kopie, `npm ci`. 2. Bij ontwerp: eerst preview tonen, akkoord vragen. 3. Wijzig, `npm run check && npm test && node scripts/build.mjs --preview`. 4. `?v=` ophogen. 5. Commit + push main. 6. DB: SQL-bestand in supabase/ of supabase/data/, idempotent, test in PGlite, dan apply_migration/execute_sql op `pzbtdqdtkdsrlqbtoxbm`. 7. Live controleren (desktop/tablet/telefoon). 8. PWA verversen: app sluiten/heropenen.
Valkuilen: browserzoom (Ctrl+0) op nieuw domein; `record->'draft' - 'x'` heeft verkeerde voorrang → schrijf `(record->'draft') - 'x'::text`; data ophalen bij elke stap veroorzaakte scrollsprong.

## 5. Overzetten naar origineel (alleen op verzoek)
1. Code: merge/push claude-alh-kids `main` naar alhimmah-kids `main` (origineel = gemeenschappelijke voorouder 708372e, dus fast-forward mogelijk). Cloudflare-env van het origineel blijft wijzen naar pwqbewmfkggwqqwnppba.
2. DB origineel: eerst back-up (herstelset/export), dan 005-sierah.sql, data/006, data/007 uitvoeren op `pwqbewmfkggwqqwnppba`.
3. Sierah-vraag/antwoord-teksten die in de kopie handmatig zijn gesplitst (vragen 7–9) zitten al in 005 (split op lege regel).
4. Controleer live; Auth Site URL origineel ongemoeid.

## 6. Open punten
- Auth Site URL kopie instellen.
- Sierah: vragen 1–6 missen Arabisch/fonetisch; nog geen audio; enkele vragen zijn geen sira-onderwerp.
- Beheer-header niet in nieuwe stijl. Overzichtsafbeelding wudu ongebruikt.
- Origineel staat nog op 1.5 (zie §5).
- Quwa gepauzeerd: herstellen vóór ~20-02-2027, maar dan eerst een ander project pauzeren (limiet 2).
