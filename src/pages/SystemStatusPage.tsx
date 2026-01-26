import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, RefreshCw } from "lucide-react";

interface StatusEntry {
  feature: string;
  timestamp: string;
  status: "up" | "down";
}

const SHEET_ID = "1NdwYdOOS7h2v3yIKKGeb4SNeb7ln-vg-jrcYK0SbQbw";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

const fallbackData: StatusEntry[] = [
  { feature: "Home Page", timestamp: "8:40 AM", status: "up" },
  { feature: "Modal Pop-up", timestamp: "8:40 AM", status: "down" },
  { feature: "Job Board Page", timestamp: "8:40 AM", status: "up" },
  { feature: "Email Alerts System", timestamp: "8:40 AM", status: "up" },
  { feature: "n8n Workflows", timestamp: "8:40 AM", status: "up" },
];

const parseCSV = (csv: string): StatusEntry[] => {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  // Skip header row
  const dataRows = lines.slice(1);
  
  return dataRows.map((row) => {
    // Handle CSV parsing with potential quoted values
    const values = row.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    
    const feature = values[0] || "Unknown";
    const timestamp = values[1] || "N/A";
    const statusRaw = (values[2] || "").toLowerCase();
    const status: "up" | "down" = statusRaw === "up" ? "up" : "down";
    
    return { feature, timestamp, status };
  }).filter((entry) => entry.feature && entry.feature !== "Unknown");
};

const SystemStatusPage = () => {
  const [statusData, setStatusData] = useState<StatusEntry[]>(fallbackData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(CSV_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      
      const csvText = await response.text();
      const parsed = parseCSV(csvText);
      
      if (parsed.length > 0) {
        setStatusData(parsed);
        console.log("Status data loaded from sheet:", parsed);
      } else {
        console.log("No data from sheet, using fallback");
        setStatusData(fallbackData);
      }
    } catch (err) {
      console.error("Error fetching status:", err);
      setError("Failed to load live data. Showing cached status.");
      setStatusData(fallbackData);
    } finally {
      setLastUpdated(new Date());
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            System Control Panel
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
            <span>Last updated: {formatTimestamp(lastUpdated)}</span>
            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="p-1 hover:text-primary transition-colors disabled:opacity-50"
              title="Refresh now"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
          {error && (
            <p className="text-amber-500 text-xs mt-2">{error}</p>
          )}
        </div>

        {isLoading && statusData === fallbackData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading status...</span>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-foreground font-semibold">Feature/Page</TableHead>
                    <TableHead className="text-foreground font-semibold">Timestamp</TableHead>
                    <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statusData.map((entry, index) => (
                    <TableRow key={index} className="border-border/30">
                      <TableCell className="font-medium">{entry.feature}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.timestamp}</TableCell>
                      <TableCell className="text-center">
                        <StatusIndicator status={entry.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Stacked Cards */}
            <div className="md:hidden space-y-4">
              {statusData.map((entry, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 bg-muted/10 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-lg">{entry.feature}</span>
                    <StatusIndicator status={entry.status} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>{entry.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Auto-refreshes every 5 minutes • Data from Google Sheets
        </p>
      </div>
    </div>
  );
};

const StatusIndicator = ({ status }: { status: "up" | "down" }) => {
  if (status === "up") {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
        <span className="text-green-500 text-sm font-medium">Up</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="w-3 h-3 rotate-45 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
      <span className="text-red-500 text-sm font-medium">Down</span>
    </div>
  );
};

export default SystemStatusPage;
