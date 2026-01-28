import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
import { RefreshCw, Search, ArrowUpDown, LogOut } from "lucide-react";
import TopNav from "@/components/TopNav";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  role_current: string;
  years_experience: number;
  biggest_pain_point: string;
  pivot_timeline: string | null;
  whatsapp_number: string | null;
  education_certifications: string | null;
}

type SortField = keyof Lead;
type SortDirection = "asc" | "desc";

// Format timestamp for display
const formatTimestamp = (value: string): string => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return value;
  }
};

const DashboardPage = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You need admin privileges to access this page.",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  const fetchLeads = async () => {
    if (!user || !isAdmin) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("strategy_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      setLeads(data || []);
      toast({
        title: "Data refreshed",
        description: `Loaded ${data?.length || 0} leads`,
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
    if (user && isAdmin && !authLoading) {
      fetchLeads();
    }
  }, [user, isAdmin, authLoading]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
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
          lead.role_current?.toLowerCase().includes(query) ||
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

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="volumetric-glass rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Strategy Session Leads
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Signed in as {user.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={fetchLeads}
                disabled={isLoading}
                className="volumetric-glass-button text-foreground gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
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
                  <SortableHeader field="created_at">Timestamp</SortableHeader>
                  <SortableHeader field="name">Name</SortableHeader>
                  <SortableHeader field="email">Email</SortableHeader>
                  <SortableHeader field="role_current">Current Role</SortableHeader>
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
                  filteredAndSortedLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap">{formatTimestamp(lead.created_at)}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.name || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.email || "-"}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.role_current || "-"}</TableCell>
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
