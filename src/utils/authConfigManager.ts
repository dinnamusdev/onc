// @project
import { AUTH_CONFIG_KEY } from '@/config';

/***************************  AUTH CONFIG MANAGER  ***************************/

type AuthConfigStates = Record<string, unknown>;

const defaultAuthConfig: AuthConfigStates = {};

type Listener = (state: AuthConfigStates) => void;

let state: AuthConfigStates = readValue();
const listeners = new Set<Listener>();

function readValue(): AuthConfigStates {
  if (typeof window === 'undefined') return defaultAuthConfig;
  try {
    const item = localStorage.getItem(AUTH_CONFIG_KEY);
    return item ? (JSON.parse(item) as AuthConfigStates) : defaultAuthConfig;
  } catch (err) {
    console.warn(`Error reading localStorage key “${AUTH_CONFIG_KEY}”:`, err);
    return defaultAuthConfig;
  }
}

function notify() {
  listeners.forEach((l) => l(state));
}

function saveValue(newState: AuthConfigStates) {
  state = newState;
  try {
    localStorage.setItem(AUTH_CONFIG_KEY, JSON.stringify(newState));
  } catch (err) {
    console.warn(`Error setting localStorage key “${AUTH_CONFIG_KEY}”:`, err);
  }
  notify();
}

export const authConfigManager = {
  // Subscribe
  subscribe(listener: Listener) {
    listeners.add(listener);
    listener(state); // fire immediately
    return () => listeners.delete(listener);
  },

  // Get current state
  getState(): AuthConfigStates {
    return state;
  },

  // Check if social login is active
  isSocialLogin(): boolean {
    return !!state.socialProvider;
  },

  // Update full state
  setState(newState: AuthConfigStates) {
    saveValue(newState);
  },

  // Update single field
  setField<K extends keyof AuthConfigStates>(key: K, value: AuthConfigStates[K]) {
    saveValue({
      ...state,
      [key]: value
    });
  },

  // Reset
  reset() {
    saveValue(defaultAuthConfig);
  }
};

// Init sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === AUTH_CONFIG_KEY) {
      state = readValue();
      notify();
    }
  });

  // Patch same-tab set/remove
  const rawSetItem = localStorage.setItem;
  const rawRemoveItem = localStorage.removeItem;

  localStorage.setItem = (key: string, value: string): void => {
    rawSetItem.call(localStorage, key, value);
    if (key === AUTH_CONFIG_KEY) {
      state = readValue();
      notify();
    }
  };

  localStorage.removeItem = (key: string): void => {
    rawRemoveItem.call(localStorage, key);
    if (key === AUTH_CONFIG_KEY) {
      state = readValue();
      notify();
    }
  };
}
