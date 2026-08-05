// Tiny state container: plain object state + subscriber list.
// Nothing here is React-specific; render() re-runs on every change.

export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(patch) {
    const next = typeof patch === "function" ? patch(state) : patch;
    state = { ...state, ...next };
    listeners.forEach((fn) => fn(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return { getState, setState, subscribe };
}

// ---------------------------------------------------------------------------
// Persistence repository. Everything the UI needs to save/load progress goes
// through this interface. Today it is backed by localStorage; swapping in a
// real backend later (e.g. an authenticated REST/GraphQL API) means writing
// one new object with the same load/save shape and pointing `repo` at it —
// no call site elsewhere in the app needs to change.
// ---------------------------------------------------------------------------

const STORAGE_KEY = "bkm.v1";

const localStorageRepo = {
  async load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  },
  async save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage unavailable (private browsing, quota, etc.) — fail silently
    }
  }
};

export const repo = localStorageRepo;
