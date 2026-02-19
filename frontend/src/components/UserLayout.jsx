import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useSyncUser } from "@/hooks/useSyncUser";

export default function UserLayout() {
  useSyncUser();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
