export type PropertyScope =
  | "identifier"
  | "device"
  | "page"
  | "campaign"
  | "session"
  | "cart"
  | "experiment"
  | "metadata";

export interface Property {
  name: string;
  type: string;
  description: string;
  scope: PropertyScope;
  source: string;
  platforms: string;
}

export const properties: Property[] = [
  // Identifier Properties
  {
    name: "visitor_id",
    type: "string",
    description: "Unique anonymous visitor identifier, persisted across sessions via cookie or storage.",
    scope: "identifier",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "session_id",
    type: "string",
    description: "Unique session identifier generated on SDK init. Rotates after 30 minutes of inactivity.",
    scope: "identifier",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "customer_id",
    type: "string",
    description: "Authenticated user identifier, set via identify() or loginSuccess().",
    scope: "identifier",
    source: "identify()",
    platforms: "Web, iOS, Android",
  },
  {
    name: "event_id",
    type: "string",
    description: "Unique identifier for each event, used for deduplication.",
    scope: "identifier",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },

  // Device Properties
  {
    name: "device_type",
    type: "string",
    description: "Device form factor: desktop, mobile, or tablet.",
    scope: "device",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "os",
    type: "string",
    description: "Operating system name (e.g., iOS, Android, Windows, macOS).",
    scope: "device",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "os_version",
    type: "string",
    description: "Operating system version string.",
    scope: "device",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "browser",
    type: "string",
    description: "Browser name (e.g., Chrome, Safari, Firefox).",
    scope: "device",
    source: "SDK (auto)",
    platforms: "Web",
  },
  {
    name: "browser_version",
    type: "string",
    description: "Browser version string.",
    scope: "device",
    source: "SDK (auto)",
    platforms: "Web",
  },
  {
    name: "screen_resolution",
    type: "string",
    description: "Screen resolution in WxH format (e.g., 1920x1080).",
    scope: "device",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "app_version",
    type: "string",
    description: "Native app version string from build config.",
    scope: "device",
    source: "SDK (auto)",
    platforms: "iOS, Android",
  },
  {
    name: "sdk_version",
    type: "string",
    description: "Version of the Veya Analytics SDK.",
    scope: "device",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },

  // Page Properties
  {
    name: "page_url",
    type: "string",
    description: "Full URL of the current page (web) or screen route (mobile).",
    scope: "page",
    source: "SDK (auto)",
    platforms: "Web",
  },
  {
    name: "page_path",
    type: "string",
    description: "URL path without query string or hash.",
    scope: "page",
    source: "SDK (auto)",
    platforms: "Web",
  },
  {
    name: "page_title",
    type: "string",
    description: "Document title or screen name.",
    scope: "page",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "page_type",
    type: "string",
    description: "Semantic page type (e.g., menu, checkout, home). Set via pageView().",
    scope: "page",
    source: "pageView()",
    platforms: "Web, iOS, Android",
  },
  {
    name: "referrer",
    type: "string",
    description: "Previous page URL or deep link source.",
    scope: "page",
    source: "SDK (auto)",
    platforms: "Web",
  },

  // Campaign Properties
  {
    name: "utm_source",
    type: "string",
    description: "Campaign source parameter from URL (e.g., google, newsletter).",
    scope: "campaign",
    source: "URL params (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "utm_medium",
    type: "string",
    description: "Campaign medium parameter (e.g., cpc, email, social).",
    scope: "campaign",
    source: "URL params (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "utm_campaign",
    type: "string",
    description: "Campaign name parameter.",
    scope: "campaign",
    source: "URL params (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "utm_term",
    type: "string",
    description: "Campaign keyword/term parameter.",
    scope: "campaign",
    source: "URL params (auto)",
    platforms: "Web",
  },
  {
    name: "utm_content",
    type: "string",
    description: "Campaign content parameter for A/B testing ad variations.",
    scope: "campaign",
    source: "URL params (auto)",
    platforms: "Web",
  },

  // Session Properties
  {
    name: "session_start_time",
    type: "ISO 8601",
    description: "Timestamp when the current session began.",
    scope: "session",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "session_duration",
    type: "number",
    description: "Elapsed time in seconds since session start. Updated on each event.",
    scope: "session",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "is_returning",
    type: "boolean",
    description: "Whether the visitor has had a previous session.",
    scope: "session",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },

  // Cart Properties
  {
    name: "cart_value",
    type: "number",
    description: "Current total value of items in the cart.",
    scope: "cart",
    source: "SDK (computed)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "cart_item_count",
    type: "number",
    description: "Number of items currently in the cart.",
    scope: "cart",
    source: "SDK (computed)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "store_id",
    type: "string",
    description: "Currently selected store identifier, set via setStore().",
    scope: "cart",
    source: "setStore()",
    platforms: "Web, iOS, Android",
  },
  {
    name: "order_type",
    type: "string",
    description: "Current order type: pickup or delivery.",
    scope: "cart",
    source: "setOrderType()",
    platforms: "Web, iOS, Android",
  },

  // Experiment Properties
  {
    name: "experiments",
    type: "object",
    description: "Map of active experiment names to assigned variants. Set via setExperiment().",
    scope: "experiment",
    source: "setExperiment()",
    platforms: "Web, iOS, Android",
  },

  // Metadata Properties
  {
    name: "timestamp",
    type: "ISO 8601",
    description: "ISO 8601 timestamp when the event was created.",
    scope: "metadata",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
  {
    name: "funnel_step",
    type: "number",
    description: "Numeric funnel step (1-5) for conversion tracking events.",
    scope: "metadata",
    source: "SDK (auto)",
    platforms: "Web, iOS, Android",
  },
];

export const scopeLabels: Record<PropertyScope, string> = {
  identifier: "Identifier",
  device: "Device",
  page: "Page",
  campaign: "Campaign",
  session: "Session",
  cart: "Cart",
  experiment: "Experiment",
  metadata: "Metadata",
};

export const scopeColors: Record<PropertyScope, string> = {
  identifier: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  device: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  page: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  campaign: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  session: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cart: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  experiment: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  metadata: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};
