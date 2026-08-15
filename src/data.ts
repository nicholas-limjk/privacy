export type SensitiveRule = { pattern: string; category: string; action: "drop" | "domain_only" };

export const sensitiveRules: SensitiveRule[] = [
  { pattern: "localhost", category: "developer_localhost", action: "drop" },
  { pattern: "127.0.0.1", category: "developer_localhost", action: "drop" },
  { pattern: "accounts.google.com", category: "authentication", action: "drop" },
  { pattern: "login.microsoftonline.com", category: "authentication", action: "drop" },
  { pattern: "auth0.com", category: "authentication", action: "drop" },
  { pattern: "1password.com", category: "password_managers", action: "drop" },
  { pattern: "lastpass.com", category: "password_managers", action: "drop" },
  { pattern: "bitwarden.com", category: "password_managers", action: "drop" },
  { pattern: "mail.google.com", category: "webmail", action: "drop" },
  { pattern: "outlook.live.com", category: "webmail", action: "drop" },
  { pattern: "docs.google.com", category: "cloud_documents", action: "drop" },
  { pattern: "drive.google.com", category: "cloud_documents", action: "drop" },
  { pattern: "paypal.com", category: "payments", action: "drop" },
  { pattern: "stripe.com", category: "payments", action: "domain_only" },
  { pattern: ".gov", category: "government_identity", action: "drop" },
  { pattern: "healthcare.gov", category: "healthcare", action: "drop" },
  { pattern: "mychart.", category: "healthcare", action: "drop" }
];

export const domainTaxonomy: Record<string, string[]> = {
  "github.com": ["software_engineering"], "stackoverflow.com": ["software_engineering"],
  "developer.mozilla.org": ["software_engineering"], "npmjs.com": ["software_engineering"],
  "openai.com": ["artificial_intelligence"], "huggingface.co": ["artificial_intelligence"],
  "youtube.com": ["video"], "reddit.com": ["social"], "linkedin.com": ["professional_learning", "job_search"],
  "indeed.com": ["job_search"], "babycenter.com": ["parenting", "baby_products"],
  "watchcharts.com": ["watches", "luxury"], "booking.com": ["travel"], "airbnb.com": ["travel"],
  "amazon.com": ["shopping"], "bestbuy.com": ["electronics"], "investopedia.com": ["investing"]
};

export const keywordTopics: Record<string, string[]> = {
  artificial_intelligence: ["ai", "artificial", "machine", "learning", "llm", "transformer", "neural"],
  software_engineering: ["code", "coding", "developer", "programming", "typescript", "javascript", "python", "react", "api"],
  cybersecurity: ["security", "privacy", "malware", "encryption", "vulnerability"],
  gaming: ["game", "gaming", "steam", "xbox", "playstation"], investing: ["invest", "stock", "etf", "portfolio"],
  crypto: ["crypto", "bitcoin", "ethereum", "blockchain"], property: ["property", "mortgage", "real", "estate"],
  parenting: ["parent", "parenting", "toddler", "newborn"], baby_products: ["baby", "stroller", "crib", "diaper"],
  travel: ["travel", "flight", "hotel", "vacation", "destination"], food: ["food", "recipe", "restaurant", "cooking"],
  education: ["course", "university", "learn", "tutorial"], running: ["running", "marathon", "runner"],
  gym: ["gym", "workout", "fitness"], nutrition: ["nutrition", "protein", "diet"],
  job_search: ["jobs", "career", "hiring", "interview", "resume"], shopping: ["shop", "buy", "sale", "product"],
  electronics: ["laptop", "phone", "camera", "headphones"], automotive: ["car", "vehicle", "automotive"],
  luxury: ["luxury", "designer"], watches: ["watch", "watches", "rolex"]
};
