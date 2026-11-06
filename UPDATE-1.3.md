# Al Himmah Kids — beheerupdate 1.3

Dit is een update voor jouw bestaande servervariant 1.2. Je hoeft geen nieuw GitHub-, Cloudflare- of Supabase-project te maken. Je huidige teksten, afbeeldingen en audio blijven in Supabase staan. Quwa wordt niet gewijzigd.

## Wat verandert er?

In het categorieoverzicht van alle zes categorieën krijgt elke regel:
- Def.: jouw handmatige goedkeuring. Aan = groene regel. Dit staat los van ingevulde velden. Wijzigingen in de tekst zetten dit niet automatisch uit.
- Zichtbaar: beschikbaar na publiceren. Aanvinken slaat de instelling op; Publiceren zet de inhoud online. Uitvinken trekt een bestaande publicatie meteen in.
- Publiceren: de opgeslagen inhoud van deze regel publiceren, zonder het bewerkscherm te openen.
- Pijlen omhoog/omlaag: één plaats verschuiven in de volledige categorievolgorde, ook in de kinderapp. Een zoekfilter verandert die volgorde niet.

Def. uitvinken schakelt ook Zichtbaar uit en trekt de publicatie in. De inhoud blijft bewaard. Alleen met Def. aan kun je zichtbaar maken of publiceren. In een geopend bewerkscherm worden vinkjes pas verwerkt bij Concept opslaan of Publiceren; in het overzicht worden ze direct opgeslagen.

Alles zichtbaar maken en Alles publiceren werken per categorie, ook voor onderdelen buiten het zoekfilter. Niet-definitieve regels worden overgeslagen. Alles zichtbaar maken publiceert nog niets: klik daarna op Alles publiceren. Na afloop zie je aantallen en eventuele fouten. Gelukte onderdelen blijven bewaard wanneer een ander onderdeel mislukt.

Lege Arabische tekst, vertaling, fonetische tekst en verhaaltekst blokkeren publiceren niet meer. Ontbrekende audio of afbeeldingen evenmin. Technisch ongeldige tijdmarkeringen bij reeds gekoppelde audio blijven een foutmelding geven om fout afspelen te voorkomen. Def. is geen automatische inhoudscontrole.

## Stap 1 — downloaden en uitpakken

1. Download alhimmah-beheerupdate-1.3.zip.
2. Rechtsklik in Windows en kies Alles uitpakken.
3. Open de uitgepakte map. Je ziet onder meer public, src en supabase.
4. Sluit tijdens de installatie je geopende beheerpagina's. Open ze na beide stappen opnieuw, zodat oude tabbladen niet met de nieuwe database werken.

## Stap 2 — Supabase bijwerken

1. Open Supabase en selecteer het bestaande Al Himmah Kids-project. Controleer dat je NIET in Quwa zit.
2. Open SQL Editor en maak een nieuwe query.
3. Open in de uitgepakte map supabase/002-admin-workflow.sql met Kladblok.
4. Kopieer de volledige inhoud en plak die in de nieuwe SQL-query.
5. Klik Run. Wacht op de succesmelding. Bij een fout: niet verdergaan; deel de foutmelding.
6. Voer 001-server-v1.sql NIET opnieuw uit. 002 is de enige benodigde database-update.

De update voegt controles toe op Def. en zichtbaarheid. Bestaande publiek zichtbare onderdelen worden éénmalig als eerder goedgekeurd gemarkeerd, zodat ze online blijven. Bestaande verborgen concepten krijgen Def. uit. Je kunt dit daarna zelf wijzigen. Teksten en bestanden worden niet verwijderd. 002 kan opnieuw worden uitgevoerd zonder bestaande Def.-keuzes te resetten.

## Stap 3 — bestanden op GitHub vervangen

1. Open je bestaande repository UssefJ/alhimmah-kids op GitHub, tab Code, branch main.
2. Klik op Add file → Upload files vanuit de HOOFDMAP van de repository, waar package.json staat.
3. Sleep alle inhoud uit de uitgepakte update-map naar het uploadvak: de mappen public, src, supabase en tests, plus package.json, package-lock.json en dit UPDATE-1.3.md bestand.
4. Sleep de inhoud van de map, niet de ZIP en niet een extra buitenste map met de naam alhimmah-beheerupdate-1.3.
5. Controleer dat bijvoorbeeld public/beheer/app.js precies op dat pad staat. GitHub vervangt bestanden met hetzelfde pad en voegt packages.js toe. Andere bestaande bestanden blijven staan.
6. Vul als omschrijving in: Beheerupdate 1.3 — definitief, overzichtsacties en pakketimport.
7. Klik Commit changes naar main.

Er zijn maar enkele bestanden in deze update. Je hoeft dus niet opnieuw alle afbeeldingen en andere bestanden van de volledige app te uploaden. Verwijder niets uit je repository.

## Stap 4 — Cloudflare en openen

1. De bestaande GitHub-koppeling van Cloudflare Pages hoort na de commit automatisch een nieuwe build te starten.
2. Open Workers & Pages → jouw Al Himmah PAGES-project → Deployments. Kies niet de oude mislukte Worker als die nog bestaat.
3. Wacht tot de deployment succesvol is. De bestaande buildinstellingen en Supabase-variabelen blijven gelijk.
4. Open je bestaande websiteadres gevolgd door /beheer/.
5. Ververs op Windows met Ctrl+Shift+R. In de zijbalk en bovenaan hoort nu versie 1.3 te staan.
6. Er is geen nieuwe login nodig om aan te maken; gebruik jouw bestaande beheeraccount.

## Stap 5 — kort testen

1. Open een categorie, bijvoorbeeld Al-Quran.
2. Vink bij een testonderdeel Def. aan: de regel wordt groen.
3. Vink Zichtbaar aan en klik Publiceren in diezelfde regel.
4. Ververs de kinderapp in een apart tabblad: het onderdeel hoort te verschijnen, ook als sommige teksten leeg zijn.
5. Vink Def. uit. Ververs de kinderapp: het onderdeel hoort weg te zijn; het concept blijft in beheer.
6. Probeer de pijlen en controleer de volgorde.
7. Vink zelf Def. aan bij de onderdelen die je wilt tonen. Klik Alles zichtbaar maken, sluit de melding, en klik Alles publiceren.

Bezoekers die de app al open hadden moeten mogelijk verversen om een ingetrokken of nieuwe publicatie te zien. Losse reeds openbare mediabestanden worden niet gewist bij intrekken van een publicatie.

## Meerdere kant-en-klare pakketten

Klik bovenaan de categorie op Pakketten importeren. Sleep meerdere JSON-bestanden tegelijk in het vak. Maximaal 50 bestanden, 5 MB per bestand en 20 MB samen. Vouw een bestand open om de inhoud te bekijken. Klik daarna Geldige pakketten als concept toevoegen. Elk pakket krijgt een nieuwe regel met Def. en Zichtbaar uit. De import overschrijft geen bestaande onderdelen; een dubbele titel krijgt '(import)' erbij.

Het eerder geleverde Al-Fatiha JSON-bestand blijft geschikt. Alle pakketten in een upload moeten bij de geopende categorie horen. Ongeldige bestanden worden afzonderlijk gemeld, geldige bestanden kunnen wel worden geïmporteerd. Audio en afbeeldingen upload je daarna via het bewerkscherm. Dit is tekstimport, geen ZIP-import met media.

Voor andere categorieën ondersteunt versie 1.3 onderstaand formaat. Vraag mij bijvoorbeeld: 'Maak drie Al Himmah-inhoudspakketten versie 1 voor profeten, geschikt voor beheerupdate 1.3.'

```json
{
  "format": "alhimmah-content",
  "version": 1,
  "category": "profeten",
  "title": "Profeet Noeh",
  "subtitle": "Een voorbeeldverhaal",
  "instruction": "",
  "source": "Bronvermelding",
  "duration": 420,
  "units": [
    {
      "title": "Deel 1",
      "text": "Hier komt het verhaal.",
      "ar": "",
      "nl": "",
      "phon": "",
      "alt": "Beschrijving van de later toe te voegen afbeelding",
      "start": 0
    }
  ]
}
```

Categoriecodes: profeten, levenslessen, duas, alfabet en gebed. Alfabet vereist precies twee delen (letter en voorbeeldwoord). Voor Quran blijft het bestaande alhimmah-surah-formaat versie 1 gelden. Er staat bij elke categorie ook een knop Voorbeeldformaat downloaden in het importvenster. Een sjabloon is geen afgeronde les.

## Controle en grenzen

17 geautomatiseerde tests controleren onder meer importvelden, lege inhoud met Def., intrekken van publicaties, rechten, revisieconflicten en audiospelers. JavaScript-syntax en de voorbeeldbuild zijn gecontroleerd. Overzichtsacties en volgorde zijn in een browser met testdata geprobeerd. De browserbestandskiezer liep vast bij de gezamenlijke uploadtest; het volledige uploadpad is daarom nog niet in de browser bevestigd. Het pakket is niet rechtstreeks in jouw accounts geïnstalleerd. Test na installatie één meervoudige upload in jouw beheeromgeving.
