import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Search, ArrowUpDown } from "lucide-react";
import TopNav from "@/components/TopNav";

const DASHBOARD_PASSWORD = "BIFINTECHLEADS123!@#";
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzSbicZVOIE_oFhdlUiQrnRAbVGg9PxP0cIzAAZ1cWa7MbQRVbBM-W4kYPM15m_zsCY/exec";

interface Lead {
  timestamp: string;
  name: string;
  email: string;
  current_role: string;
  years_experience: number;
  biggest_pain_point: string;
  pivot_timeline: string;
  whatsapp_number: string;
  education_certifications: string;
}

type SortField = keyof Lead;
type SortDirection = "asc" | "desc";

const DashboardPage = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      console.log("Dashboard response.submissions:", data.submissions);
      
      // Map GSheet column names to our Lead interface
      const mappedLeads: Lead[] = (data.submissions || []).map((row: Record<string, unknown>) => ({
        timestamp: row["Timestamp"] || "",
        name: row["Name"] || "",
        email: row["Email"] || "",
        current_role: row["Current Role"] || "",
        years_experience: Number(row["Years Experience"]) || 0,
        biggest_pain_point: row["Biggest Pain Point"] || "",
        pivot_timeline: row["Pivot Timeline"] || "",
        whatsapp_number: row["WhatsApp Number"] || "",
        education_certifications: row["Education Certifications"] || "",
      }));
      
      setLeads(mappedLeads);
      toast({
        title: "Data refreshed",
        description: `Loaded ${mappedLeads.length} leads`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch leads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const filteredAndSortedLeads = useMemo(() => {
    let result = [...leads];

    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query) ||
          lead.current_role?.toLowerCase().includes(query) ||
          lead.biggest_pain_point?.toLowerCase().includes(query)
      );
    }

    // Sort
    result.sort((a, b) => {
      const aValue = a[sortField] ?? "";
      const bValue = b[sortField] ?? "";

      if (sortField === "years_experience") {
        return sortDirection === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      const comparison = String(aValue).localeCompare(String(bValue));
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [leads, searchQuery, sortField, sortDirection]);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      </div>
    </TableHead>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="volumetric-glass rounded-2xl p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-foreground mb-6 text-center">
            Dashboard Access
          </h1>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="bg-input border-border"
            />
            {passwordError && (
              <p className="text-destructive text-sm font-medium">Access Denied</p>
            )}
            <Button type="submit" className="w-full volumetric-glass-button text-foreground">
              Enter
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="volumetric-glass rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Strategy Session Leads (Private Dashboard)
            </h1>
            <Button
              onClick={fetchLeads}
              disabled={isLoading}
              className="volumetric-glass-button text-foreground gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, role, or pain point..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="timestamp">Timestamp</SortableHeader>
                  <SortableHeader field="name">Name</SortableHeader>
                  <SortableHeader field="email">Email</SortableHeader>
                  <SortableHeader field="current_role">Current Role</SortableHeader>
                  <SortableHeader field="years_experience">Years Exp.</SortableHeader>
                  <SortableHeader field="biggest_pain_point">Biggest Pain Point</SortableHeader>
                  <SortableHeader field="pivot_timeline">Pivot Timeline</SortableHeader>
                  <SortableHeader field="whatsapp_number">WhatsApp</SortableHeader>
                  <SortableHeader field="education_certifications">Education/Certs</SortableHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredAndSortedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedLeads.map((lead, index) => (
                    <TableRow key={index}>
                      <TableCell className="whitespace-nowrap">{lead.timestamp || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.name || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.email || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.current_role || "-"}</TableCell>
                      <TableCell>{lead.years_experience ?? "-"}</TableCell>
                      <TableCell className="font-bold text-destructive max-w-[200px] truncate">
                        {lead.biggest_pain_point || "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{lead.pivot_timeline || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.whatsapp_number || "-"}</TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {lead.education_certifications || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Showing {filteredAndSortedLeads.length} of {leads.length} leads
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
