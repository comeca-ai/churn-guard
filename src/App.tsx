import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth";
import { AppLayout } from "@/components/layout";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CustomerDetail from "./pages/CustomerDetail";
import ActionPlans from "./pages/ActionPlans";
import Assistant from "./pages/Assistant";
import Alerts from "./pages/Alerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected layout wrapper component
function ProtectedAppLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}

// Admin protected component wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      {children}
    </ProtectedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* App routes with layout - protected */}
            <Route element={<ProtectedAppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Dashboard />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/actions" element={<ActionPlans />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/assistant" element={<Assistant />} />
              
              {/* Admin routes - require admin role */}
              <Route path="/admin/users" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/variables" element={<AdminRoute><Dashboard /></AdminRoute>} />
              <Route path="/admin/logs" element={<AdminRoute><Dashboard /></AdminRoute>} />
            </Route>
            
            {/* Redirects */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
