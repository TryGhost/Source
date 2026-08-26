# Cosmonauta

Tema personalizzato di [Ghost](https://ghost.org/) per cosmonauta.dev. È un fork di [TryGhost/Source](https://github.com/TryGhost/Source), mantenuto per integrare in modo controllato le release ufficiali di Source.

## Architettura Git

Questo è un repository Git indipendente, anche se la directory `cosmonauta_theme/` si trova nel workspace del repository infrastrutturale. Il repository padre lo ignora e non deve mai aggiungerne file o commit.

- `origin`: `git@github.com:arrubiu/cosmonauta_theme.git`, il fork di Cosmonauta.
- `upstream`: `https://github.com/TryGhost/Source.git`, il tema ufficiale Ghost.
- `main`: la sola branch distribuita in produzione.

Verificare la configurazione con:

```sh
git remote -v
```

## Prerequisiti

Servono Node 22, Corepack/pnpm e accesso al repository GitHub.

```sh
node --version
corepack --version
pnpm --version
```

Il file `package.json` richiede Node almeno `22.12.0`; la CI usa Node `22.13.0`, compatibile con pnpm 11.22. Se necessario, attivare Corepack:

```sh
corepack enable
```

## Sviluppo quotidiano

Dalla root di questo repository:

```sh
pnpm install --frozen-lockfile
git switch -c feature/nome-modifica
# modificare template, CSS, JavaScript o asset
pnpm test:ci
git add -A
git commit -m "feat: descrizione della modifica"
git push -u origin feature/nome-modifica
```

Aprire una pull request verso `main` e fare il merge solo quando la CI è verde. Solo un push risultante dal merge in `main` esegue il deploy su Ghost produzione; branch e pull request non ricevono segreti né pubblicano modifiche.

## Anteprima locale senza ZIP

Il repository infrastrutturale monta questa directory nel Ghost locale come
`/var/lib/ghost/content/themes/cosmonauta`. Dalla root del repository
infrastrutturale avviare Ghost, poi lasciare il watcher del tema attivo:

```sh
./local.sh up
cd cosmonauta_theme
pnpm install --frozen-lockfile
pnpm dev
```

In Ghost Admin locale (`http://localhost:2368/ghost`) attivare `cosmonauta`
da **Settings → Design**. Le modifiche a CSS e JavaScript sono ricompilate dal
watcher; dopo modifiche a file `.hbs` o `package.json`, eseguire
`./local.sh restart` dalla root del repository infrastrutturale. Questo mount
esiste solo nell'ambiente locale e non carica nulla in produzione.

## Deploy iniziale e rollback

1. In Ghost Admin creare una Custom Integration chiamata `GitHub Actions`.
2. Nel repository GitHub, aggiungere i secret Actions `GHOST_ADMIN_API_URL` e `GHOST_ADMIN_API_KEY` con i valori dell’integrazione.
3. Fare merge in `main` e verificare il workflow **Deploy Ghost theme** nella scheda Actions.
4. Dopo il primo deploy, attivare `cosmonauta` una volta in Ghost Admin → Design.

I deploy successivi aggiornano il tema già attivo. Per annullare una pubblicazione errata, fare il revert del merge su `main`; il nuovo push ridistribuisce la versione precedente.

## Ricevere gli aggiornamenti ufficiali

Su [TryGhost/Source](https://github.com/TryGhost/Source), selezionare **Watch → Custom → Releases**. Le notifiche segnalano nuove release stabili. Non usare il pulsante GitHub **Sync fork**, perché sincronizza il ramo di sviluppo anziché la release scelta.

## Aggiornare da una release di Source

Eseguire i comandi seguenti dalla root di questo repository. Sostituire `<tag-source>` con il tag ufficiale scelto, per esempio `v1.7.2`.

```sh
git switch main
git pull --ff-only origin main
git fetch upstream --tags
git tag --sort=-version:refname | head -n 20
git switch -c update/source-<tag-source>
git merge --no-ff <tag-source>
pnpm install --frozen-lockfile
pnpm test:ci
git status
git add -A
git commit -m "chore: merge Source <tag-source>"
git push -u origin update/source-<tag-source>
```

Se Git segnala conflitti, risolverli prima di eseguire `git add -A` e il commit. In `package.json` preservare sempre `"name": "cosmonauta"`; accettare invece gli aggiornamenti ufficiali a dipendenze, versione e compatibilità Ghost quando appropriati. Aprire una pull request verso `main` indicando il tag importato, gli eventuali conflitti e l’esito di `pnpm test:ci`. Non fare push diretti a `main`.

## Verifica locale

```sh
pnpm test:ci
pnpm zip
```

`pnpm test:ci` crea il pacchetto e lo controlla con GScan per la compatibilità Ghost. L’archivio generato in `dist/` è locale e non va versionato.
