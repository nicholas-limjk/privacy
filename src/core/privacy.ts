import { sensitiveRules } from "../data";

export interface SanitizedUrl { domain: string; pathTokens: string[] }

export function registrableHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
}

export function sensitiveAction(url: string): "drop" | "domain_only" | null {
  let host: string;
  try { host = registrableHost(new URL(url).hostname); } catch { return "drop"; }
  const rule = sensitiveRules.find(({ pattern }) => pattern.startsWith(".") ? host.endsWith(pattern) : host === pattern || host.endsWith(`.${pattern}`) || host.includes(pattern));
  return rule?.action ?? null;
}

export function sanitizeUrl(rawUrl: string, domainOnly = false): SanitizedUrl | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    const domain = registrableHost(url.hostname);
    const pathTokens = domainOnly ? [] : url.pathname.split("/").filter(Boolean).slice(0, 8)
      .map((part) => { try { return decodeURIComponent(part); } catch { return part; } })
      .map((part) => part.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
      .filter((part) => part.length >= 2 && part.length <= 48 && !/^[a-f0-9]{16,}$/.test(part) && !/^\d{7,}$/.test(part));
    return { domain, pathTokens };
  } catch { return null; }
}
