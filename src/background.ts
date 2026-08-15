import { aggregateInterests } from "./core/interests";
import { normalizeHistoryEvent } from "./core/normalize";
import { deleteAllData, loadProfile, saveProfile } from "./core/storage";
import type { Request, Response } from "./messages";
import type { RawHistoryEvent } from "./types";

chrome.runtime.onInstalled.addListener(() => { chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => undefined); });
chrome.runtime.onMessage.addListener((message: Request, _sender, sendResponse: (response: Response) => void) => {
  void handle(message).then(sendResponse); return true;
});
async function handle(message: Request): Promise<Response> {
  try {
    if (message.type === "GET_STATE") return { ok: true, profile: await loadProfile(), hasHistoryPermission: await chrome.permissions.contains({ permissions: ["history"] }) };
    if (message.type === "DELETE_ALL") { await deleteAllData(); await chrome.storage.local.clear(); return { ok: true, profile: null }; }
    const endTime = Date.now(), startTime = endTime - message.windowDays * 86_400_000;
    const raw = await chrome.history.search({ text: "", startTime, endTime, maxResults: 100000 }) as RawHistoryEvent[];
    const normalized = (await Promise.all(raw.map(normalizeHistoryEvent))).filter((event) => event !== null);
    const profile = { interests: aggregateInterests(normalized), eventsProcessed: normalized.length, filteredEvents: raw.length - normalized.length, builtAt: Date.now(), windowDays: message.windowDays };
    await saveProfile(normalized, profile); await chrome.storage.local.set({ onboarded: true });
    return { ok: true, profile };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Unexpected local processing error" }; }
}
