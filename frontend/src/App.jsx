import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { Toaster } from "@/components/ui/toaster";

// Layouts
import UserLayout from "@/components/UserLayout";
import AdminLayout from "@/components/AdminLayout";

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

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* User routes */}
            <Route element={<UserLayout />}>
              <Route
                path="/"
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

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/topics" element={<ManageTopics />} />
              <Route path="/admin/debates" element={<ManageDebates />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AdminAuthProvider>
    </ClerkProvider>
  );
}
