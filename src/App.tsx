import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import RoadmapPage from "./pages/RoadmapPage";
import AboutPage from "./pages/AboutPage";
import DynamicPage from "./pages/DynamicPage";
import ProductivityTrackerPage from "./pages/ProductivityTrackerPage";
import JobAlertsPage from "./pages/JobAlertsPage";
import AuthPage from "./pages/AuthPage";
import AdminSetupPage from "./pages/AdminSetupPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/admin-setup" element={<AdminSetupPage />} />
            <Route path="/2026-bi-fintech-consulting-roadmap-pdf-unlock" element={<RoadmapPage />} />
            <Route path="/about-post" element={<AboutPage />} />
            <Route path="/3ks-tracker" element={<ProductivityTrackerPage />} />
            <Route path="/ai-bi-fintech-pm-job-alerts-repo" element={<JobAlertsPage />} />
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
