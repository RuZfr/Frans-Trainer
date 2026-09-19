# Frans Trainer v1.7.0

Start `index.html` met Live Server in Visual Studio Code.


## Woordenlijsten toevoegen

De leerinhoud staat los van de programmacode in `data/lists/`.

Een nieuwe lijst toevoegen:

1. Maak bijvoorbeeld `data/lists/school.json`.
2. Gebruik dit formaat:

```json
{
  "id": "school",
  "name": "School",
  "description": "Woorden rond school.",
  "words": [
    {
      "fr": "le livre",
      "nl": "het boek",
      "alts": ["boek"],
      "category": "School",
      "type": "noun"
    }
  ]
}
```

3. Voeg de lijst toe aan `data/lists/index.json`:

```json
{
  "id": "school",
  "name": "School",
  "file": "school.json",
  "description": "Woorden rond school."
}
```

Bij de volgende start verschijnt de lijst automatisch in de keuzelijst **Woordenlijst**.
De oefenlogica hoeft hiervoor niet aangepast te worden.

## Lokale ontwikkeling

Open de map `FransTrainer` zelf in Visual Studio Code en start `index.html` met **Go Live**.
Op localhost/127.0.0.1 verwijdert de app automatisch oude service workers en caches.


## Woordenbankkwaliteit

Zie `WORDLIST_REVIEW.md` voor de inhoudelijke controle en antwoordregels van de huidige basiswoordenbank.


## ThemaBoost v1.10.0

14 extra woordenlijsten met 336 nieuwe leeritems:

- Game on 🎮 — Gamen, winnen en online spelen.
- Sport & actie ⚽ — Scoren, trainen en supporteren.
- Live & muziek 🎵 — Muziek, concerten en favoriete nummers.
- Mijn crew 👯 — Vrienden, afspreken en samen plezier maken.
- School mode 🎒 — Vakken, toetsen en alles rond school.
- Snack & chill 🍕 — Eten, drinken en iets lekkers bestellen.
- Style check 👟 — Kleding, sneakers en shoppen.
- Online 📱 — Smartphone, apps en berichten.
- Op pad 🚲 — Onderweg, in de stad en de weg vinden.
- Weekend vibes 🎉 — Films, feestjes en vrije tijd.
- Thuis chillen 🛋️ — Mijn kamer, dagelijkse dingen en relaxen.
- Vakantie mode ✈️ — Reizen, weer en vakantiegevoel.
- Fit & gezond 💪 — Je goed voelen, bewegen en gezond blijven.
- Buiten & avontuur 🌿 — Natuur, dieren en buiten zijn.


## v1.11.0 — categorieën en eigen woordenlijsten

- Kies op het oefenscherm een woordenlijst en daarbinnen eventueel één categorie.
- Importeer via ⚙️ **Instellingen** een JSON- of CSV-bestand.
- Ondersteunde velden: `fr`, `nl`, `alts`, `frAlts`, `category`, `type`, `note`.
- Voor zelfstandige naamwoorden is `type=noun` aanbevolen; de import waarschuwt dan wanneer een Frans of Nederlands lidwoord ontbreekt.
- Eigen lijsten worden alleen lokaal in de browser opgeslagen.
- Een voorbeeld staat in `data/templates/woordenlijst-voorbeeld.csv`.
