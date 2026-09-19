# Frans Trainer v1.15.0 — Stability Fix

Deze build is gemaakt op basis van de algemene audit van v1.14.0.

## Uitgevoerde verbeteringen

- Betrouwbare PWA/offline-cache met versie-querystrings.
- APP_VERSION en alle assetversies gelijkgetrokken.
- Eindleestekens tolerant gemaakt in schriftelijke antwoordcontrole.
- Dynamische feedbacktijd toegevoegd.
- Sessievoortgang niet langer persistent.
- Moeilijke-woordenmodus geeft geen stille fallback meer.
- Redundante lidwoordloze noun-alternatieven en apostrofdubbels opgeschoond.

## Regressiecontroles

- **JavaScript syntax:** OK
- **Woordenlijsten:** 15 lijsten, 518 items
- **Lidwoorden hoofdvormen:** OK
- **Dubbele Franse hoofditems:** 0
- **Alternatieven opgeschoond:** 112 kale dubbels + 4 normalisatiedubbels verwijderd
- **DOM koppelingen:** 30 IDs OK
- **Versiebeheer:** v1.15.0 overal
- **PWA/offline assets:** 36 assets + ignoreSearch OK
- **Sessiestatus:** reset + niet persistent OK
- **Antwoordcontrole:** 8 regressietests OK
- **Importfunctie:** CSV + JSON parser OK
