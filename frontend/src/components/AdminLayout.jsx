import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout() {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 p-4 pt-14 md:pt-8 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
