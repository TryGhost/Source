/* LOCALSTORAGE HELPERS
 ----------------------------------------------------------*/
function getLocalStorage(key, returnValueIfNotSet = null) {
  let value;
  try {
    value = localStorage.getItem(key);
    if (value === undefined || value === null) {
      return returnValueIfNotSet;
    } else {
      return JSON.parse(value);
    }
  } catch (err) {
    if (!value) {
      // Couldn't get the value at all (security settings, etc.)
      return returnValueIfNotSet;
    } else {
      // Something went wrong with the JSON parsing but the value exists
      return value;
    }
  }
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (err) {
    // Localstorage isn't used for anything critical, so we can just move on
  }
}

function getSettings() {
  return {
    theme: getLocalStorage("theme", "automatic"),
    sidenotes: getLocalStorage("sidenotes", true),
    sidenotesFootnotes: getLocalStorage("sidenotesFootnotes", true),
    sidenotesReferences: getLocalStorage("sidenotesReferences", false),
  };
}

/* DARK MODE 
 ----------------------------------------------------------*/
function setTweetsTheme(theme) {
  const tweets = document.querySelectorAll("[data-tweet-id]");
  let changeFlag = false;
  tweets.forEach(function (tweet) {
    var src = tweet.getAttribute("src");
    const match = src.match(/theme=(\w+)/);
    if (match && match[1] !== theme) {
      tweet.setAttribute("src", src.replace(/theme=\w+/, `theme=${theme}`));
      changeFlag = true;
    }
  });
  return changeFlag;
}

function setTheme(settingsTheme) {
  let theme;
  if (settingsTheme === "automatic") {
    // Get OS theme
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    } else {
      theme = "light";
    }
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", onSystemThemeChange);
  } else {
    // Hardcoded theme, no need to listen for system theme change
    theme = settingsTheme;
    window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", onSystemThemeChange);
  }
  const items = document.querySelectorAll(`input[value=${settingsTheme}]`);
  for (const item of items) {
    item.checked = true;
  }
  document.documentElement.setAttribute("data-theme", theme);
}

/* EVENT HANDLERS 
 ----------------------------------------------------------*/
function onSystemThemeChange() {
  const settingsTheme = getLocalStorage("theme", "automatic");
  if (settingsTheme === "automatic") {
    // Get OS theme
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    } else {
      theme = "light";
    }
  }
  document.documentElement.setAttribute("data-theme", theme);
}

function onThemeChange({ target: { id } }) {
  setTheme(id);
  setLocalStorage("theme", id);
  setTweetsTheme(id);
}

function onCheckboxChange({ target: { id, checked } }) {
  const settings = getSettings();
  if (id === "sidenotes") {
    if (!settings.sidenotesFootnotes && !settings.sidenotesReferences) {
      // Doesn't make sense to enable sidenotes with neither footnotes nor references, so reset to default
      setLocalStorage("sidenotesFootnotes", true);
      settings.sidenotesFootnotes = true;
      document.getElementById("sidenotesFootnotes").checked = true;
    }
    document.getElementById("sidenotesFootnotes").disabled = !checked;
    document.getElementById("sidenotesReferences").disabled = !checked;
    if (checked) {
      const sidenotesInDom = Boolean(document.querySelector("div.gh-notes-wrapper"));
      if (sidenotesInDom) {
        // If the sidenotes are already in the DOM, just show them
        showSidenotes();
      } else {
        // Sidenotes haven't been initialized yet
        sidenotes({
          showFootnotes: settings.sidenotesFootnotes,
          showReferences: settings.sidenotesReferences,
        });
      }
    } else {
      hideSidenotes();
    }
  } else {
    let showFootnotes, showReferences;
    if (id === "sidenotesFootnotes") {
      showFootnotes = checked;
      showReferences = settings.sidenotesReferences;
    } else {
      showFootnotes = settings.sidenotesFootnotes;
      showReferences = checked;
    }
    if (!showFootnotes && !showReferences) {
      // Also disable sidenotes, since there's nothing left
      setLocalStorage("sidenotes", false);
      document.getElementById("sidenotes").checked = false;
      document.getElementById("sidenotesFootnotes").disabled = true;
      document.getElementById("sidenotesReferences").disabled = true;
      hideSidenotes();
    } else {
      redoSidenotes({ showFootnotes, showReferences });
    }
  }
  setLocalStorage(id, checked);
}

function onSettingsIconClick() {
  const panel = document.getElementById("site-settings-panel");
  const settingsButton = document.getElementById("site-settings-button");
  if (panel.open) {
    panel.close();
    settingsButton.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  } else {
    panel.show();
    settingsButton.setAttribute("aria-expanded", "true");
    panel.setAttribute("aria-hidden", "false");
  }
}

/* SETUP
 ----------------------------------------------------------*/
function setInitialTweetsTheme(theme) {
  let counter = 0;
  const interval = setInterval(function () {
    const result = setTweetsTheme(theme);
    if (result || counter > 10) {
      clearInterval(interval);
    }
    counter += 1;
  }, 500);
}

function setInitialSettings(hasSettingsMenu) {
  const settings = getSettings();
  const mobilePanel = document.getElementById("mobile-site-settings-panel");
  if (hasSettingsMenu || !!mobilePanel) {
    for (const key of Object.keys(settings)) {
      if (typeof settings[key] === "boolean") {
        const item = document.getElementById(key);
        if (item) {
          item.checked = settings[key];
        }
      } else {
        const items = document.querySelectorAll(`input[value=${settings[key]}]`);
        for (const item of items) {
          item.checked = true;
        }
      }
    }
  }

  // Initialize sidenotes if need be
  if (!settings.sidenotes) {
    if (hasSettingsMenu) {
      document.getElementById("sidenotesFootnotes").disabled = true;
      document.getElementById("sidenotesReferences").disabled = true;
    }
  } else {
    sidenotes({ showFootnotes: settings.sidenotesFootnotes, showReferences: settings.sidenotesReferences });
  }

  // Initialize theme
  setTheme(settings.theme);
  setInitialTweetsTheme(settings.theme);
}

function settings() {
  const settingsButton = document.getElementById("site-settings-button");
  const panel = document.getElementById("site-settings-panel");
  if (settingsButton) {
    settingsButton.addEventListener("click", onSettingsIconClick);
    document.getElementById("theme")?.addEventListener("change", onThemeChange);
    const checkboxes = ["sidenotes", "sidenotesFootnotes", "sidenotesReferences"];
    for (const checkbox of checkboxes) {
      document.getElementById(checkbox)?.addEventListener("change", onCheckboxChange);
    }
    document.addEventListener("click", (evt) => {
      if (
        !evt.target.matches(
          "#site-settings-panel, #site-settings-panel *, #site-settings-button, #site-settings-button *"
        )
      ) {
        panel.close();
        settingsButton.setAttribute("aria-expanded", "false");
        panel.setAttribute("aria-hidden", "true");
      }
    });
  }
  setInitialSettings((hasSettingsMenu = !!settingsButton));
}
