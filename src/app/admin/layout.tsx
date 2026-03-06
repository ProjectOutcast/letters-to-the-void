import { redirect } from "next/navigation";
import { auth } from "@/lib/auth-config";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ToastProvider } from "@/components/ui/toast";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <ToastProvider>
      <div className="min-h-screen bg-void">
        <AdminSidebar
          userRole={session.user.role}
          userName={session.user.name || session.user.email}
        />
        <main className="pt-14 lg:ml-56 lg:pt-0">
          <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
