# cyber/verso · Project Handoff

> **Per Claude Code**: questo documento riassume tutto il contesto
> del progetto deciso in una conversazione precedente. Leggilo per
> intero prima di iniziare. Tutti i file menzionati come "forniti
> dalla chat precedente" si trovano già nel repo (vedi sezione
> "Stato attuale").

---

## 1. Cos'è il progetto

Custom Ghost theme per **cyberverso.net**, blog personale di Paolo
De Rosa su digital sovereignty, DPI, AI policy, identity e payments.
Hosting: **Ghost Pro** (ghost.io), quindi possiamo modificare solo
il tema (no core/server).

Il theme è un **fork di TryGhost/Source** (`paolo-de-rosa/Source`)
con override layered, no patch invasive.

## 2. Identità e direzione visiva

**Nome stilizzato**: `cyber/verso` (la slash è elemento di brand
ricorrente in tutta la UI).

**Palette**:
- Sfondo: nero caldo `#0c0a08` (non puro)
- Testo: crema `#e8e4d9`
- Accento: ambra arancione `#ff8c42` (Neuromancer first-edition vibe)
- Light mode opt-in: warm cream `#faf7f0`

**Tipografia**:
- Serif headlines + body: **Fraunces**
- Mono per UI/metadata: **IBM Plex Mono**
- Niente sans serif protagonista (Inter solo per UI residuale Ghost)

**Modalità colore**: Dark di default, light mode opt-in via
toggle. Persistenza in `localStorage`. NO `prefers-color-scheme`,
l'identità è dark.

**Cosa NON fare**:
- Niente glitch/Matrix/CRT effect
- Niente verde fosforico cliché
- Niente ASCII art decorativa
- Niente skeuomorfismi cyberpunk

**Motivi grafici ricorrenti**:
- Slash `/` come separatore (es. `/ recent`, `/ author`, breadcrumb)
- Parentesi quadre `[ ]` per tag chip e UI states
- Hairline borders `0.5px solid var(--cv-border)`

## 3. Architettura bilingue (IT/EN)

Ghost non supporta multilingua nativamente. La nostra strategia:

### Tassonomia tag

```
TOPIC tags (pubblici):
  infrastructures, identity, digital-euro, ai, policy

LINGUA tags (interni, prefisso #):
  #en, #it

PAIRING traduzioni (interni, prefisso #tx-):
  #tx-eu-sov-001, #tx-digital-currencies-001, ...
```

I tag interni in Ghost (con `#`) sono invisibili al pubblico,
non compaiono nei link/sitemap, ma sono filtrabili in template.

### Esempio di pairing

Articolo EN ha tag `infrastructures`, `#en`, `#tx-eu-sov-001`.
La sua traduzione IT ha tag `infrastructures`, `#it`, `#tx-eu-sov-001`
(stesso codename → linkati).

Lo switcher `[en | it]` sull'articolo:
- Cerca un post con stesso tag `#tx-*` ma lingua diversa
- Se esiste, redirige
- Se non esiste, mostra indicatore "no translation" → home altra lingua

### routes.yaml

```yaml
routes:
  /: home.hbs
  /it/: home.hbs

collections:
  /:
    permalink: /{slug}/
    template: index
    filter: tag:hash-en
  /it/:
    permalink: /it/{slug}/
    template: index
    filter: tag:hash-it

taxonomies:
  tag: /tag/{slug}/
  author: /author/{slug}/
```

Da caricare su Ghost.io via **Settings → Labs → Routes**.

### SEO bilingue (Step 4)

- `<link rel="alternate" hreflang="en">` e `hreflang="it">` su
  ogni pagina con traduzione
- Sitemap separati per ogni collezione (Ghost lo fa nativo se
  routes.yaml è corretto)
- Canonical URL per evitare duplicati

## 4. Mockup approvati

Vedi screenshot in conversazione (non disponibili qui, ma definiti):

**Homepage**:
- Header: logo `cyber/verso` (slash arancione), nav 5 topic in
  mono, search ⌕, language switcher `[en | it]`
- Hero: issue corrente con metadata `issue NNN / DD mmm YYYY / topic`,
  H1 serif, lead muted, "by paolo de rosa / X min read / read →"
- Recent: griglia 2-col con metadata mono accent
- Topic chips: `[ topic · count ]` in mono
- Author bio block in fondo
- Footer minimo: copyright + RSS · newsletter · about

**Articolo singolo**:
- Header sticky compresso
- Reading progress bar (filo arancione 0-100%)
- Metadata mono, H1 serif 30px, lead italic
- Avatar autore + meta (paolo / 12 min / N words)
- Body: max-width 65ch, line-height 1.7, link con underline ambra
- Pull-quote: border-left ambra, italic
- Tagged section + Read next (2 articoli, codename-aware)

## 5. Stato attuale (Step 1 completato)

**File già nel repo**:

```
assets/css/cyberverso.css     ← design tokens + Source overrides
assets/js/cyberverso.js        ← dark/light toggle con localStorage
```

**Modifiche a `default.hbs`**:

1. `<link>` a `built/cyberverso.css` dopo `built/screen.css` (override per cascade).
2. Inline theme-init script in `<head>`, posizionato **dopo** lo script Source che fa `documentElement.className = ...` (altrimenti viene sovrascritto). In light mode rimuove esplicitamente `has-light-text`.
3. **Nessun `<script>` separato** per `cyberverso.js`: il file viene già concatenato in `built/source.js` dalla task `js` di gulp (che include tutti i `assets/js/*.js`). Aggiungere un secondo tag causerebbe double-bind dei toggle.

**Modifiche a `gulpfile.js`**:

- Task `css` riceve un array `['assets/css/screen.css', 'assets/css/cyberverso.css']` e produce due output separati in `assets/built/`. Nessuna modifica alla task `js`.

**Output build** (`npx gulp build` o `yarn dev`): `built/screen.css`, `built/cyberverso.css`, `built/source.js` (quest'ultimo contiene anche il toggle theme).

**Note tecniche scoperte**:

- Source usa `font-size: 62.5%` su html (10px base, 1.6rem = 16px)
- Variabili native Source: `--color-darker-gray`, `--color-primary-text`,
  `--color-secondary-text`, `--color-border`, `--color-lighter-gray`,
  `--font-sans`, `--font-serif`, `--font-mono`, `--container-width`
- Dark mode di Source: `.has-light-text` su `:root` (counter-intuitivo,
  significa "testo chiaro su sfondo scuro")
- Ghost admin accent (`--ghost-accent-color`) prevale se settato

## 6. Roadmap (cosa manca)

### Step 2: Brand & Navigation
- [ ] Logo cyber/verso in header (con slash arancione)
- [ ] Topic nav (5 voci): infrastructures, identity, digital-euro, ai, policy
- [ ] Language switcher [en | it] con logica codename
- [ ] Search affordance visibile
- [ ] Header compresso/sticky su post.hbs

### Step 3: Templates
- [ ] home.hbs: hero issue + recent grid + topic chips + author bio
- [ ] post.hbs: reading progress bar + layout long-form
- [ ] tag.hbs: header topic + lista filtrata
- [ ] author.hbs: bio + archivio articoli
- [ ] index.hbs: archivio paginato per /it/

### Step 4: Bilingue runtime
- [ ] routes.yaml (caricamento su Ghost.io)
- [ ] partials/language-switcher.hbs (logica codename)
- [ ] partials/hreflang.hbs (SEO multilingue)
- [ ] Topic labels tradotti (helper Handlebars)
- [ ] Test bilingue con post di prova

### Step 5: Refinement
- [ ] Related posts intelligenti (codename + topic)
- [ ] Newsletter CTA bilingue
- [ ] Search overlay
- [ ] Reading progress bar
- [ ] Performance audit (Lighthouse 95+)
- [ ] Self-host fonts (rimuove dipendenza Google Fonts)
- [ ] Accessibility audit (WCAG AA)

### Step 6: Deploy
- [ ] GitHub Action per deploy automatico (TryGhost/action-deploy-theme)
- [ ] Test su staging Ghost.io
- [ ] Migrazione contenuti (assegnazione tag #en/#it ai post esistenti)
- [ ] Switch tema su produzione

## 7. Convenzioni di sviluppo

**Branching**:
- `main`: stabile, riflette il deploy
- `cyberverso-step-N-<slug>`: branch per ogni step

**Commit**:
- Conventional commits (`feat:`, `fix:`, `style:`, `chore:`)
- Un commit per modifica logica

**File naming**:
- Token CSS: namespace `--cv-*`
- Utility CSS: classe `cv-*`
- Data attribute JS: `data-cv-*`
- Partial Handlebars cyber/verso: `partials/cv-*.hbs`

Lo namespace `cv-` evita collisioni con codice Source.

**Testing locale**:
```bash
yarn dev          # hot reload CSS + Handlebars
yarn zip          # genera dist/source.zip per upload Ghost.io
```

Ghost locale richiesto per test reale (`ghost-cli`).

## 8. Prossimo task immediato

**Step 2: Brand & Navigation**, da fare subito:

1. Creare `partials/cv-header.hbs` con:
   - Logo `cyber<span class="cv-slash">/</span>verso` come link a `/`
   - Topic nav (5 voci, hardcoded per ora)
   - Search button
   - Language switcher (placeholder, logica vera in Step 4)
   - Theme toggle button (`data-cv-toggle-theme`)

2. Aggiornare `default.hbs` per usare `{{> "cv-header"}}` al posto
   dell'header originale di Source.

3. Mobile: collapse del topic nav in hamburger menu sotto 768px.

4. Testare in locale, screenshot, commit, push.

Iniziare da qui. NON saltare a Step 3 prima che Step 2 sia visivamente
approvato dall'utente.

## 9. Cosa NON fare senza chiedere

- Toccare il core di Ghost (non possiamo, hosting Pro)
- Usare !important per vincere conflitti CSS (sintomo che cascade
  è gestita male)
- Introdurre dipendenze npm pesanti (no React, no framework CSS)
- Cambiare l'identità senza discussione (palette, font, slash motif)
- Deployare su produzione (Ghost.io) senza staging test
- Modificare contenuti Ghost via Admin API senza autorizzazione

---

Fine handoff. Per continuare, leggere i file `cyberverso.css` e
`cyberverso.js` nel repo e procedere con Step 2.
