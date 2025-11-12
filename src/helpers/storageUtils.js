export function saveToStorage(key, value) {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to storage:", error);
    }
  }
}

export function loadFromStorage(key) {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading from storage:", error);
    return null;
  }
}

export function removeFromStorage(key) {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing from storage:", error);
    }
  }
}


export function clearStorage() {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }
}
