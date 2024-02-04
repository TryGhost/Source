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

function setInitialSettings() {
  const settings = getSettings();
  for (const key of Object.keys(settings)) {
    if (typeof settings[key] === "boolean") {
      document.getElementById(key).checked = settings[key];
    } else {
      document.getElementById(settings[key]).checked = true;
    }
  }
  if (!settings.sidenotes) {
    document.getElementById("sidenotesFootnotes").disabled = true;
    document.getElementById("sidenotesReferences").disabled = true;
  } else {
    sidenotes({ showFootnotes: settings.sidenotesFootnotes, showReferences: settings.sidenotesReferences });
  }
}

function onSettingsIconClick() {
  const panel = document.getElementById("site-settings-panel");
  if (panel.open) {
    panel.close();
  } else {
    panel.show();
  }
}

function onThemeChange({ target: { id } }) {
  setLocalStorage("theme", id);
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

function settings() {
  document.getElementById("site-settings-button").addEventListener("click", onSettingsIconClick);
  document.getElementById("theme").addEventListener("change", onThemeChange);
  const checkboxes = ["sidenotes", "sidenotesFootnotes", "sidenotesReferences"];
  for (const checkbox of checkboxes) {
    document.getElementById(checkbox).addEventListener("change", onCheckboxChange);
  }
  setInitialSettings();
}
