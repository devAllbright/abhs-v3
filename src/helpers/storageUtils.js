export function saveToStorage(key, value) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage(key) {
  if (typeof window === "undefined") return null;
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function updateStorage(key, updater) {
  if (typeof window === "undefined") return;
  const current = loadFromStorage(key) || {};
  const updated =
    typeof updater === "function" ? updater(current) : { ...current, ...updater };
  saveToStorage(key, updated);
  return updated;
}
