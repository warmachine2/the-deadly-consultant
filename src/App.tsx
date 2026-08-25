import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import RoadmapPage from "./pages/RoadmapPage";
import AboutPage from "./pages/AboutPage";
import DynamicPage from "./pages/DynamicPage";
import ProductivityTrackerPage from "./pages/ProductivityTrackerPage";
import JobAlertsPage from "./pages/JobAlertsPage";
import BookSessionPage from "./pages/BookSessionPage";
import DashboardPage from "./pages/DashboardPage";
import SystemStatusPage from "./pages/SystemStatusPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
      });
    }
  }, [location.pathname, location.search]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GoogleAnalytics />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/2026-bi-fintech-consulting-roadmap-pdf-unlock" element={<RoadmapPage />} />
            <Route path="/about-post" element={<AboutPage />} />
            <Route path="/3ks-tracker" element={<ProductivityTrackerPage />} />
            <Route path="/ai-bi-fintech-pm-job-alerts-repo" element={<JobAlertsPage />} />
            <Route path="/book-session" element={<BookSessionPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/system-status" element={<SystemStatusPage />} />
            <Route path="/auth" element={<AuthPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="/:slug" element={<DynamicPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
