import { AppShell } from "@/components/layout/app-shell";
import { Chatbot } from "@/components/support/chatbot";
import { adminNavigation } from "@/config/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sidebarItems={adminNavigation} fallbackRole="admin">
      {children}
      <Chatbot />
    </AppShell>
  );
}

