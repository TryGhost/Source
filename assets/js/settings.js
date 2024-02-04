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

function getInitialSettings() {
  return {
    theme: getLocalStorage("theme", "automatic"),
    sidenotes: getLocalStorage("sidenotes", true),
    sidenotesFootnotes: getLocalStorage("sidenotesFootnotes", true),
    sidenotesReferences: getLocalStorage("sidenotesReferences", false),
  };
}

function setInitialSettings() {
  const settings = getInitialSettings();
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
  if (id === "sidenotes") {
    document.getElementById("sidenotesFootnotes").disabled = !checked;
    document.getElementById("sidenotesReferences").disabled = !checked;
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
