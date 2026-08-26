import React, { useEffect, useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Activity, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface NetworkSource {
  source: string;
  status: string;
  lastChecked: string;
  httpCode?: number;
}

interface NetworkHealthResponse {
  sources: NetworkSource[];
  count?: number;
}

interface NetworkHealthPanelProps {
  defaultOpen?: boolean;
}

const WEBHOOK_URL = "https://n8n.srv1182241.hstgr.cloud/webhook/network-health";

const fallbackData: NetworkHealthResponse = {
  sources: [
    { source: "Proviso Jobs", status: "Online", lastChecked: "-", httpCode: 200 },
    { source: "SI Systems Jobs", status: "Online", lastChecked: "-", httpCode: 200 },
    { source: "Insight Global Jobs", status: "Online", lastChecked: "-", httpCode: 200 },
    { source: "Procom Jobs", status: "Online", lastChecked: "-", httpCode: 200 },
    { source: "bifintechleads v4", status: "Online", lastChecked: "-", httpCode: 200 },
  ],
  count: 5,
};

const isOnline = (status: string): boolean =>
  status.toLowerCase() === "online" || status.toLowerCase() === "up";

const NetworkHealthPanel: React.FC<NetworkHealthPanelProps> = ({ defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [data, setData] = useState<NetworkHealthResponse>(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const allOnline = useMemo(
    () => data.sources.length > 0 && data.sources.every((s) => isOnline(s.status)),
    [data.sources]
  );

  const offlineCount = useMemo(
    () => data.sources.filter((s) => !isOnline(s.status)).length,
    [data.sources]
  );

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
            aria-label="Toggle network health panel"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5" style={{ color: "#00d4ff" }} />
              <span className="text-lg font-bold text-white">🌐 Network Health</span>
            </div>

            <div className="flex items-center gap-3">
              {allOnline ? (
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
              ) : (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    color: "#f59e0b",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                  }}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Attention Needed
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
              {data.sources.map((source, index) => {
                const online = isOnline(source.status);
                return (
                  <div
                    key={`${source.source}-${index}`}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {online ? (
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#22c55e" }} />
                      ) : (
                        <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#ef4444" }} />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{source.source}</p>
                        <p className="text-xs text-white/50 truncate">{source.lastChecked || "—"}</p>
                      </div>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: online
                          ? "rgba(34, 197, 94, 0.15)"
                          : "rgba(239, 68, 68, 0.15)",
                        color: online ? "#22c55e" : "#ef4444",
                      }}
                    >
                      {source.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {offlineCount > 0 && (
              <p className="mt-4 text-sm text-amber-400">
                {offlineCount} source{offlineCount === 1 ? "" : "s"} offline. Job availability may be affected.
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default NetworkHealthPanel;
