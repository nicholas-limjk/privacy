import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { interestBucket } from "./core/interests";
import type { Request, Response } from "./messages";
import type { Profile } from "./types";
import "./styles.css";

type View = "overview" | "profile" | "privacy";
const send = (message: Request) => chrome.runtime.sendMessage<Request, Response>(message);
function App() {
  const [profile, setProfile] = useState<Profile | null>(null), [view, setView] = useState<View>("overview");
  const [loading, setLoading] = useState(true), [error, setError] = useState(""), [windowDays, setWindowDays] = useState(90);
  useEffect(() => { void send({ type: "GET_STATE" }).then((r) => { if (r.ok) setProfile(r.profile ?? null); else setError(r.error); }).finally(() => setLoading(false)); }, []);
  async function build() {
    setError(""); const granted = await chrome.permissions.request({ permissions: ["history"] });
    if (!granted) { setError("History access was not granted. PAO will remain empty and no browsing data was read."); return; }
    setLoading(true); const result = await send({ type: "BUILD_PROFILE", windowDays }); setLoading(false);
    if (result.ok) setProfile(result.profile ?? null); else setError(result.error);
  }
  async function remove() { if (!confirm("Delete all locally stored PAO data? This cannot be undone.")) return; setLoading(true); const r = await send({ type: "DELETE_ALL" }); setLoading(false); if (r.ok) { setProfile(null); setView("overview"); } else setError(r.error); }
  if (loading) return <main className="center"><div className="mark">◎</div><h1>Building your private view</h1><p>Processing stays on this device.</p></main>;
  if (!profile) return <main className="onboarding"><div className="eyebrow">PERSONAL ALGORITHM OBSERVATORY</div><h1>See the interests your browsing may suggest.</h1><p className="lede">PAO turns recent Chrome history into a private interest profile. Raw URLs are discarded during processing, sensitive sites are filtered first, and nothing is uploaded.</p><div className="promise"><span>Local only</span><span>No accounts</span><span>No tracking</span></div><label>History window<select value={windowDays} onChange={(e) => setWindowDays(Number(e.target.value))}><option value={7}>7 days</option><option value={30}>30 days</option><option value={90}>90 days</option><option value={365}>1 year</option><option value={36500}>All available</option></select></label><button onClick={build}>Build my profile</button><small>Chrome will ask for history access only after you click. You can decline.</small>{error && <p className="error">{error}</p>}</main>;
  const emerging = profile.interests.filter((x) => x.emerging), shown = profile.interests.slice(0, view === "profile" ? 20 : 6);
  return <div className="shell"><header><span className="brand">PAO</span><span className="local">● LOCAL</span></header><main><div className="eyebrow">YOUR INTERNET</div>{view !== "privacy" && <><h1>{view === "profile" ? "My Profile" : "A private view of what seems to interest you."}</h1><p className="muted">Built from {profile.eventsProcessed.toLocaleString()} locally processed history events.</p><section><h2>Top interests</h2>{shown.map((interest) => <div className="interest" key={interest.id}><div><strong>{interest.label}</strong><small>{interest.evidenceCount} signals</small></div><span className={`bucket ${interestBucket(interest).toLowerCase().replace(" ", "-")}`}>{interestBucket(interest)}</span></div>)}</section>{emerging.length > 0 && <section><h2>Emerging</h2>{emerging.slice(0, 5).map((x) => <div className="interest" key={x.id}><strong>{x.label}</strong><span className="rise">↑↑</span></div>)}</section>}<button className="secondary" onClick={build}>Rebuild profile</button></>}{view === "privacy" && <><h1>Your data stays here.</h1><p className="lede">PAO performs classification and scoring inside your browser. Explanations are inferences from observable evidence, never claims about a platform's internal algorithm.</p><section className="stats"><div><strong>{profile.eventsProcessed.toLocaleString()}</strong><span>normalized events</span></div><div><strong>0</strong><span>raw URLs stored</span></div><div><strong>0</strong><span>cookie values stored</span></div><div><strong>0</strong><span>cloud uploads</span></div></section><p className="muted">{profile.filteredEvents.toLocaleString()} unsupported or sensitive entries were excluded before storage.</p><button className="danger" onClick={remove}>Delete all local data</button></>}{error && <p className="error">{error}</p>}</main><nav>{(["overview", "profile", "privacy"] as View[]).map((item) => <button className={view === item ? "active" : ""} onClick={() => setView(item)} key={item}>{item === "profile" ? "My Profile" : item[0].toUpperCase() + item.slice(1)}</button>)}</nav></div>;
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
