import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export const AdminLayout = () => {
  return (
    <SidebarProvider className="h-screen grid grid-cols-[auto_1fr] overflow-hidden">
      <AdminSidebar />
      <main className="relative h-full overflow-hidden">
        <SidebarTrigger className="absolute top-2 left-2 z-10 bg-gray-300" />
        <div className="p-2 pt-2 bg-gray-100 min-h-full flex justify-center">
          <section className="w-5/6">
            <Outlet />
          </section>
        </div>
      </main>
    </SidebarProvider>
  );
};
