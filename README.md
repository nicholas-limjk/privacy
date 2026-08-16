# Personal Algorithm Observatory

See what an algorithm could infer from your recent browsing—without sending that history anywhere.

PAO is a local-first Chrome MV3 extension that converts recent browser history into a deterministic interest profile. It has no backend, analytics, cookie access, host permissions, or network-based classification.

## Why it matters

Recommendation systems routinely infer interests behind the scenes. PAO makes that process visible and inspectable while keeping the underlying browsing data on the user's device.

## How it works

```mermaid
flowchart LR
    H["Recent Chrome history"] --> N["Strip sensitive and identifying URL data"]
    N --> C["Deterministic local classification"]
    C --> P["Private interest profile"]
    P --> I["Local IndexedDB storage"]
    I --> D["Review or delete everything"]
```

1. The user explicitly clicks **Build my profile**.
2. PAO reads recent history through Chrome's permission API.
3. Sensitive domains and identifying URL components are removed.
4. Local rules derive topics and interests.
5. The side panel presents the profile and lets the user erase it.

## Privacy guarantees

- All classification happens inside the extension.
- No telemetry, analytics, cookies, or remote API calls.
- Query strings, fragments, credentials, and opaque path identifiers are discarded.
- Only normalized tokens, topics, timestamps, and derived interests enter IndexedDB.
- **Delete all local data** removes the PAO database and extension-local settings.

## Tech

React, TypeScript, Chrome Manifest V3, CRXJS, Vite, Vitest, and IndexedDB.

## Run locally

```bash
npm install
npm test
npm run build
```

Open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select `dist`. Open PAO from the Chrome toolbar; it appears in the side panel.

For live development:

```bash
npm run dev
```

Keep the terminal running after loading `dist`. Chrome may require an extension reload after manifest or permission changes.

## Validation

- 9 automated tests covering classification, interest aggregation, privacy filtering, and storage.
- TypeScript checking and a production extension build.
