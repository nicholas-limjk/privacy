import type { Profile } from "./types";
export type Request = { type: "GET_STATE" } | { type: "BUILD_PROFILE"; windowDays: number } | { type: "DELETE_ALL" };
export type Response = { ok: true; profile?: Profile | null; hasHistoryPermission?: boolean } | { ok: false; error: string };
