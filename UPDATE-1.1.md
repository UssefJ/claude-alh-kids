# Servervariant 1.1 — volledige Quran-opnames

## Nieuwe installatie

Gebruik START-HIER.md. Dit is het complete programma, inclusief alle zes categorieën, beheer, afbeeldingen, database-inrichting en buildbestanden. Er is geen ouder pakket nodig.

## Als servervariant 1 al online staat

1. Bewaar een backup van je huidige code, database en media.
2. Vervang in je Al Himmah GitHub-repository de bestanden met die uit dit pakket. Bewaar je eigen omgevingsvariabelen en eventuele eigen wijzigingen. Upload geen node_modules, dist of .env.
3. Cloudflare bouwt opnieuw met `npm run build`, uitvoermap `dist`. De bestaande publieke Supabase-instellingen blijven gelijk.
4. **Er is geen nieuwe SQL-migratie nodig. Voer 001-server-v1.sql niet opnieuw uit op een bestaande installatie.** De tijdmarkeringen passen in de bestaande JSON-inhoud; login en opslagrechten blijven gelijk.
5. Open /beheer/ en voer onderstaande stappen per surah uit. Eerder gepubliceerde losse ayahopnames blijven als terugval werken totdat je de volledige opname publiceert.

## Werkwijze per surah

1. Voeg eerst de juiste ayat en teksten toe.
2. Sleep een volledige opname naar Hele surah, maximaal 50 MB.
3. Kies Ayah-tijden instellen. Gebruik de audiospeler om de opname te beluisteren.
4. Klik bij iedere ayah op Begint hier. Vul eventueel tijden direct in seconden in (bijvoorbeeld 12.35).
5. Een lege eindtijd gebruikt de volgende begintijd of, voor de laatste ayah, de opnameduur. Een eigen eerdere eindtijd verkort de stilte bij losse-ayahoefening en bij het einde van een selectie. Hele surah blijft inclusief pauzes van het begin tot het echte bestandseinde afspelen.
6. Vul alle begintijden in en gebruik Test ayah om de grenzen te beluisteren. Markeer in een stilte tussen ayat, niet midden in een klank.
7. Bevestig dat je alle grenzen hebt gecontroleerd en kies Markeringen toepassen.
8. Herhaal dit voor Samen reciteren met de eigen volledige opname. Plaats de volgende begintijd pas wanneer de volwassene de volgende ayah begint; tijdens de herhaling door het kind blijft dezelfde ayah staan.
9. Sla het concept op. Gebruik Voorbeeld bekijken om hele surah, losse ayat, samen reciteren, selectie en repeat te testen. Publiceer daarna.

Markeringen wijzigen geen audiobestand: ze bepalen alleen welk gedeelte speelt en welke tekst zichtbaar is. Na vervanging van audio of wijziging van aantal/volgorde van ayat moet je opnieuw controleren. Concepten mogen onvolledig opgeslagen worden; publiceren met ongeldige of onbevestigde markeringen wordt door de beheeromgeving geweigerd.

## Opslag en bestaande bestanden

Er worden geen nieuwe losse ayahbestanden aangemaakt. Wel blijft de bestaande scheiding tussen een private conceptopname en een openbare publicatiekopie bestaan. Opslag is dus niet letterlijk één fysiek bestand per surah: normaal en samen reciteren hebben elk een eigen opname, met daarnaast de concept/publicatiekopieën.

Gebruik eventueel Losse ayahkoppelingen verwijderen nadat je de volledige opnames hebt gecontroleerd. Dit verwijdert alleen de verwijzingen uit je concept. Oude media kunnen nog in Storage staan en worden niet automatisch gewist; verwijder ze alleen nadat je zeker weet dat geen concept of publicatie ze gebruikt. De besparing voor oude bestanden ontstaat pas na veilige opschoning. Nieuwe surahs hoeven geen losse fragmenten meer te hebben.

## Bekende grenzen en livecontrole

- De huidige uploadlimiet blijft 50 MB per bestand. Voor zeer lange opnames moet je een kleiner audiobestand maken of later de upload- en opslaglimieten passend verhogen.
- Gebruik bij voorkeur MP3 en test de daadwerkelijke codering op telefoon, tablet en computer. Sneller zoeken in lange bestanden hangt af van de browser en de ondersteuning voor gedeeltelijke downloads door de opslagdienst.
- De browser controleert de afspeelpositie frequent en pauzeert bij de ingestelde eindgrens. Dit is geen garantie van sample-nauwkeurig stoppen onder alle apparaatbelasting. Markeer in een korte stilte en luister de grenzen na. De kinderapp pauzeert bij het verlaten/verbergen van het tabblad.
- De tekstpakketten bevatten nog steeds alleen tekst; audio en markeringen worden centraal via de beheerpagina opgeslagen.
- Lokaal getest: 14 automatische tests, syntax en bundelbuild. Ook zijn de nieuwe beheerschermen en afspeelbediening met technische testaudio gecontroleerd. Geen echte Supabase-accountkoppeling of mobiele apparaatmatrix is getest.
- Test na deployment: upload → markeren → concept opslaan → herladen → voorbeeld → publiceren → anoniem afspelen. Controleer daarna repeat, selectie, pauzeren, de laatste ayah en de aparte samen-reciteeropname.

Je bestaande Quwa-project hoeft niet aangepast te worden.
