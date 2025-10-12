import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

export const AdminLayout = () => {

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full min-h-full  p-2 grid grid-rows-1">
        <ScrollArea className="p-2 rounded-sm bg-gray-100">
          <SidebarTrigger />
          <Outlet />
        </ScrollArea>
      </main>
    </SidebarProvider>
  );
};
