import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, List, User, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Don't show on admin routes
  if (location.pathname.startsWith("/admin")) return null;

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/debates", label: "Debates", icon: List },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <img
            src="/debatehub_logo.png"
            alt="DebateHub"
            className="h-7 w-7 invert dark:invert-0"
          />
          <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            DebateHub
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <SignedIn>
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to}>
                <Button
                  variant={location.pathname === to ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </SignedIn>
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>

      {/* Mobile nav */}
      <SignedIn>
        <div className="md:hidden flex border-t">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="flex-1">
              <Button
                variant={location.pathname === to ? "secondary" : "ghost"}
                className="w-full rounded-none gap-1 text-xs h-12"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      </SignedIn>
    </header>
  );
}
