import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import RoadmapPage from "./pages/RoadmapPage";
import AboutPage from "./pages/AboutPage";
import DynamicPage from "./pages/DynamicPage";
import ProductivityTrackerPage from "./pages/ProductivityTrackerPage";
import JobAlertsPage from "./pages/JobAlertsPage";
import BookSessionPage from "./pages/BookSessionPage";
import AreYouReadyToPivotPage from "./pages/AreYouReadyToPivotPage";
import FreeWorkshopPage from "./pages/FreeWorkshopPage";
import SeatIntakePage from "./pages/SeatIntakePage";
import FreeWorkshopThankYouPage from "./pages/FreeWorkshopThankYouPage";
import FreeWorkshopJoinPage from "./pages/FreeWorkshopJoinPage";
import FreeWorkshopReplayPage from "./pages/FreeWorkshopReplayPage";
import DashboardPage from "./pages/DashboardPage";
import SystemStatusPage from "./pages/SystemStatusPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import ProofPage from "./pages/ProofPage";

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

const JOB_BOARD_PATHS = ["/ai-bi-fintech-pm-job-alerts-repo", "/pm-job-board-canada"];
const KIT_SELECTORS =
  '.formkit-modal, .formkit-slide-in, [data-uid="63221ca346"], [data-uid="28fef2dc22"], div[id^="formkit-"]';

const JobBoardKitGuard = () => {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const onBoard = JOB_BOARD_PATHS.some((p) => path.includes(p));
    const targets = [document.documentElement, document.body];
    if (!onBoard) {
      targets.forEach((el) => el.classList.remove("job-board-page"));
      return;
    }
    targets.forEach((el) => el.classList.add("job-board-page", "job-board-unlocked"));
    const purge = () => {
      document.querySelectorAll<HTMLElement>(KIT_SELECTORS).forEach((el) => {
        if (el.tagName === "SCRIPT") return;
        el.remove();
      });
    };
    purge();
    const observer = new MutationObserver(purge);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [location.pathname]);
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
          <JobBoardKitGuard />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/2026-bi-fintech-consulting-roadmap-pdf-unlock" element={<RoadmapPage />} />
            <Route path="/about-post" element={<AboutPage />} />
            <Route path="/about" element={<Navigate to="/about-post" replace />} />

            <Route path="/3ks-tracker" element={<ProductivityTrackerPage />} />
            <Route path="/ai-bi-fintech-pm-job-alerts-repo" element={<JobAlertsPage />} />
            <Route path="/pm-job-board-canada" element={<Navigate to="/ai-bi-fintech-pm-job-alerts-repo" replace />} />

            <Route path="/book-session" element={<BookSessionPage />} />
            <Route path="/are-you-ready-to-pivot-to-pm-consulting" element={<AreYouReadyToPivotPage />} />
            <Route path="/free-workshop" element={<FreeWorkshopPage />} />
            <Route path="/free-workshop/thank-you" element={<FreeWorkshopThankYouPage />} />
            <Route path="/free-workshop/join" element={<FreeWorkshopJoinPage />} />
            <Route path="/free-workshop/replay" element={<FreeWorkshopReplayPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/system-status" element={<SystemStatusPage />} />
            <Route path="/pm-strategy-guide-pdf" element={<Navigate to="/2026-bi-fintech-consulting-roadmap-pdf-unlock" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/proof" element={<ProofPage />} />
            <Route path="/seat" element={<SeatIntakePage />} />
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
