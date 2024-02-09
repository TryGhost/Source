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
    sidenotesFootnotes: getLocalStorage("sidenotesFootnotes", true),
    sidenotesReferences: getLocalStorage("sidenotesReferences", false),
  };
}

/* DARK MODE 
 ----------------------------------------------------------*/
function setTweetsTheme() {
  const theme = document.documentElement.getAttribute("data-theme");
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

  const radioButtons = document.querySelectorAll('form[name="theme"] input');
  for (const button of radioButtons) {
    button.checked = button.value === settingsTheme;
    button.setAttribute("aria-checked", button.value === settingsTheme);
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

function onThemeChange({ target: { value } }) {
  setTheme(value);
  setLocalStorage("theme", value);
  setTweetsTheme();
  // Handles bug where comments are unreadable just after theme change
  document.querySelector('iframe[title="comments-frame"]').contentWindow.location.reload();
}

function onCheckboxChange({ target: { id, checked } }) {
  const settings = getSettings();
  let showFootnotes, showReferences;
  if (id === "sidenotesFootnotes") {
    showFootnotes = checked;
    showReferences = settings.sidenotesReferences;
  } else {
    showFootnotes = settings.sidenotesFootnotes;
    showReferences = checked;
  }
  if (!showFootnotes && !showReferences) {
    hideSidenotes();
  } else {
    const sidenotesInDom = Boolean(document.querySelector("div.gh-notes-wrapper"));
    if (!sidenotesInDom) {
      // Initialization required
      sidenotes();
    } else {
      redoSidenotes({ showFootnotes, showReferences });
      showSidenotes();
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

function onPageClick(evt) {
  const settingsButton = document.getElementById("site-settings-button");
  const panel = document.getElementById("site-settings-panel");
  if (
    !evt.target.matches("#site-settings-panel, #site-settings-panel *, #site-settings-button, #site-settings-button *")
  ) {
    panel.close();
    settingsButton.setAttribute("aria-expanded", "false");
    panel.setAttribute("aria-hidden", "true");
  }
}

/* SETUP
 ----------------------------------------------------------*/
function setInitialTweetsTheme() {
  let counter = 0;
  const interval = setInterval(function () {
    const result = setTweetsTheme();
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
        const radioButtons = document.querySelectorAll(`form[name="${key}"] input`);
        for (const button of radioButtons) {
          button.checked = button.value === settings[key];
          button.setAttribute("aria-checked", button.value === settings[key]);
        }
      }
    }
  }

  // Initialize sidenotes if need be
  if (settings.sidenotesFootnotes || settings.sidenotesReferences) {
    sidenotes({ showFootnotes: settings.sidenotesFootnotes, showReferences: settings.sidenotesReferences });
  }

  // Initialize theme
  setTheme(settings.theme);
  setInitialTweetsTheme(settings.theme);
}

function settings() {
  const settingsButton = document.getElementById("site-settings-button");

  // Theme settings setup
  document.querySelectorAll("form[name='theme']")?.forEach((form) => form.addEventListener("change", onThemeChange));

  // Sidenotes settings setup
  if (settingsButton) {
    settingsButton.addEventListener("click", onSettingsIconClick);
    const checkboxes = ["sidenotesFootnotes", "sidenotesReferences"];
    for (const checkbox of checkboxes) {
      document.getElementById(checkbox)?.addEventListener("change", onCheckboxChange);
    }
    document.addEventListener("click", onPageClick);
  }

  // Initialize settings
  setInitialSettings((hasSettingsMenu = !!settingsButton));
}
