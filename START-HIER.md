> Update 1.2: zie UPDATE-1.2.md voor het nieuwe surahoverzicht en de naamopnames. Voor een nieuwe installatie volg je onderstaande stappen.

# Al Himmah Kids — servervariant 1.1

Dit pakket combineert de kinderapp met de aparte beheeromgeving voor alle zes categorieën. De bestaande ontwerpen, afbeeldingen en basisteksten zijn meegenomen. Audio wordt door jou toegevoegd; er zijn geen recitaties of ingesproken verhalen in het pakket.

De website staat met dit pakket nog niet online. GitHub, Supabase en Cloudflare zijn in deze sessie niet gekoppeld. Onderstaande stappen plaats je in je bestaande accounts, telkens als een **nieuw project voor Al Himmah Kids**. Verander niets aan Quwa.

## Wat komt waar?

| Onderdeel | Plaats |
|---|---|
| Broncode | Nieuwe GitHub-repository `alhimmah-kids` |
| Publieke kinderapp | Nieuw Cloudflare Pages-project, op een eigen `pages.dev`-adres |
| Beheeromgeving | Hetzelfde adres met `/beheer/` erachter |
| Beheerderslogin | Supabase Auth, uitsluitend aangewezen beheerders |
| Concepten en publicaties | Twee afzonderlijke tabellen in het nieuwe Supabase-project |
| Conceptaudio en afbeeldingen | Privébucket `ah-drafts` in Supabase Storage |
| Gepubliceerde audio en afbeeldingen | Publieke bucket `ah-public` in Supabase Storage |

Er staat geen beheerknop in de kinderapp. Een verborgen URL is geen beveiliging: de database en opslag controleren daadwerkelijk of de gebruiker beheerder is. Bezoekers hebben geen account nodig.

## 1. Nieuw Supabase-project in je bestaande account

1. Open je bestaande Supabase-account en maak een nieuw project aan: **Al Himmah Kids**. Gebruik niet het project of de sleutels van Quwa.
2. Kies zelf een databasewachtwoord en bewaar dat in je wachtwoordmanager. Het hoort niet in deze website of in GitHub.
3. Open de SQL Editor van dit nieuwe project. Plak de volledige inhoud van `supabase/001-server-v1.sql` en voer die één keer uit. Dit maakt tabellen, functies, opslagbuckets en toegangsregels aan.
4. Schakel openbare registratie uit bij de instellingen van Supabase Auth. De app biedt geen registratie aan.
5. Maak in **Authentication → Users** via de beheerdersfunctie een gebruiker aan met je eigen e-mailadres en een sterk wachtwoord; bevestig het e-mailadres via de dashboardoptie. Deel het wachtwoord niet in de chat.
6. Voer daarna de volgende SQL uit, met jouw e-mailadres op de aangegeven plek. Hiermee wordt uitsluitend dit bestaande account beheerder:

```sql
insert into public.ah_admins(user_id)
select id from auth.users
where lower(email) = lower('JOUW-EIGEN-EMAILADRES')
on conflict do nothing;

select u.email
from public.ah_admins a
join auth.users u on u.id=a.user_id;
```

Controleer dat jouw e-mailadres in het resultaat staat. Als er niets staat, controleer of de Auth-gebruiker al bestaat en of het adres klopt. Gebruikers kunnen zichzelf niet tot beheerder maken.

7. Zoek bij de projectinstellingen de **Project URL** en de **publishable key**. Een oudere `anon`-sleutel werkt ook. Gebruik nooit `service_role`, `sb_secret_…` of het databasewachtwoord in de website.

## 2. Nieuwe GitHub-repository

Pak de ZIP uit. Maak in je bestaande GitHub-account een nieuwe private repository aan, bijvoorbeeld `alhimmah-kids`. Upload de inhoud van de map `alhimmah-server-v1` zodat `package.json`, `public/` en `START-HIER.md` direct in de hoofdmap staan. Commit de bestanden.

Upload geen `.env`, `node_modules` of lokaal gebouwde `dist`-map. De `.gitignore` sluit deze uit bij gebruik van Git. De geleverde `.env.example` bevat alleen lege voorbeelden en mag wel in GitHub.

Met Git op je computer kan dit ook:

```sh
git init
git add .
git commit -m "Al Himmah Kids servervariant 1.1"
git branch -M main
git remote add origin DE-URL-VAN-JE-NIEUWE-REPOSITORY
git push -u origin main
```

## 3. Nieuw Cloudflare Pages-project

Maak in je bestaande Cloudflare-account onder Workers & Pages een **Pages-project met Git-koppeling** aan. Selecteer alleen de nieuwe Al Himmah-repository.

| Instelling | Waarde |
|---|---|
| Production branch | `main` |
| Framework | Geen / None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Leeg, als package.json in de hoofdmap staat |
| Environment variable `NODE_VERSION` | `22` |
| Environment variable `SUPABASE_URL` | Project URL van Al Himmah |
| Environment variable `SUPABASE_PUBLISHABLE_KEY` | Publieke sleutel van Al Himmah |

Gebruik dezelfde waarden voor een eventuele Cloudflare previewomgeving als die bewust dezelfde database mag gebruiken. Een codepreview is anders óók een echte beheeromgeving voor die database; gebruik voor volledig geïsoleerde ontwikkeling een apart Supabase-testproject.

Deploy het project. Cloudflare geeft een `pages.dev`-adres: dit is de link die je later naar de stichting kunt sturen. Er is geen eigen domein nodig. Zet in Supabase Auth de Site URL op dat adres. De huidige login gebruikt e-mail en wachtwoord zonder e-maillink of redirectflow.

## 4. Eerste keer naar beheer

1. Open het Cloudflare-adres met `/beheer/` erachter en log in.
2. Kies in de zijkolom **Basisinhoud toevoegen**. De 122 basisrecords worden als verborgen concepten toegevoegd. Bestaande records worden overgeslagen; een eerder verwijderd basisonderdeel wordt bij opnieuw importeren opnieuw toegevoegd.
3. Kies een categorie en open een onderdeel.
4. Controleer de tekst en voeg audio/afbeeldingen toe via slepen of kiezen.
5. **Concept opslaan** bewaart centraal, zonder de kinderapp te wijzigen.
6. **Voorbeeld bekijken** toont je concept en gekoppelde audio.
7. Zet **Zichtbaar in de gepubliceerde kinderapp** aan en kies **Publiceren**. Controleer de bevestiging.
8. Open de kinderapp in een privévenster zonder login. Daar moet alleen de gepubliceerde versie staan.

Begin voor je presentatie met Al-Fatiha, één dua, het verhaal van Profeet Noeh, één levensles, enkele letters en een gebedsstap. De overige basisrecords kun je later aanvullen en publiceren. Veel surahs en profeten zijn bewust nog lege concepten; publiceren vereist tekst. De oorspronkelijke Al-Fatiha-basis bevat Arabisch; vertaling en fonetische tekst kun je aanvullen. De bestaande verhaalteksten, dua’s en gebedsstappen zijn voorbeelden voor inhoudelijke beoordeling, geen nieuwe geverifieerde uitgave.

Lokale wijzigingen en audiobestanden uit de oude testbeheeromgeving worden niet automatisch overgezet: die zitten in de browser op dat apparaat. Exporteer eventueel het bestaande surah-tekstpakket en importeer het hier; upload de oorspronkelijke audio en afbeeldingen opnieuw.

## Audio en afbeeldingen

- **Al-Quran:** upload één volledige opname voor normaal luisteren en eventueel één volledige opname voor samen reciteren. Open Ayah-tijden instellen, luister en klik per ayah op Begint hier. Begin- en optionele eindtijden zijn ook handmatig aanpasbaar. Test iedere ayah en bevestig de controle vóór publiceren. Hele surah, ayah voor ayah en selectie gebruiken dezelfde normale opname; samen reciteren gebruikt eigen markeringen.
- **Ad’ia:** één opname voor de volledige dua, eventueel een tweede voor samen reciteren.
- **Alfabet:** per letter een letteropname en een voorbeeldwoordopname, met optionele afbeelding.
- **Profeten en levenslessen:** één doorlopende verhaalopname; per verhaaldeel geef je de starttijd in seconden op. Bij 0 begint deel 1. De tekst en afbeelding wisselen op die tijdmarkeringen. De volgende knop springt naar het volgende deel in diezelfde opname.
- **Het gebed:** één opname per zin/ayah van een stap. Geheel luisteren gaat automatisch door de zinnen; zin voor zin speelt alleen de gekozen zin. De grote vorige/volgende-knoppen blijven voor gebedsstappen.

Gebruik bij voorkeur MP3 voor brede browserondersteuning en beperkte downloadgrootte. Maximaal 50 MB per bestand. Afbeeldingen: PNG, JPEG of WebP. De opslag accepteert ook andere gangbare audioformaten, maar niet iedere browser speelt iedere codec af. Test de daadwerkelijke bestanden op de presentatieapparaten.

Een ontbrekende opname wordt gemeld; de app speelt geen stille timerdemo. Een gebruiker kan ook zonder audio de tekst lezen. Repeat bij een selectie herhaalt alleen de gekozen ayat; bij een verhaal de volledige opname.

## Surah-pakketten en bewerken

De bestaande JSON-import/export is behouden. Kies **Surah-pakket importeren** in Al-Quran. Een pakket vult de Arabische tekst, vertaling en fonetische leeshulp in als nieuw verborgen concept. Bestaande surahs worden niet overschreven. De teksten blijven daarna gewoon bewerkbaar. Audio en tijdmarkeringen worden apart toegevoegd via de volledige opnames. Het JSON-tekstpakket bevat geen audio of markeringen.

## Beveiliging, onderhoud en doorgroei

- Alleen openbare sleutels zitten in de browser. Rechten worden in Supabase afgedwongen met RLS en beheerdercontrole; geen schrijfrechten voor bezoekers.
- Conceptbestanden zijn privé. Publiceren maakt afzonderlijke openbare kopieën. Een al gepubliceerd bestand kan via zijn URL toegankelijk blijven nadat je het onderdeel verbergt; verborgen maken trekt eerder gedownloade bestanden niet terug.
- Publicatie en conceptrecord worden samen transactioneel bijgewerkt. Een verouderde editor wordt geweigerd; herlaad bij de melding dat iemand anders het onderdeel veranderde.
- Verwijderen verwijdert het onderdeel, de publicatie en de huidige gekoppelde bestanden. Oude versies of afgebroken uploads kunnen ongebruikte bestanden achterlaten. Automatische periodieke opschoning en een prullenbak zijn nog niet opgenomen. Verwijder oude opslagobjecten alleen wanneer zeker is dat ze niet meer gebruikt worden.
- Maak vóór een belangrijke presentatie een database-export en kopie van je media. GitHub bewaart code, niet je Supabase-inhoud. Een automatische backup-/herstelprocedure moet voor officieel gebruik nog worden ingericht.
- De publieke app haalt per categorie gepubliceerde inhoud op en speelt media rechtstreeks uit Storage af. Er is geen realtimeverbinding per kind en geen volledige audiobibliotheek die vooraf gedownload wordt. Dit is een bruikbare basis voor doorgroei, geen bewijs dat gratis abonnementen duizenden gelijktijdige luisteraars aankunnen. Monitor verkeer, opslag, bandbreedte en kosten; test belasting en maak een betaal-/capaciteitsplan vóór brede uitrol.
- Controleer in jouw accounts of er voldoende gratis projectruimte beschikbaar is naast Quwa. Het pakket activeert geen betaald abonnement.
- Er is nog geen wachtwoord-vergetenpagina. Beheer herstel voorlopig via Supabase Auth. Configureer e-mail, herstel en aanvullende beheerdersbeveiliging voor officieel gebruik.
- `robots.txt` vraagt zoekmachines deze presentatieversie niet te indexeren. De kinderapp blijft publiek toegankelijk voor iedereen met de link.

## Lokaal bouwen en controleren

Node.js 22 of hoger:

```sh
npm ci
npm run check
npm test
```

Kopieer `.env.example` naar `.env` en vul alleen de publieke projectgegevens in. Bouw voor je server met:

```sh
node --env-file=.env scripts/build.mjs
```

Een build zonder databaseverbinding voor vormcontrole kan met `node scripts/build.mjs --preview`. Dat is geen aangesloten testomgeving. Open de bestanden via een lokale webserver, niet via dubbelklikken op HTML. De Cloudflare-build weigert ontbrekende gegevens of een geheime Supabase-sleutel.

## Uitgevoerde controle en resterende livecontrole

De JavaScript-syntax, bundelbuild en automatische tests voor afspelen, ayahmarkeringen en databasebeleid zijn lokaal gecontroleerd. De SQL is uitgevoerd in een lokale PostgreSQL-compatibele PGlite-test met nagebootste Supabase Auth/Storage-tabellen. De openbare schermen zijn met lokale basisgegevens visueel gecontroleerd. Dit vervangt geen live Supabase-integratietest.

Na installeren moet nog op jouw echte omgeving worden gecontroleerd: inloggen, uploaden, concept opslaan, publiceren, incognito afspelen, afbeeldingen, opnieuw laden, verbergen en verwijderen van een eigen testonderdeel. Test ook dat een niet-beheerder geen concepten kan lezen of wijzigingen kan schrijven. De echte Cloudflare-headers, CDN, Supabase Storage, sessievernieuwing en netwerkfouten zijn pas daar volledig te beoordelen.

Officiële documentatie: [Cloudflare Pages Git-koppeling](https://developers.cloudflare.com/pages/configuration/git-integration/), [buildinstellingen](https://developers.cloudflare.com/pages/configuration/build-configuration/), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals).
