import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout"; // New: Shared layout for conditional nav
import Index from "./pages/Index";
import RoadmapPage from "./pages/RoadmapPage";
import DynamicPage from "./pages/DynamicPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home: Full TopNav via Layout */}
          <Route path="/" element={
            <Layout>
              <Index />
            </Layout>
          } />
          {/* Roadmap: Banner via Layout */}
          <Route path="/2026-bi-fintech-consulting-roadmap-pdf-unlock" element={
            <Layout>
              <RoadmapPage />
            </Layout>
          } />
          {/* Dynamic Slugs: Banner via Layout */}
          <Route path="/:slug" element={
            <Layout>
              <DynamicPage />
            </Layout>
          } />
          {/* 404: Optional banner – wrap if wanted */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
