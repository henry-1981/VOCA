const STORAGE_KEY = "bridevoca-last-result";
const CACHE_PREFIX = "bridevoca-cache";

export type StoredResult = {
  score: number;
  total: number;
  finishedAt: string;
};

export function loadLastResult(): StoredResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredResult;
  } catch {
    return null;
  }
}

export function saveLastResult(result: StoredResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
}

export function loadCache<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(`${CACHE_PREFIX}:${key}`);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function saveCache<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(`${CACHE_PREFIX}:${key}`, JSON.stringify(value));
}
