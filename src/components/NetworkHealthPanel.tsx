import React, { useEffect, useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Activity, CheckCircle2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NetworkSource {
  source?: string;
  status?: string;
  lastSuccess?: string;
  lastChecked?: string;
  httpCode?: number;
}

interface NetworkHealthResponse {
  sources?: NetworkSource[];
  count?: number;
}

interface NetworkHealthPanelProps {
  defaultOpen?: boolean;
}

const WEBHOOK_URL = "https://n8n.srv1182241.hstgr.cloud/webhook/network-health";

const SOURCE_ORDER = [
  "Hassan’s Recruiter Network",
  "Proviso Jobs",
  "SI Systems Jobs",
  "Insight Global Jobs",
  "Procom Jobs",
  "bifintechleads v4",
];

const normalizeSourceName = (name?: string): string => {
  if (!name) return "";
  const lower = name.toLowerCase().trim();
  if (lower.includes("hassan") || lower.includes("email") || lower.includes("recruiter")) {
    return "Hassan’s Recruiter Network";
  }
  if (lower.includes("proviso")) return "Proviso Jobs";
  if (lower.includes("si systems") || lower.includes("s.i. systems")) return "SI Systems Jobs";
  if (lower.includes("insight global")) return "Insight Global Jobs";
  if (lower.includes("procom")) return "Procom Jobs";
  if (lower.includes("bifintechleads")) return "bifintechleads v4";
  return name.trim();
};

const fallbackData: NetworkHealthResponse = {
  sources: SOURCE_ORDER.map((source) => ({ source, lastSuccess: "—" })),
  count: SOURCE_ORDER.length,
};

const NetworkHealthPanel: React.FC<NetworkHealthPanelProps> = ({ defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [data, setData] = useState<NetworkHealthResponse>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allOnline = true;

  const orderedSources = useMemo(() => {
    const rawSources = Array.isArray(data?.sources) ? data.sources : [];
    const normalizedMap = new Map<string, NetworkSource>();

    rawSources.forEach((source) => {
      const normalized = normalizeSourceName(source?.source);
      if (!normalized) return;
      // Prefer the entry with a real lastSuccess timestamp
      const existing = normalizedMap.get(normalized);
      if (!existing || (!existing.lastSuccess && source?.lastSuccess)) {
        normalizedMap.set(normalized, { ...source, source: normalized });
      }
    });

    return SOURCE_ORDER.map((name) => {
      const found = normalizedMap.get(name);
      return {
        source: name,
        lastSuccess: found?.lastSuccess ?? found?.lastChecked ?? "—",
      };
    });
  }, [data]);

  useEffect(() => {
    let cancelled = false;

    const fetchHealth = async () => {
      try {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(WEBHOOK_URL, {
          method: "GET",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const json = (await response.json()) as NetworkHealthResponse;

        if (!cancelled) {
          if (Array.isArray(json?.sources)) {
            setData(json);
          } else {
            setError("Invalid response format");
          }
        }
      } catch (err) {
        console.error("Network health fetch failed:", err);
        if (!cancelled) {
          setError("Unable to refresh live status");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="volumetric-glass rounded-2xl overflow-hidden shadow-lg mb-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-white/5 transition-colors"
            aria-label="Toggle sources panel"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5" style={{ color: "#00d4ff" }} />
              <span className="text-lg font-bold text-white">🌐 Sources</span>
            </div>

            <div className="flex items-center gap-3">
              {allOnline && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                    color: "#22c55e",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                  }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  All Systems Operational
                </span>
              )}

              {open ? (
                <ChevronUp className="w-5 h-5 text-white/60" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white/60" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="border-t border-white/10 px-4 pb-5 md:px-5 md:pb-6">
            {loading && (
              <p className="text-sm text-white/60 pt-4">Loading live status...</p>
            )}

            {!loading && error && (
              <p className="text-sm text-amber-400 pt-4">{error} — showing last known status.</p>
            )}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {orderedSources.map((source, index) => {
                const isHassan = source.source === "Hassan’s Recruiter Network";
                return (
                  <div
                    key={`${source.source}-${index}`}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#22c55e" }} />
                      <div className="min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: isHassan ? "#FFDD40" : "#ffffff" }}
                        >
                          {source.source}
                        </p>
                        <p className="text-xs text-white/50 truncate">
                          Last ingest: {source.lastSuccess || "—"}
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: "rgba(34, 197, 94, 0.15)",
                        color: "#22c55e",
                      }}
                    >
                      Active
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default NetworkHealthPanel;
