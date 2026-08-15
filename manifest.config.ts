import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "Personal Algorithm Observatory",
  short_name: "PAO",
  version: "0.1.0",
  description: "A private, local view of the interests reflected in your browsing history.",
  permissions: ["storage", "sidePanel"],
  optional_permissions: ["history"],
  background: { service_worker: "src/background.ts", type: "module" },
  side_panel: { default_path: "index.html" },
  action: { default_title: "Open Personal Algorithm Observatory" }
});
