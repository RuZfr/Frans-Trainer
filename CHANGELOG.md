# Changelog

## v1.15.2 — New Logo Refresh
- Volledig nieuw logo ontworpen voor Frans Trainer
- Nieuw app-icoon en favicon in dezelfde stijl
- Splashtekst aangepast naar “snel Frans oefenen”
- Cacheversie verhoogd naar v1.15.2


## v1.15.1 — Logo & Splash Fix
- Nieuw statisch logo met golvend Frans vlagje
- Bewegende logo-animatie verwijderd in header en splashscreen
- Splashtekst verkort naar “Gemakkelijk Frans oefenen”
- Splashscreen blijft langer zichtbaar zodat de tekst leesbaar is, ook op telefoon
- App-iconen en favicon afgestemd op het nieuwe logo
- Cacheversie verhoogd naar v1.15.1


## v1.15.0 — Stability Fix
- PWA/offline-cache hersteld voor bestanden met `?v=` cache-busting
- Alle appversies gelijkgetrokken naar v1.15.0
- Schriftelijke antwoorden negeren nu onbelangrijke eindleestekens zoals `?`, `!` en `.`
- Feedback blijft automatisch langer zichtbaar wanneer er uitleg, alternatieven of een lang correct antwoord staat
- Sessieresultaat start opnieuw bij elke nieuwe app-sessie en wordt niet meer permanent opgeslagen
- “Alleen moeilijke woorden” valt niet meer stilletjes terug op alle woorden wanneer er geen moeilijke woorden zijn
- De knop meldt nu duidelijk “Nog geen moeilijke woorden” en is dan uitgeschakeld
- Bij het wegwerken van het laatste moeilijke woord schakelt de app automatisch terug naar alle woorden
- Overbodige kale duplicaten bij zelfstandige naamwoorden uit de ingebouwde woordenbank verwijderd
- Dubbele apostrofvarianten zoals `'s morgens` / `’s morgens` opgeschoond zonder de antwoordacceptatie te beperken
- Geautomatiseerde regressiecontroles toegevoegd tijdens de build


## v1.14.0 — Branding Pack
- Nieuw Frans Trainer-logo ontworpen als vector (SVG)
- App-iconen voor telefoon en installatie vernieuwd
- Mooiere interface-iconen voor thema, instellingen en sluiten
- Favicon toegevoegd als SVG en ICO
- Start-splashscreen toegevoegd met logo en korte welkomsttekst
- Subtiele animaties toegevoegd voor logo, app, kaart en bediening
- Manifest- en themakleuren opgefrist voor betere PWA-weergave
- Offline-cache uitgebreid met alle nieuwe branding-assets


## v1.13.0 — Automatische beoordeling schriftelijk
- In schriftelijke modus zijn “Moeilijk” en “Weet ik” volledig verborgen
- Een antwoord dat meteen juist is wordt automatisch als “Weet ik” verwerkt
- Een fout antwoord wordt automatisch als “Moeilijk” verwerkt
- “Bijna juist” behoudt één herkansing
- Een woord dat pas na de herkansing juist is, blijft als moeilijk gemarkeerd zodat het later terugkomt
- Na beoordeling gaat de app automatisch naar het volgende woord
- Correct antwoord blijft kort zichtbaar; bij een fout blijft de juiste oplossing iets langer zichtbaar
- Pijltjestoetsen voor zelfbeoordeling werken alleen nog bij flitskaartjes
- Cacheversie verhoogd naar v1.13.0


## v1.12.0 — Visual Refresh
- Oefenscherm visueel grondig vernieuwd zonder de oefenlogica te wijzigen
- Compacte header met herkenbaar Frans Trainer-logo
- Thema- en instellingenknoppen rustiger gegroepeerd
- Oefeninstellingen als compacte, duidelijke velden vormgegeven
- Rustigere voortgangszone
- Nieuwe oefenkaart met subtiele Franse driekleur
- Feedback voor juist, bijna juist en fout duidelijker maar vriendelijker weergegeven
- Knoppen voor “Moeilijk” en “Weet ik” minder zwaar en consistenter gemaakt
- Schriftelijk oefenen visueel verfijnd
- Instellingenpaneel opgefrist
- Mobiele layout speciaal aangescherpt voor kleinere smartphones
- Cacheversie verhoogd naar v1.12.0


## v1.11.0 — Feedback, categorieën & import
- “Bijna juist” strenger gemaakt: alleen nog echte kleine fouten krijgen één herkansing
- Korte antwoorden van 1–3 tekens worden niet meer door een gewone tikfout automatisch “bijna juist”
- Hints bij lidwoord/accent geven richting zonder het antwoord vooraf weg te geven
- Na een geslaagde herkansing: “Goed verbeterd!”
- Correcte alternatieve vertalingen blijven volledig juist
- Lidwoord mag bij zelfstandige naamwoorden in beide talen ontbreken; de volledige vorm wordt als leermoment getoond
- Nieuwe categoriefilter voor oefenen binnen één categorie
- Categorieën uit eigen geïmporteerde lijsten verschijnen automatisch
- JSON/CSV-import teruggebracht en uitgebreid, volledig achter Instellingen
- Import controleert verplichte velden, duplicaten en ontbrekende lidwoorden bij zelfstandige naamwoorden
- Eigen woordenlijsten kunnen verwijderd worden
- Voorbeeld-CSV toegevoegd


## v1.10.0 — ThemaBoost
- 14 nieuwe jeugdvriendelijke woordenlijsten
- 336 nieuwe Franse woorden en uitdrukkingen
- 518 leeritems in totaal inclusief de basiswoordenschat
- Korte, aantrekkelijke thematitels met alledaagse A1-A2-woordenschat
- Zelfstandige naamwoorden met Frans en Nederlands lidwoord
- Veelvoorkomende alternatieve vertalingen en korte contextnotities
- Alle nieuwe lijsten beschikbaar in de offline-cache


## v1.8.6
- Bestaande basiswoordenbank van 182 woorden inhoudelijk nagezien
- Extra correcte Nederlandse vertalingen toegevoegd
- `la chambre` gecorrigeerd naar hoofdvertaling `de kamer`
- Extra uitleg toegevoegd bij woorden met meerdere gangbare betekenissen
- Franse én Nederlandse lidwoorden zijn bij zelfstandige naamwoorden optioneel in schriftelijke antwoorden
- Weggelaten lidwoord = Juist + korte uitleg van de volledige vorm
- Verkeerd lidwoord = Bijna juist + één gerichte herkansing
- Accentfouten en kleine tikfouten behouden één motiverende herkansing
- Reviewdocument `WORDLIST_REVIEW.md` toegevoegd


## v1.8.5
- Telefoon-/startschermicoon volledig vernieuwd
- Nieuw app-icoon sluit visueel beter aan bij het logo in de app
- Witte middenstrook van de Franse vlag blijft zichtbaar door donkere omlijning
- `apple-touch-icon` toegevoegd voor betere weergave op iPhone
- Manifest-iconen gemarkeerd als `any maskable`


## v1.8.4
- Startfout na toevoegen van instellingenknop opgelost
- Instellingenlogica wordt nu pas gekoppeld nadat de DOM beschikbaar is
- Bestaande oefenlogica ongemoeid gelaten
- Cacheversie verhoogd


## v1.8.3
- Kleine instellingenknop (⚙️) rechtsboven toegevoegd
- Compact instellingenpaneel toegevoegd
- Paneel sluit via ✕, klik buiten het paneel of Escape
- Oefenfunctionaliteit verder ongewijzigd gelaten


## v1.8.2 Stable
- Startup en woordenlijst-loader volledig nagezien
- Oude PWA-cache wordt tijdens Live Server automatisch verwijderd
- Service worker is uitgeschakeld tijdens lokale ontwikkeling
- JSON-bestanden worden gecontroleerd op HTTP-status en content-type
- Duidelijke foutmelding bij verkeerd gestarte Live Server
- Cache-busting toegevoegd aan CSS en JavaScript
- Service worker geeft geen HTML meer terug voor ontbrekende JSON/JS-bestanden


## v1.8.1
- Startfout van v1.8.0 opgelost
- Woorden worden pas gekozen nadat de JSON-woordenlijst geladen is
- Herkansingsstatus gecorrigeerd
- Extra beveiliging toegevoegd voor lege woordenlijsten
- Service-worker cacheversie verhoogd


## v1.8.0
- Woordenlijsten losgekoppeld van de programmacode
- Nieuwe map `data/lists/` met JSON-woordenlijsten
- Automatische woordenlijstkeuze in de app
- Ondersteuning voor meerdere woordenlijsten en “Alle woordenlijsten”
- Gekozen woordenlijst wordt lokaal onthouden
- Bestaande voortgang blijft zoveel mogelijk compatibel
- README bevat een eenvoudig formaat om nieuwe lijsten toe te voegen
- Offline-cache aangepast aan de nieuwe structuur


## v1.7.2
- Eén herkansing alleen bij echte kleine fouten
- Geen “Bijna juist” meer bij volledig foute antwoorden
- Nederlandse de/het-varianten blijven volledig juist
- Gerichte feedback bij accent, Frans lidwoord en kleine tikfout
- Na fout antwoord wordt het correcte antwoord meteen getoond


## v1.7.0 – Quality Words
- Volledig nieuwe, gecontroleerde basiswoordenbank met 182 veelgebruikte woorden en uitdrukkingen.
- Nederlandse zelfstandige naamwoorden worden met lidwoord getoond.
- Correcte alternatieve vertalingen worden als juist aanvaard.
- Accenten, een ontbrekend Frans lidwoord en één kleine tikfout geven één gerichte herkansing.
- Volledig verkeerde antwoorden tonen meteen het correcte antwoord.
- Hoofdvertaling, alternatieven en korte contextnotities worden duidelijk weergegeven.
- Service worker vernieuwd: nieuwe bestanden krijgen voorrang en oude caches worden automatisch verwijderd.

