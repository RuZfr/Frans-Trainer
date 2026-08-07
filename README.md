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
