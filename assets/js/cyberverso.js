/* =============================================================
   cyber/verso  ·  client JS
   -------------------------------------------------------------
   File: assets/js/cyberverso.js

   Caricato in coda al body di default.hbs.

   Si occupa di:
     1. Inizializzare il dark mode (default) o light mode (se
        l'utente l'ha scelto in passato), leggendo localStorage.
     2. Esporre una funzione globale cvToggleTheme() che inverte
        la modalita' e salva la scelta.
     3. Aggiornare l'icona del toggle se presente nel DOM.
   ============================================================= */

(function () {
  'use strict';

  var STORAGE_KEY = 'cv-theme';
  var THEME_DARK = 'dark';
  var THEME_LIGHT = 'light';

  /**
   * Applica un tema modificando le classi su :root.
   * Source usa .has-light-text per attivare la palette scura.
   * Noi aggiungiamo .cv-light-mode quando l'utente sceglie light.
   */
  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === THEME_LIGHT) {
      root.classList.remove('has-light-text');
      root.classList.add('cv-light-mode');
    } else {
      root.classList.add('has-light-text');
      root.classList.remove('cv-light-mode');
    }
    updateToggleIcons(theme);
  }

  /**
   * Aggiorna gli elementi con [data-cv-toggle-icon] cambiando il
   * testo visibile. Esempio nel template:
   *   <button data-cv-toggle-theme>
   *     <span data-cv-toggle-icon></span>
   *   </button>
   */
  function updateToggleIcons(theme) {
    var icons = document.querySelectorAll('[data-cv-toggle-icon]');
    icons.forEach(function (el) {
      el.textContent = theme === THEME_LIGHT ? '◐' : '◑';
      el.setAttribute('aria-label',
        theme === THEME_LIGHT ? 'Switch to dark mode' : 'Switch to light mode'
      );
    });
  }

  /**
   * Legge il tema salvato. Se nulla e' salvato, default a dark.
   * NON usiamo prefers-color-scheme: l'identita' cyber/verso e' dark.
   */
  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || THEME_DARK;
    } catch (e) {
      return THEME_DARK;
    }
  }

  /**
   * Salva la scelta dell'utente.
   */
  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* noop, localStorage potrebbe essere disabilitato */
    }
  }

  /**
   * Toggle pubblico, esposto su window per l'uso da onclick="..."
   */
  window.cvToggleTheme = function () {
    var current = getStoredTheme();
    var next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
    setStoredTheme(next);
    applyTheme(next);
  };

  /**
   * Bind automatico su elementi con [data-cv-toggle-theme].
   */
  function bindToggleButtons() {
    var buttons = document.querySelectorAll('[data-cv-toggle-theme]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        window.cvToggleTheme();
      });
    });
  }

  /**
   * Mobile menu toggle. Bound to [data-cv-burger]; toggles the
   * `is-menu-open` class on the closest [data-cv-header] and
   * keeps aria-expanded in sync for screen readers.
   */
  function bindBurgerButtons() {
    var burgers = document.querySelectorAll('[data-cv-burger]');
    burgers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var header = btn.closest('[data-cv-header]');
        if (!header) return;
        var open = header.classList.toggle('is-menu-open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
  }

  function initBindings() {
    bindToggleButtons();
    bindBurgerButtons();
  }

  /**
   * Marca la lingua attiva su <html data-cv-lang="..."> in base al
   * pathname. Il language switcher fuori dalle pagine post (renderizzato
   * staticamente in cv-language-switcher.hbs) si appoggia a questo
   * attributo via CSS per evidenziare il link corretto.
   */
  function detectLanguage() {
    var path = window.location.pathname || '/';
    var isIt = path === '/it' || path === '/it/' || path.indexOf('/it/') === 0;
    document.documentElement.setAttribute('data-cv-lang', isIt ? 'it' : 'en');
  }

  /* Inizializzazione: applica subito il tema salvato e marca la lingua,
     poi attacca i listener quando il DOM e' pronto. */
  detectLanguage();
  applyTheme(getStoredTheme());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBindings);
  } else {
    initBindings();
  }

})();


/* =============================================================
   FLASH-OF-WRONG-THEME PREVENTION
   -------------------------------------------------------------
   Per evitare che la pagina lampeggi in light mode mentre il
   JS si carica, si aggiunge anche un piccolo blocco INLINE
   in default.hbs nell'<head>:

   <script>
     (function () {
       try {
         var t = localStorage.getItem('cv-theme') || 'dark';
         if (t === 'dark') {
           document.documentElement.classList.add('has-light-text');
         } else {
           document.documentElement.classList.add('cv-light-mode');
         }
       } catch (e) {
         document.documentElement.classList.add('has-light-text');
       }
     })();
   </script>

   Questo blocco viene fornito separatamente (file inline-theme-init.html).
   ============================================================= */
