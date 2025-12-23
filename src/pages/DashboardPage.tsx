import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { RefreshCw, Search, ArrowUpDown } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StrategySession = {
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
};

type SortField = keyof StrategySession;
type SortDirection = "asc" | "desc";

export default function DashboardPage() {
  const { user, loading, isAdmin, adminLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Redirect if not logged in or not admin (wait for admin check to complete)
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (!loading && !adminLoading && user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, loading, isAdmin, adminLoading, navigate]);

  // Fetch strategy sessions
  const { data: sessions, isLoading, error, refetch } = useQuery({
    queryKey: ["strategy-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("strategy_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as StrategySession[];
    },
    enabled: !!user && isAdmin,
  });

  // Set up realtime subscription
  useEffect(() => {
    if (!user || !isAdmin) return;

    const channel = supabase
      .channel("strategy-sessions-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "strategy_sessions",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["strategy-sessions"] });
          toast({
            title: "Data Updated",
            description: "New submission received!",
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin, queryClient]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error]);

  // Filter and sort data
  const filteredSessions = sessions
    ?.filter((session) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        session.name.toLowerCase().includes(searchLower) ||
        session.email.toLowerCase().includes(searchLower) ||
        session.role_current.toLowerCase().includes(searchLower) ||
        session.biggest_pain_point.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue === null) return 1;
      if (bValue === null) return -1;
      
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil((filteredSessions?.length || 0) / itemsPerPage);
  const paginatedSessions = filteredSessions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              Strategy Session Leads (Private Dashboard)
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, role, or pain point..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-md"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {filteredSessions?.length || 0} total leads
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading sessions...</p>
          ) : paginatedSessions && paginatedSessions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <SortableHeader field="created_at">Created At</SortableHeader>
                      <SortableHeader field="name">Name</SortableHeader>
                      <SortableHeader field="email">Email</SortableHeader>
                      <SortableHeader field="role_current">Role</SortableHeader>
                      <SortableHeader field="years_experience">Years Exp</SortableHeader>
                      <TableHead className="min-w-[200px]">Biggest Pain Point</TableHead>
                      <SortableHeader field="pivot_timeline">Pivot Timeline</SortableHeader>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Education/Certs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="whitespace-nowrap">
                          {format(new Date(session.created_at), "MMM d, yyyy HH:mm")}
                        </TableCell>
                        <TableCell className="font-medium">{session.name}</TableCell>
                        <TableCell>
                          <a
                            href={`mailto:${session.email}`}
                            className="text-primary hover:underline"
                          >
                            {session.email}
                          </a>
                        </TableCell>
                        <TableCell>{session.role_current}</TableCell>
                        <TableCell className="text-center">{session.years_experience}</TableCell>
                        <TableCell>
                          <span className="font-bold text-destructive">
                            {session.biggest_pain_point}
                          </span>
                        </TableCell>
                        <TableCell>{session.pivot_timeline || "—"}</TableCell>
                        <TableCell>
                          {session.whatsapp_number ? (
                            <a
                              href={`https://wa.me/${session.whatsapp_number.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {session.whatsapp_number}
                            </a>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {session.education_certifications || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No strategy sessions found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
