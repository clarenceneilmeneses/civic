// Tiny in-memory cache so admin tabs and edit forms open instantly on
// revisit within a session. Lives for the lifetime of the browser tab;
// fresh data still replaces it in the background after each list fetch.
const store = new Map<string, unknown>();

export function cacheGet<T>(key: string): T | undefined {
  return store.get(key) as T | undefined;
}

export function cacheSet(key: string, value: unknown) {
  store.set(key, value);
}
