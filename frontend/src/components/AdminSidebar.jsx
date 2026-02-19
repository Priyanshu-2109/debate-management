import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  LogOut,
  MessageSquare,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/topics", label: "Topics", icon: FileText },
    { to: "/admin/debates", label: "Debates", icon: Calendar },
    { to: "/admin/users", label: "Users", icon: Users },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 font-bold text-xl"
          onClick={() => setMobileOpen(false)}
        >
          <MessageSquare className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </Link>
        {admin && (
          <p className="text-xs text-muted-foreground mt-1">{admin.email}</p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} onClick={() => setMobileOpen(false)}>
            <Button
              variant={location.pathname === to ? "secondary" : "ghost"}
              className="w-full justify-start gap-3"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Link to="/" onClick={() => setMobileOpen(false)}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Site
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r flex flex-col transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 min-h-screen border-r bg-card flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
