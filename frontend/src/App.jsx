import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { Toaster } from "@/components/ui/toaster";

// Layouts
import UserLayout from "@/components/UserLayout";
import AdminLayout from "@/components/AdminLayout";

// Landing
import LandingPage from "@/pages/LandingPage";

// User pages
import Dashboard from "@/pages/user/Dashboard";
import DebateList from "@/pages/user/DebateList";
import DebateDetails from "@/pages/user/DebateDetails";
import Profile from "@/pages/user/Profile";

// Admin pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageTopics from "@/pages/admin/ManageTopics";
import ManageDebates from "@/pages/admin/ManageDebates";
import ManageUsers from "@/pages/admin/ManageUsers";

// 404
import NotFound from "@/pages/NotFound";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

/**
 * UserLayout wrapped in ClerkProvider so Clerk only initialises
 * when the user navigates to a user-facing route.
 */
function ClerkUserLayout() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <UserLayout />
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public landing page — no auth, no Clerk ── */}
            <Route path="/" element={<LandingPage />} />

            {/* ── Admin routes — JWT auth, Clerk never initialises here ── */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/topics" element={<ManageTopics />} />
              <Route path="/admin/debates" element={<ManageDebates />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>

            {/* ── User routes — Clerk loads only for these pages ── */}
            <Route element={<ClerkUserLayout />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/debates"
                element={
                  <ProtectedRoute>
                    <DebateList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/debates/:id"
                element={
                  <ProtectedRoute>
                    <DebateDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ── 404 catch-all ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}
