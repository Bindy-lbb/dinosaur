import { useSyncExternalStore } from "react";

export interface LearningProgress {
  version: 1;
  viewed: string[];
  hotspots: Record<string, string[]>;
  quizzes: string[];
  favorites: string[];
}

const STORAGE_KEY = "paleo-learning-v1";
const EMPTY: LearningProgress = {
  version: 1,
  viewed: [],
  hotspots: {},
  quizzes: [],
  favorites: [],
};
const listeners = new Set<() => void>();
const strings = (value: unknown): string[] =>
  Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (item): item is string =>
              typeof item === "string" && item.length < 100,
          ),
        ),
      ].slice(0, 2000)
    : [];

function parseProgress(raw: string | null): LearningProgress {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw);
    if (!data || data.version !== 1) return EMPTY;
    const hotspots: Record<string, string[]> = {};
    if (
      data.hotspots &&
      typeof data.hotspots === "object" &&
      !Array.isArray(data.hotspots)
    ) {
      for (const [id, entries] of Object.entries(data.hotspots)) {
        if (/^[a-z][a-z0-9-]{0,99}$/.test(id)) hotspots[id] = strings(entries);
      }
    }
    return {
      version: 1,
      viewed: strings(data.viewed),
      hotspots,
      quizzes: strings(data.quizzes),
      favorites: strings(data.favorites),
    };
  } catch {
    return EMPTY;
  }
}

function fromStorage(): LearningProgress {
  try {
    return parseProgress(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return EMPTY;
  }
}

let snapshot = fromStorage();
function publish(next: LearningProgress) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* Browsers that block storage still keep progress for this visit. */
  }
  listeners.forEach((listener) => listener());
}

function onStorage(event: StorageEvent) {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  const next = parseProgress(event.newValue);
  if (JSON.stringify(next) === JSON.stringify(snapshot)) return;
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  if (listeners.size === 0 && typeof window !== "undefined")
    window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined")
      window.removeEventListener("storage", onStorage);
  };
}

export function readProgress() {
  return snapshot;
}
export function useLearningProgress() {
  return useSyncExternalStore(subscribe, readProgress, () => EMPTY);
}

export function recordViewed(id: string) {
  if (!snapshot.viewed.includes(id))
    publish({ ...snapshot, viewed: [...snapshot.viewed, id] });
}
export function recordHotspot(id: string, hotspot: string) {
  const previous = snapshot.hotspots[id] || [];
  if (!previous.includes(hotspot))
    publish({
      ...snapshot,
      hotspots: { ...snapshot.hotspots, [id]: [...previous, hotspot] },
    });
}
export function recordQuiz(id: string) {
  if (!snapshot.quizzes.includes(id))
    publish({ ...snapshot, quizzes: [...snapshot.quizzes, id] });
}
export function toggleFavorite(id: string) {
  publish({
    ...snapshot,
    favorites: snapshot.favorites.includes(id)
      ? snapshot.favorites.filter((item) => item !== id)
      : [...snapshot.favorites, id],
  });
}
