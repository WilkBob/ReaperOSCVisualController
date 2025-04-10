// settingsManager.js
import { DEFAULT_SETTINGS } from "./DefaultSettings";

class SettingsManager {
  constructor(storageKey = "visualizerSettings") {
    this.storageKey = storageKey;
    this.settings = this.load() || structuredClone(DEFAULT_SETTINGS);
    console.log("Settings loaded:", this);
  }

  // Load from localStorage
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error("Failed to load settings:", e);
      return null;
    }
  }

  // Save to localStorage
  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  }

  resetToDefault(path) {
    const keys = path.split(".");
    let obj = this.settings;

    // Traverse to the target object
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in obj)) {
        console.warn(`Path "${path}" is invalid. Key "${key}" does not exist.`);
        return; // Exit if the path is invalid
      }
      obj = obj[key];
    }

    // Retrieve the default value
    const defaultValue = keys.reduce(
      (acc, key) => acc?.[key],
      DEFAULT_SETTINGS
    );

    if (defaultValue === undefined) {
      console.warn(`Default value for path "${path}" does not exist.`);
      return; // Exit if the default value is undefined
    }

    // Set the value to the default (deep clone to avoid mutations)
    obj[keys[keys.length - 1]] = structuredClone(defaultValue);

    this.save();
    return defaultValue; // Return the default value for confirmation
  }

  // Get a setting
  get(path) {
    return path.split(".").reduce((acc, key) => acc?.[key], this.settings);
  }

  // Update a setting
  set(path, value) {
    const keys = path.split(".");
    let obj = this.settings;
    keys.slice(0, -1).forEach((key) => {
      if (!(key in obj)) obj[key] = {};
      obj = obj[key];
    });
    obj[keys[keys.length - 1]] = value;
    this.save();
  }
}

export const settingsManager = new SettingsManager();
