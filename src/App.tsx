import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/auth" element={<AuthPage />} />
          
          {/* App routes with layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Dashboard />} />
            <Route path="/customers/:id" element={<Dashboard />} />
            <Route path="/actions" element={<Dashboard />} />
            <Route path="/alerts" element={<Dashboard />} />
            <Route path="/assistant" element={<Dashboard />} />
            <Route path="/admin/users" element={<Dashboard />} />
            <Route path="/admin/variables" element={<Dashboard />} />
            <Route path="/admin/logs" element={<Dashboard />} />
          </Route>
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
