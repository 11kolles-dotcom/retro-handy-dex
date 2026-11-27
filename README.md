# Handy-Dex 📱

Eine Retro-Web-App zum Sammeln alter Handys. Foto machen, Modell aus dem Katalog wählen, eingesammelt!

**App öffnen:** https://11kolles-dotcom.github.io/retro-handy-dex/

## Funktionen

- Sammelbuch mit 162 Handys von 1995 bis 2020, nummeriert nach Erscheinungsjahr
- Nicht gesammelte Handys als Schatten mit „???“
- Einsammeln per Kamera-Foto, mit Zustand und Notiz
- Suche, Filter nach Marke und „Gesammelt / Fehlt“
- Seltenheitsstufen (Häufig, Selten, Legendär)
- Installierbar (PWA) und offline nutzbar
- Sicherung als Datei speichern und laden

Alle Daten und Fotos bleiben im Browser auf deinem Gerät (IndexedDB). Es gibt keinen Server und kein Konto.

## Installieren

- **Android (Chrome):** App-Link öffnen, Menü ⋮ → „App installieren“ bzw. „Zum Startbildschirm hinzufügen“.
- **iPhone (Safari):** App-Link öffnen, Teilen-Symbol → „Zum Home-Bildschirm“.

## Entwicklung

```bash
npm install
npm run dev      # lokaler Entwicklungsserver
npm run build    # Produktions-Build nach dist/
npm run icons    # App-Icons neu erzeugen
```

Neue Handys kommen in `src/catalog.ts`. Jeder Push auf `main` wird automatisch über GitHub Actions auf GitHub Pages veröffentlicht.
