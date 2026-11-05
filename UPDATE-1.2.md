# Servervariant 1.2 — surahoverzicht

Het goedgekeurde overzicht gebruikt afgeronde kaarten in de stijl van Levenslessen, een bijpassend gekleurd geluidsknopje per surah en bescheiden extra ruimte tussen de rijen. De titelwolk staat onder de banner. Het originele logo blijft behouden.

## Installeren
Vervang de bronbestanden in het bestaande Al Himmah GitHub-project door dit pakket (niet het Quwa-project). Laat de bestaande Cloudflare-instellingen en Supabase-omgevingsvariabelen staan en laat Cloudflare opnieuw bouwen. Nieuwe installatie: volg START-HIER.md. Er is geen extra SQL-migratie nodig. Bestaande teksten, publicaties en opnames blijven in Supabase bewaard.

## Naamopname toevoegen
Open /beheer/, kies Al-Quran en bewerk een surah. Bij **Uitspraak van de surahnaam** sleep je een korte opname van alleen de naam. Beluister deze in het beheer, sla het concept op en publiceer. De audio wordt via dezelfde beveiligde concept/publicatieroute opgeslagen als de andere opnames.

Het linker geluidsknopje speelt alleen deze naamopname. De grote kaart opent de surah. Opnieuw drukken stopt de naam; een andere naam, navigatie of verlaten van de pagina stopt de vorige. Zonder opname verschijnt een korte melding; er wordt geen stem gesimuleerd. Er worden geen naamopnames meegeleverd.
