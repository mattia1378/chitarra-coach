# Patch freeze GitHub Pages / PWA (v1.0.3)

**Cosa fa**  
- Forza l'aggiornamento del Service Worker (skipWaiting + clients.claim).  
- Mostra un banner quando c'è una nuova versione e ricarica la pagina quando il nuovo SW entra in controllo.

## Come applicare (repo `chitarra-coach`)
1. **Sostituisci `sw.js`** nella root del repo con quello in questa zip (stesso nome). Commit su `main`.
2. **Apri `index.html`** e assicurati che i percorsi siano **relativi** (senza `/` all'inizio):
   ```html
   <link rel="stylesheet" href="style.css">
   <link rel="manifest" href="manifest.webmanifest">
   ...
   <script src="app.js"></script>
   ```
3. **Incolla lo snippet** `upd_snippet.html` *prima* del tag `<script src="app.js"></script>` oppure subito prima di `</body>`.
4. Apri l’URL del sito una volta con un query param (bypass vecchio cache):  
   `https://mattia1378.github.io/chitarra-coach/?v=103`
5. Se è installata come **PWA**, chiudila e riaprila; il banner apparirà e poi la pagina si ricarica da sola.

> Suggerimento: quando rilasci una nuova versione, **incrementa** la costante `CACHE` in `sw.js` (es. `ccpwa-v1.0.4`).

### File inclusi
- `sw.js` — bump cache + `skipWaiting()` + `clients.claim()` e cache locale base.
- `upd_snippet.html` — codice pronto da incollare in `index.html` per gestire banner/refresh.
