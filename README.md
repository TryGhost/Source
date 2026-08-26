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

Per ricevere e preparare un aggiornamento ufficiale, dalla root di questo
repository eseguire:

```sh
./theme.sh update
```

Lo script richiede un worktree pulito e la branch locale `main`. Confronta il
tag ufficiale più recente con quello già integrato, poi esegue il merge con
`--no-commit`: non crea commit, non fa push e non apre pull request. Prosegue
con build, riavvio di Ghost locale e `./local.sh sync --yes`.

> [!WARNING]
> Il sync sostituisce completamente database e upload di Ghost locale con la
> produzione. Il codice del tema non viene sostituito, perché è montato dalla
> directory `cosmonauta_theme/`.

Dopo il sync, attivare `cosmonauta` in Ghost Admin locale e verificarlo su
`http://localhost:2368`. Se l’aggiornamento è valido, creare un branch,
committare il merge e seguire la normale PR verso `main`. Per annullare la
prova locale, eseguire `git merge --abort`. Se trova conflitti, build o sync
falliti, lo script non perde il merge locale e indica il rollback sicuro.

## Comando build locale

```sh
./theme.sh build
```

Rigenera CSS, JavaScript e traduzioni con `pnpm build`. Se Ghost locale è in
esecuzione, lo riavvia per ricaricare il tema; altrimenti completa il build
senza errore.

## Verifica locale

```sh
pnpm test:ci
pnpm zip
```

`pnpm test:ci` crea il pacchetto e lo controlla con GScan per la compatibilità Ghost. L’archivio generato in `dist/` è locale e non va versionato.
