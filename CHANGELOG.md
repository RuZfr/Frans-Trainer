# Changelog

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

