# Personal Algorithm Observatory

PAO is a local-first Chrome MV3 extension that turns recent browsing history into a private, deterministic interest profile. It has no backend, analytics, cookie access, host permissions, or network-based classification.

## Develop

```bash
npm install
npm test
npm run build
```

Load the generated `dist` directory from `chrome://extensions` using **Load unpacked**. Open PAO from the toolbar; Chrome opens it in the side panel. History access is requested only when **Build my profile** is clicked.

## Development

Run the CRXJS development server:

```bash
npm run dev
```

Load `dist` as an unpacked extension once. CRXJS keeps the extension output connected to Vite and hot-updates the React side panel as source files change. Keep the terminal running while developing. Chrome may still require an extension reload after manifest or permission changes.

## Privacy design

- Sensitive domains are filtered before classification.
- Query strings, fragments, credentials, and opaque path identifiers are discarded.
- Only normalized domain/path tokens, topics, event timestamps, and derived interests enter IndexedDB.
- All processing runs in the extension. There is no telemetry or remote API.
- **Delete all local data** deletes the PAO IndexedDB database and extension-local settings.
