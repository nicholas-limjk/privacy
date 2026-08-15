import type { NormalizedHistoryEvent, Profile } from "../types";

const DB_NAME = "pao-local"; const VERSION = 1;
export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("normalized_events")) db.createObjectStore("normalized_events", { keyPath: "id" });
      if (!db.objectStoreNames.contains("interests")) db.createObjectStore("interests", { keyPath: "id" });
      if (!db.objectStoreNames.contains("metadata")) db.createObjectStore("metadata", { keyPath: "key" });
    };
    request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
  });
}
function done(tx: IDBTransaction) { return new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error); }); }
export async function saveProfile(events: NormalizedHistoryEvent[], profile: Profile): Promise<void> {
  const db = await openDatabase(); const tx = db.transaction(["normalized_events", "interests", "metadata"], "readwrite");
  tx.objectStore("normalized_events").clear(); tx.objectStore("interests").clear();
  events.forEach((event) => tx.objectStore("normalized_events").put(event)); profile.interests.forEach((interest) => tx.objectStore("interests").put(interest));
  tx.objectStore("metadata").put({ key: "profile", value: profile }); await done(tx); db.close();
}
export async function loadProfile(): Promise<Profile | null> {
  const db = await openDatabase(); const tx = db.transaction("metadata", "readonly"); const request = tx.objectStore("metadata").get("profile");
  const result = await new Promise<Profile | null>((resolve, reject) => { request.onsuccess = () => resolve(request.result?.value ?? null); request.onerror = () => reject(request.error); }); db.close(); return result;
}
export async function deleteAllData(): Promise<void> {
  await new Promise<void>((resolve, reject) => { const req = indexedDB.deleteDatabase(DB_NAME); req.onsuccess = () => resolve(); req.onerror = () => reject(req.error); req.onblocked = () => reject(new Error("Database deletion blocked")); });
}
export async function estimateLocalBytes(): Promise<number> { const estimate = await navigator.storage?.estimate?.(); return estimate?.usage ?? 0; }
