import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/ui/AppSidebar";
import { useSidebarState } from "./hooks/useSidebarState";
import { Header } from "./components/section/Header";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "./providers/ThemeProvider";

// Lazy-loaded components
const Home = React.lazy(() => import("./pages/Home"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const VerifyEmail = React.lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Wallet = React.lazy(() => import("./pages/Wallet"));
const Profile = React.lazy(() => import("./pages/Profile"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const DashboardLayout = () => {
  const [defaultOpen] = useSidebarState();

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-full overflow-hidden">
        <div className="h-full shrink-0">
          <AppSidebar />
        </div>
        <div
          className={cn(
            "flex flex-col flex-1 transition-all duration-300 ease-in-out",
            defaultOpen ? "w-[calc(100%-16rem)]" : "w-[calc(100%-3rem)]"
          )}
        >
          <Header />
          <main className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="ui-theme">
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
            </Route>

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/wallet" element={<Wallet />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
