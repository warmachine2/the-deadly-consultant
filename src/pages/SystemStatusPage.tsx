import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StatusEntry {
  date: string;
  feature: string;
  timestamp: string;
  status: "up" | "down";
}

const statusData: StatusEntry[] = [
  { date: "2026-01-26", feature: "Home Page", timestamp: "8:40 AM", status: "up" },
  { date: "2026-01-26", feature: "Modal Pop-up", timestamp: "8:40 AM", status: "down" },
  { date: "2026-01-26", feature: "Job Board Page", timestamp: "8:40 AM", status: "up" },
  { date: "2026-01-26", feature: "Email Alerts System", timestamp: "8:40 AM", status: "up" },
  { date: "2026-01-26", feature: "n8n Workflows", timestamp: "8:40 AM", status: "up" },
];

const SystemStatusPage = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      window.location.reload();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

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
          <p className="text-muted-foreground text-sm">
            Last updated: {formatTimestamp(lastUpdated)}
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block rounded-lg border border-border/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-foreground font-semibold">Date</TableHead>
                <TableHead className="text-foreground font-semibold">Feature/Page</TableHead>
                <TableHead className="text-foreground font-semibold">Timestamp</TableHead>
                <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusData.map((entry, index) => (
                <TableRow key={index} className="border-border/30">
                  <TableCell className="text-muted-foreground">{entry.date}</TableCell>
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
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{entry.date}</span>
                <span>{entry.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Auto-refreshes every 5 minutes
        </p>
      </div>
    </div>
  );
};

const StatusIndicator = ({ status }: { status: "up" | "down" }) => {
  if (status === "up") {
    return (
      <div className="inline-flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
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
