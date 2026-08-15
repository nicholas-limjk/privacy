export interface RawHistoryEvent { url: string; title?: string; lastVisitTime?: number; visitCount?: number; typedCount?: number }
export interface TopicScore { topic: string; score: number }
export type SourceType = "search" | "article" | "product" | "video" | "social" | "documentation" | "other";
export interface NormalizedHistoryEvent {
  id: string; timestamp: number; domain: string; pathTokens?: string[]; sourceType: SourceType;
  topics: TopicScore[]; entities?: string[]; visitWeight: number;
}
export interface Interest {
  id: string; label: string; score: number; shortTermScore: number; longTermScore: number;
  firstSeen: number; lastSeen: number; evidenceCount: number;
  sourceWeights: { history: number; search: number; exposure: number; interaction: number };
  emerging?: boolean;
}
export interface Profile { interests: Interest[]; eventsProcessed: number; filteredEvents: number; builtAt: number; windowDays: number }
export interface ProfileState { onboarded: boolean; profile: Profile | null }
