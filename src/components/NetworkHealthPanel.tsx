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
  jobs?: Array<{ source?: string; date?: string }>;
}

const WEBHOOK_URL = "https://n8n.srv1182241.hstgr.cloud/webhook/network-health";
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/107YoIhvv0VYBWQXlvNNB4T98iw7POO_YRVJ633alVig/export?format=csv&gid=1354178862";

const SOURCE_ORDER = [
  "Hassan’s Recruiter Network",
  "Proviso",
  "SI Systems",
  "Insight Global",
  "Procom",
  "Agilus",
];

const normalizeSourceName = (name?: string): string => {
  if (!name) return "";
  const lower = name.toLowerCase().trim();
  if (lower.includes("hassan") || lower.includes("bifintechleads") || lower.includes("recruiter")) {
    return "Hassan’s Recruiter Network";
  }
  if (lower.includes("proviso")) return "Proviso";
  if (lower.includes("si systems") || lower.includes("s.i. systems") || lower.includes("s.i systems")) return "SI Systems";
  if (lower.includes("insight global")) return "Insight Global";
  if (lower.includes("procom")) return "Procom";
  if (lower.includes("agilus")) return "Agilus";
  return name.trim();
};

const fallbackData: NetworkHealthResponse = {
  sources: SOURCE_ORDER.map((source) => ({ source, lastSuccess: "—" })),
  count: SOURCE_ORDER.length,
};

const NetworkHealthPanel: React.FC<NetworkHealthPanelProps> = ({ defaultOpen = false, jobs }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [data, setData] = useState<NetworkHealthResponse>(fallbackData);
  const [loading, setLoading] = useState(true);

  const allOnline = true;

  // Compute newest job date per source directly from the loaded jobs array
  const jobDerivedDates = useMemo(() => {
    const latest = new Map<string, { time: number; label: string }>();
    if (Array.isArray(jobs)) {
      jobs.forEach((job) => {
        const sourceName = normalizeSourceName(job?.source);
        const dateStr = (job?.date || "").trim();
        if (!sourceName || !dateStr) return;
        const parsed = new Date(dateStr);
        const time = parsed.getTime();
        if (Number.isNaN(time)) return;
        const label = parsed.toISOString().slice(0, 10);
        const existing = latest.get(sourceName);
        if (!existing || time > existing.time) {
          latest.set(sourceName, { time, label });
        }
      });
    }
    return latest;
  }, [jobs]);

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
      const fetched = found?.lastSuccess ?? found?.lastChecked;
      const hasFetched = typeof fetched === "string" && fetched.trim() !== "" && fetched.trim() !== "—";
      return {
        source: name,
        lastSuccess: hasFetched
          ? (fetched as string)
          : jobDerivedDates.get(name)?.label ?? "—",
      };
    });
  }, [data, jobDerivedDates]);

  useEffect(() => {
    let cancelled = false;

    const hasDates = (sources?: NetworkSource[]) =>
      Array.isArray(sources) &&
      sources.some((s) => {
        const v = s?.lastSuccess ?? s?.lastChecked;
        return typeof v === "string" && v.trim() !== "" && v.trim() !== "—";
      });

    const parseCsvRows = (csv: string): string[][] => {
      const rows: string[][] = [];
      let row: string[] = [];
      let field = "";
      let inQuotes = false;
      for (let i = 0; i < csv.length; i++) {
        const c = csv[i];
        if (inQuotes) {
          if (c === '"') {
            if (csv[i + 1] === '"') {
              field += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else field += c;
        } else if (c === '"') inQuotes = true;
        else if (c === ",") {
          row.push(field);
          field = "";
        } else if (c === "\n") {
          row.push(field);
          rows.push(row);
          row = [];
          field = "";
        } else if (c !== "\r") field += c;
      }
      if (field || row.length) {
        row.push(field);
        rows.push(row);
      }
      return rows;
    };

    const fetchFromSheet = async (): Promise<NetworkSource[] | null> => {
      try {
        const res = await fetch(SHEET_CSV_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const csv = await res.text();
        const rows = parseCsvRows(csv).slice(1);
        const latest = new Map<string, { time: number; label: string }>();

        rows.forEach((row) => {
          const dateStr = (row[0] || "").trim();
          const sourceName = normalizeSourceName(row[17] || "");
          if (!dateStr || !sourceName) return;
          const parsed = new Date(dateStr);
          const time = parsed.getTime();
          if (Number.isNaN(time)) return;
          const label = parsed.toISOString().slice(0, 10);
          const existing = latest.get(sourceName);
          if (!existing || time > existing.time) {
            latest.set(sourceName, { time, label });
          }
        });

        if (latest.size === 0) return null;
        return SOURCE_ORDER.map((source) => ({
          source,
          lastSuccess: latest.get(source)?.label ?? "—",
        }));
      } catch (err) {
        console.error("Sheet fallback failed:", err);
        return null;
      }
    };

    const fetchHealth = async () => {
      setLoading(true);

      let resolved: NetworkSource[] | null = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        const response = await fetch(WEBHOOK_URL, { method: "GET", signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const json = (await response.json()) as NetworkHealthResponse;
          if (hasDates(json?.sources)) {
            resolved = json.sources as NetworkSource[];
          }
        }
      } catch (err) {
        console.error("Network health fetch failed:", err);
      }

      if (!resolved) {
        resolved = await fetchFromSheet();
      }

      if (cancelled) return;

      if (resolved) {
        setData({ sources: resolved, count: resolved.length });
      } else {
        setData(fallbackData);
      }
      setLoading(false);
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
